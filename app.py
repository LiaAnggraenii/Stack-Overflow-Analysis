from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# === ROUTES ===
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_heatmap_data")
def get_heatmap_data():
    reputation = request.args.get("reputation")  # 'high', 'mid', 'low'

    with open("data/heatmap_data.json") as f:
        all_data = json.load(f)

    data = all_data.get(reputation, {})  # Ambil data sesuai reputasi
    return jsonify(data)

@app.route("/get_sankey_data")
def get_sankey_data():
    with open("data/sankey_data.json") as f:
        data = json.load(f)
    return jsonify(data)

# Tambahkan route lain kalau perlu (misal TDA, filter tahun, dll)

if __name__ == "__main__":
    app.run(debug=True)
