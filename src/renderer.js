const { remote, ipcRenderer } = require('electron');
const { BrowserWindow, shell } = remote;

const graphDiv = document.getElementById('plotly-plot');
ipcRenderer.on('request', function (event, req) {
    window.nplot = req;
    if (req.opts) {
        Plotly.newPlot(graphDiv, req.data,req.layout, req.opts);
    }
    else {
        Plotly.newPlot(graphDiv, req);
    }
    event.sender.send('request-handled', 'ok');
})

const limit = (value, min, max) => value <= min ? min : value >= max ? max : value;

document.getElementById('port-value').addEventListener('change', e => {
    e.target.value = limit(Number(e.target.value), 1024, 49151);
    ipcRenderer.send('port-change', e.target.value);
})

var trace1 = {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [10, 15, null, 17, 14, 12, 10, null, 15],
    mode: 'lines+markers',
    connectgaps: true
};

var trace2 = {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [16, null, 13, 10, 8, null, 11, 12],
    mode: 'lines',
    connectgaps: true
};

let data = [trace1, trace2];
window.data = data;
var layout = {
    title: 'Chart',
    showlegend: false
};



Plotly.newPlot(graphDiv, { data, layout });
