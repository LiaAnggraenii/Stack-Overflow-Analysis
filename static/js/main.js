// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// ========== VISUALISASI ========== //

// Render Sankey (Plotly.js)
function renderSankey(containerId, data) {
  Plotly.newPlot(containerId, data.data, data.layout);
}

// Render Heatmap (Plotly.js)
function renderHeatmap(containerId, data) {
  Plotly.newPlot(containerId, data.data, data.layout);
}

// Render TDA (Cytoscape.js)
function renderTDA(containerId, data) {
  cytoscape({
    container: document.getElementById(containerId),
    elements: data.elements,
    style: [
      { selector: 'node', style: { 'label': 'data(id)', 'background-color': '#61bffc' } },
      { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc' } }
    ],
    layout: { name: 'cose' }
  });
}

// ========== LOAD SEMUA DATA ========== //

async function loadVisuals() {
  // Sankey: 2 Visual
  for (let i = 1; i <= 2; i++) {
    const res = await fetch(`/data/sankey/${i}`);
    const data = await res.json();
    renderSankey(`sankey-container-${i}`, data);
  }

  // Heatmap: 4 Visual
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(`/data/heatmap/${i}`);
    const data = await res.json();
    renderHeatmap(`heatmap-container-${i}`, data);
  }

  // TDA: 2 Visual
  for (let i = 1; i <= 2; i++) {
    const res = await fetch(`/data/tda/${i}`);
    const data = await res.json();
    renderTDA(`tda-container-${i}`, data);
  }
}

// Panggil ketika halaman dimuat
loadVisuals();
