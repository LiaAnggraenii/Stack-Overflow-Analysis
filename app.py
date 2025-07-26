from flask import Flask, render_template, request, jsonify
import io
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        text = file.stream.read().decode("utf-8", errors="ignore")
        sample = text[:2048]

        try:
            dialect = csv.Sniffer().sniff(sample)
        except csv.Error:
            dialect = csv.excel

        stream = io.StringIO(text, newline=None)
        reader = csv.DictReader(stream, dialect=dialect)
        rows = list(reader)

        if not rows:
            return jsonify({'error': 'Empty file'}), 400

        headers = reader.fieldnames

        if len(headers) < 2:
            return jsonify({'error': 'File harus punya minimal 2 kolom'}), 400

        *path_cols, last_col = headers

        # Coba deteksi apakah kolom terakhir adalah value numerik
        try:
            float(rows[0][last_col])
            value_col = last_col
            path_cols = headers[:-1]
        except:
            value_col = None
            path_cols = headers

        links = {}
        for row in rows:
            path = [row[col].strip() for col in path_cols]
            val = int(float(row[value_col])) if value_col else 1

            for i in range(len(path) - 1):
                pair = (path[i], path[i+1])
                links[pair] = links.get(pair, 0) + val

        data = [{'source': s, 'target': t, 'value': v} for (s, t), v in links.items()]

        return jsonify({'data': data})

    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

@app.route('/upload_heatmap', methods=['POST'])
def upload_heatmap():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        text = file.stream.read().decode("utf-8", errors="ignore")
        lines = text.strip().split('\n')
        reader = csv.reader(lines, delimiter=';')

        headers = next(reader)[1:]  
        rows = []
        z_data = []

        for row in reader:
            rows.append(row[0])  # label baris
            z_row = [float(val) if val else 0 for val in row[1:]]
            z_data.append(z_row)
            
        # Normalisasi kolom ke persen
        z_transposed = list(map(list, zip(*z_data)))
        normalized = []

        for col in z_transposed:
            col_sum = sum(col)
            if col_sum == 0:
                normalized.append([0 for _ in col])
            else:
                normalized.append([round((val / col_sum) * 100, 1) for val in col])

        z_normalized = list(map(list, zip(*normalized)))

        return jsonify({'z': z_normalized, 'x': headers, 'y': rows})

    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
