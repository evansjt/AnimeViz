/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Frequencies of Collaborations between Anime Licensors and Studio</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /collab-lics-studs)</i>', font: { size: 18 }, y: 0.95 }, xaxis: { title: '<b>Licensor</b>', font: { size: 14 }, side: 'top', tickangle: -45 }, yaxis: { title: '<b>Studio</b>', font: { size: 14 }, autorange: 'reversed', automargin: true }, height: 1200, margin: { t: 250, l: 250, r: 200 }, paper_bgcolor: '#E0E0E0', plot_bgcolor: '#6f6f6f' };

function CollaboratingLicensorsAndStudios() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/collab-lics-studs", { crossdomain: true }).then(res => {
            setData([{
                z: res.data.adjMat,
                x: res.data.licensors,
                y: res.data.studios,
                type: 'heatmap',
                colorscale: 'Hot',
                hoverongaps: false,
                reversescale: true
            }]);
        });

    }, []);

    return (
        <Plot id="collablicsprod-data-viz" className="dataplot" data={data} layout={layout} />
    );
}

export default CollaboratingLicensorsAndStudios;