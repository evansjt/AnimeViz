/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: '<b>Average Membership of Anime Media Released per Year</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /avg-mem-per-yr)</i>', xaxis: { title: 'Year' }, yaxis: { title: '# of Avg. members' }, legend: { title: { text: "<b>Media Types<b>", font: { size: 14 }, side: "top" }, orientation: 'h', bgcolor: 'white', bordercolor: 'black', borderwidth: 1 }, annotations: [{ xref: 'paper', yref: 'paper', xanchor: 'left', yanchor: 'bottom', x: 0, y: 1, text: '<i>OVA* = Original video animation (direct-to-video anime)</i><br><i>ONA* = Original net animation (direct-to-internet anime)</i>', font: { size: 10 }, align: 'left', showarrow: false }], paper_bgcolor: '#E0E0E0', plot_bgcolor: '#E0E0E0' };

function AvgAnimeMembershipPerYear() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/avg-mem-per-yr", { crossdomain: true }).then(res => {
            setData(Object.keys(res.data).map(mediaType => ({
                x: res.data[mediaType]['Years'],
                y: res.data[mediaType]['Average Members'],
                showlegend: true,
                name: mediaType === 'OVA' || mediaType === 'ONA' ? `${mediaType}*` : mediaType,
                type: 'scatter',
                fill: 'none',
                mode: 'lines+markers',
                line: {
                    width: 3
                },
                hovertemplate: `<b>${mediaType} - %{x}</b><br><i>Avg. members</i>: %{y}<extra></extra>`
            })));
        });
    }, [])

    return (
        <Plot id="avgmempyr-data-viz" className="dataplot" data={data} layout={layout} />
    );
}

export default AvgAnimeMembershipPerYear;