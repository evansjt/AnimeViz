/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import ReactFC from 'react-fusioncharts';
import createPlotlyComponent from 'react-plotly.js/factory';

ReactFC.fcRoot(FusionCharts);
const Plot = createPlotlyComponent(Plotly);

const layout = { title: { text: '<b>Top 50 Longest Running Anime TV Series</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /longest-running-tv-anime-series)</i>', font: { size: 18 } }, barmode: 'group', yaxis: { autorange: "reversed" }, legend: { x: 0.95, xanchor: 'right', y: 0.95, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 }, margin: { t: 100, b: 25, l: 300, r: 25 } };

const staticGanttDataSource = {
    chart: { dateformat: "mm/dd/yyyy", theme: "fusion", canvasborderalpha: "40", useVerticalScrolling: "1", GanttWidthPercent: "80", ganttlinealpha: "50", ganttPaneDuration: "10", ganttPaneDurationUnit: "y", scrollToDate: new Date().toLocaleString() },
    processes: { fontsize: "12", isbold: "1", align: "left", headerText: "Rank", headerFontSize: "14", headerVAlign: "bottom", headerAlign: "left", process: [] },
    datatable: { datacolumn: [{ headertext: "Anime Title", headerfontsize: "14", headervalign: "bottom", headeralign: "left", align: "left", fontsize: "12", text: [] }, { headertext: "# episodes", headerfontsize: "14", headervalign: "bottom", headeralign: "left", align: "left", fontsize: "12", text: [] }] },
    categories: [],
    tasks: { color: "#5D62B5", task: [] }
};

function LongestRunningTVAnimeSeries() {
    const [ganttDataSource, setGanttDataSource] = useState(staticGanttDataSource);
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        let dataSource = JSON.parse(JSON.stringify(staticGanttDataSource));

        axios.get(`/longest-running-tv-anime-series`, { crossdomain: true }).then(res => {
            dataSource.processes.process = res.data.animeTitles.map(({ rank }) => ({ label: rank }));
            dataSource.tasks.task = res.data.animeTitles.map(({ airespan }) => ({ label: `Aired for ${airespan.daysAired} days`, start: airespan.airedFrom, end: airespan.airedTo }));
            dataSource.datatable.datacolumn[0].text = res.data.animeTitles.map(({ title }) => ({ label: title }));;
            dataSource.datatable.datacolumn[1].text = res.data.animeTitles.map(({ episodesAired }) => ({ label: `${episodesAired}` }));
            dataSource.categories = res.data.categories;

            setGanttDataSource(dataSource);

            const aireDaysX = res.data.animeTitles.map(({ airespan }) => airespan.daysAired);
            const episodesX = res.data.animeTitles.map(({ episodesAired }) => episodesAired);
            const y = res.data.animeTitles.map((a, i) => `${a.rank}: ${a.title}`);

            let barData = [{
                x: aireDaysX,
                y: y,
                type: 'bar',
                orientation: 'h',
                name: '# days aired',
                hovertemplate: "<b>%{x} days</b> ",
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'descending'
                }]
            }, {
                x: episodesX,
                y: y,
                type: 'bar',
                orientation: 'h',
                name: '# episodes aired',
                hovertemplate: "<b>%{x} episodes</b>",
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'descending'
                }]
            }]

            setBarData(barData);
        });
    }, []);

    return (
        <>
            <div>
                <div style={{ height: 600 }}>
                    <Plot id="top50longestairedanime-data-viz" className="dataplot" data={barData} layout={layout} style={{ height: "100%", width: "100%" }} />
                </div>
                <div style={{ height: 600 }}>
                    <ReactFC className="dataplot" type="gantt" dataFormat="JSON" dataSource={ganttDataSource} width="100%" height={600} />
                </div>
            </div>
        </>
    );

}

export default LongestRunningTVAnimeSeries;