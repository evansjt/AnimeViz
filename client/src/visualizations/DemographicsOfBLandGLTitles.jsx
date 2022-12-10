/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Demographic Composition among Boys Love and Girls Love Titles</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /demographics-of-bl-gl-titles)</i>' }, xaxis: { title: { text: 'Note: <i style="text-align:left;">*Seinen = general youth audience, *Shoujo = young female audience,<br />*Shounen = young male audience, *Josei = older female audience<i>' }, font: { size: 8 } }, yaxis: { title: '# of Titles', tickformat: '.2%', range: [0, 1] }, barmode: 'stack', legend: { title: { text: "<b>Demographic<b>", font: { size: 14 }, side: "top" }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };

function DemographicsOfBLandGLTitles() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/demographics-of-bl-gl-titles", { crossdomain: true }).then(res => {
            setData(Object.keys(res.data).map(demographic => {
                const demTitles = res.data[demographic].titlesInDemographic;
                const totalTitles = res.data[demographic].totalTitlesPerGenre;
                return ({
                    type: 'bar',
                    name: demographic,
                    x: res.data[demographic].genres,
                    y: res.data[demographic].percentages,
                    text: demTitles.map((x, i) => `${x} out of ${totalTitles[i]} titles`),
                    hovertemplate: `<b>%{x} titles<br />catered towards<br />${'Josei'}:</b> %{y}<br /><b><i>%{text}</i></b><extra></extra>`
                })
            }));
        });
    }, []);

    return (
        <Plot id="demoblgltitles-data-viz" className="dataplot" data={data} layout={layout} />
    );
}

export default DemographicsOfBLandGLTitles;