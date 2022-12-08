/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Quarterly Membership per the last 5 Years</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /qtly-mem-per-lst5yrs)</i>' }, width: window.innerWidth / 2, margin: { b: 25 }, polar: { angularaxis: { direction: "clockwise", rotation: 45 }, radialaxis: { visible: true } }, legend: { title: { text: "<b>Year<b>", font: { size: 14 }, side: "top" }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <Plot id="qtlymemplst5yrs-data-viz" data={data} layout={layout} />
        </div >
    );
}

export default QuarterlyMembersPerLast5Years;