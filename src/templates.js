const data = [{
    fill: 'none',
    line: {
        dash: 'solid',
        shape: 'linear',
        width: 2
    },
    meta: {
        columnNames: {
            x: 'A',
            y: 'B'
        }
    },
    mode: 'lines',
    type: 'scatter',
    x: [0, 1],
    y: [0.00785839627679863, 0.015701533531700562],
    hoveron: 'points',
    opacity: 0.63,
    connectgaps: false,
    hovertemplate: ' '
}];

const layout = {
    font: {
        family: 'Open Sans'
    },
    title: {
        text: /* html */ `
            <b>Energy</b>
            <i>time</i>
            <sup>curve</sup>
            <sub>analysis</sub>
            in m/s<sup>2</sup>
            `
    },
    xaxis: {
        type: 'linear',
        range: [0, 1630],
        ticks: 'outside',
        title: {
            text: /* html */ `
              <b>Time</b> (s)
              `
        },
        domain: [0, 0.95],
        tickmode: 'auto',
        autorange: true,
        showspikes: false,
        rangeslider: {
            range: [0, 1630],
            yaxis: {
                rangemode: 'match'
            },
            visible: true,
            autorange: true,
            thickness: 0.11,
            bordercolor: 'rgb(228, 228, 228)',
            borderwidth: 1
        }
    },
    yaxis: {
        side: 'left',
        type: 'linear',
        dtick: 0.1,
        range: [-1.1111111111111112, 1.1111111111111112],
        ticks: 'outside',
        title: {
            text: /* html */`
                <b>Level</b>`
        },
        domain: [0, 1],
        nticks: 12,
        tickmode: 'auto',
        autorange: true,
        automargin: false
    },
    legend: {
        x: 1.02,
        y: 0.96,
        xanchor: 'center',
        yanchor: 'middle'
    },
    modebar: {
        orientation: 'h'
    },
    autosize: true,
    dragmode: 'zoom',
    hovermode: 'closest',
    hoverlabel: {
        font: {
            family: 'Open Sans'
        }
    },
    showlegend: true,
    paper_bgcolor: 'rgb(255, 255, 255)'
};

module.exports = {
    data,
    layout
}