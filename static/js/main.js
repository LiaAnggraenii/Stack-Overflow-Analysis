// 📤 Upload & Tampilkan Sankey
document.getElementById('uploadTrigger').addEventListener('click', function () {
    document.getElementById('fileElem').click();
});

document.getElementById('fileElem').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            alert(result.error);
            return;
        }

        const data = result.data;

        const labels = [];
        const nodeMap = {};

        data.forEach(link => {
            if (!(link.source in nodeMap)) {
                nodeMap[link.source] = labels.length;
                labels.push(link.source);
            }
            if (!(link.target in nodeMap)) {
                nodeMap[link.target] = labels.length;
                labels.push(link.target);
            }
        });

        const sourceIndices = data.map(d => nodeMap[d.source]);
        const targetIndices = data.map(d => nodeMap[d.target]);
        const values = data.map(d => d.value);

        function getRandomPastelColor() {
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, 70%, 75%)`;
        }

        const nodeColors = labels.map(() => getRandomPastelColor());

        const sankeyData = {
            type: "sankey",
            orientation: "h",
            node: {
                pad: 15,
                thickness: 20,
                line: { color: "black", width: 0.5 },
                label: labels,
                color: nodeColors
            },
            link: {
                source: sourceIndices,
                target: targetIndices,
                value: values
            }
        };

        const layout = {
            font: { size: 14 },
            height: 500,
            width: 1000,
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 10
            },
            type: "sankey",
            orientation: "v"
        };

        Plotly.newPlot("sankey-chart", [sankeyData], layout, { responsive: true });

        // ✅ Tampilkan semua container
        document.getElementById('visualization').style.display = 'block';
        document.getElementById('sankey-chart').style.display = 'block';
    })
    .catch(err => {
        console.error("Upload error:", err);
        alert("Terjadi kesalahan saat mengunggah file.");
    });
});


// 📤 Upload & Tampilkan Heatmap
document.getElementById('heatmapTrigger').addEventListener('click', function () {
    document.getElementById('heatmapFile').click();
});

document.getElementById('heatmapFile').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch('/upload_heatmap', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            alert(result.error);
            return;
        }

        const trace = {
            z: result.z,
            x: result.x,
            y: result.y,
            type: 'heatmap',
            colorscale: 'YlGnBu',
            showscale: true,
            hovertemplate: '%{z:.1f}%<extra></extra>',
            text: result.z.map(row => row.map(val => `${val}%`)),
            texttemplate: "%{text}",
            textfont: {
                color: "black"
            }
        };

        const layout = {
            width: 600,
            height: 500,
        };

        Plotly.newPlot("heatmap-chart", [trace], layout);

        // ✅ Tampilkan semua container
        document.getElementById('visualization').style.display = 'block';
        document.getElementById('heatmap-chart').style.display = 'block';
    })
    .catch(err => {
        console.error("Upload heatmap error:", err);
        alert("Terjadi kesalahan saat mengunggah heatmap.");
    });
});

// Toggle format dataset info
const toggleBtn = document.getElementById("toggle-format-btn");
const formatInfo = document.getElementById("format-info");

toggleBtn.addEventListener("click", () => {
    if (formatInfo.style.display === "none") {
        formatInfo.style.display = "block";
        toggleBtn.innerText = "Sembunyikan Format Dataset";
    } else {
        formatInfo.style.display = "none";
        toggleBtn.innerText = "Tampilkan Format Dataset";
    }
});
