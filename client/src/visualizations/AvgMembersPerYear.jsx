/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: '<b>Average Membership of Anime Media Released per Year</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /avg-mem-per-yr)</i>', xaxis: { title: 'Year' }, yaxis: { title: '# of Avg. members' }, legend: { title: { text: "<b>Media Types<b>", font: { size: 14 }, side: "top" }, orientation: 'h', bgcolor: 'white', bordercolor: 'black', borderwidth: 1 }, annotations: [{ xref: 'paper', yref: 'paper', xanchor: 'left', yanchor: 'bottom', x: 0, y: 1, text: '<i>OVA* = Original video animation (direct-to-video anime)</i><br><i>ONA* = Original net animation (direct-to-internet anime)</i>', font: { size: 10 }, align: 'left', showarrow: false }], hovermode: 'closest', paper_bgcolor: '#E0E0E0', plot_bgcolor: '#E0E0E0' };

function AvgAnimeMembershipPerYear() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/avg-mem-per-yr", { crossdomain: true }).then(res => {
            setData(Object.keys(res.data).map(mediaType => ({
                x: res.data[mediaType].years,
                y: res.data[mediaType].avgMembers,
                text: res.data[mediaType].titlesWithMaxMembers.map(({ title, maxMembers, outOf }) => `Out of ${outOf} titles, <b>${title}</b> (<i>${maxMembers}</i> members) has the most members.`),
                link: res.data[mediaType].titlesWithMaxMembers.map(({ url }) => url),
                showlegend: true,
                name: mediaType === 'OVA' || mediaType === 'ONA' ? `${mediaType}*` : mediaType,
                type: 'scatter',
                fill: 'none',
                mode: 'lines+markers',
                line: {
                    width: 3
                },
                hovertemplate: `<i><b>${mediaType} - %{x}</b></i><br><i>Avg. members</i>: %{y}<br />%{text}<extra></extra>`
            })));
        });
    }, [])

    return (
        <Plot id="avgmempyr-data-viz" className="dataplot" data={data} layout={layout}
            onClick={data => {
                data.points.forEach(({ x, data }) => {
                    const xIndex = data.x.indexOf(`${x}`);
                    const url = data.link[xIndex];
                    window.open(url, '_blank').focus();
                });
            }}
        />
    );
}

export default AvgAnimeMembershipPerYear;