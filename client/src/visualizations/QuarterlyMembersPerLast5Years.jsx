/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Quarterly Membership per the last 5 Years</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /qtly-mem-per-lst5yrs)</i>', font: { color: 'white' } }, polar: { bgcolor: 'black', angularaxis: { title: { font: { color: 'white' } }, direction: "clockwise", rotation: 45, color: 'white' }, radialaxis: { title: { font: { color: 'white' } }, visible: true, color: 'white' } }, legend: { title: { text: "<b>Year<b>", font: { size: 14 }, side: "top" }, bgcolor: '#E2E2E2' }, paper_bgcolor: 'black', plot_bgcolor: 'black' };

function QuarterlyMembersPerLast5Years() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/qtly-mem-per-lst5yrs", { crossdomain: true }).then(res => {
            setData(Object.keys(res.data).map(year => ({
                type: 'scatterpolar',
                r: res.data[year].avgMembers,
                theta: res.data[year].Season,
                fill: 'toself',
                name: year,
                hovertemplate: `<b>${year} - %{theta}</b><br><i>Avg. members</i>: %{r}<extra></extra>`
            })));
        });
    }, []);

    return (
        <Plot id="qtlymemplst5yrs-data-viz" className="dataplot" data={data} layout={layout} />
    );
}

export default QuarterlyMembersPerLast5Years;