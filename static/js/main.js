function loadHeatmap() {
    const rep = document.getElementById("reputation").value;

    fetch(`/get_heatmap_data?reputation=${rep}`)
        .then(response => response.json())
        .then(data => {
            // Misal format data: { z: [[...]], x: [...], y: [...] }
            const layout = {
                title: `Heatmap Kontribusi (${rep})`,
                xaxis: { title: "Target" },
                yaxis: { title: "Source" }
            };
            const trace = {
                z: data.z,
                x: data.x,
                y: data.y,
                type: 'heatmap',
                colorscale: 'Viridis'
            };
            Plotly.newPlot("heatmap", [trace], layout);
        });
}

window.onload = () => {
    // Load Sankey diagram saat halaman dibuka
    fetch("/get_sankey_data")
        .then(response => response.json())
        .then(data => {
            const trace = {
                type: "sankey",
                orientation: "h",
                node: {
                    pad: 15,
                    thickness: 20,
                    line: { color: "black", width: 0.5 },
                    label: data.nodes,
                    color: data.node_colors
                },
                link: {
                    source: data.links.source,
                    target: data.links.target,
                    value: data.links.value
                }
            };
            const layout = {
                title: "Sankey Diagram",
                font: { size: 12 }
            };
            Plotly.newPlot("sankey", [trace], layout);
        });
};
