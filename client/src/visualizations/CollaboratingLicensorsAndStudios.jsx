/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Frequencies of Collaborations between Anime Studios and Licensors</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /collab-lics-studs)</i>', y: 0.95 }, xaxis: { title: 'Licensor', side: 'top' }, yaxis: { title: 'Studio', autorange: 'reversed', automargin: true }, height: 1200, margin: { t: 350 } };

function CollaboratingLicensorsAndStudios() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/collab-lics-studs", { crossdomain: true }).then(res => {
            setData([{
                z: res.data.adjMat,
                x: res.data.licensors,
                y: res.data.studios,
                type: 'heatmap',
                hoverongaps: false
            }]);
        });

    }, []);

    return (
        <Plot id="collablicsprod-data-viz" className="dataplot" data={data} layout={layout} />
    );
}

export default CollaboratingLicensorsAndStudios;