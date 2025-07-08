from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_DIR = os.path.join(app.root_path, 'data')

# === ROUTES ===
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data/sankey/<int:num>")
def sankey_data(num):
    filename = f"sankey_{num}.json"
    with open(os.path.join(DATA_DIR, filename)) as f:
        return jsonify(json.load(f))

@app.route("/data/heatmap/<int:num>")
def heatmap_data(num):
    filename = f"heatmap_{num}.json"
    with open(os.path.join(DATA_DIR, filename)) as f:
        return jsonify(json.load(f))

@app.route('/data/tda/<int:num>')
def tda_data(num):
    filename = f"tda_{num}.json"
    with open(os.path.join(DATA_DIR, filename)) as f:
        return jsonify(json.load(f))

if __name__ == '__main__':
    app.run(debug=True)
