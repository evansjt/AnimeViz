/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import ReactFC from 'react-fusioncharts';
import createPlotlyComponent from 'react-plotly.js/factory';

ReactFC.fcRoot(FusionCharts);
const Plot = createPlotlyComponent(Plotly);

const layout = { title: { text: '<b>Top 50 Longest Running Anime TV Series</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /longest-running-tv-anime-series)</i>' }, barmode: 'group', yaxis: { autorange: "reversed" }, legend: { x: 1, xanchor: 'right', y: 0, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 }, margin: { t: 150, b: 25, l: 350 } };

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
            dataSource.processes.process = res.data.ranks;
            dataSource.tasks.task = res.data.airespans.map(t => ({ label: `Aired for ${t.daysAired} days`, start: t.airedFrom, end: t.airedTo }));
            dataSource.datatable.datacolumn[0].text = res.data.animeTitles.map(a => ({ label: a }));;
            dataSource.datatable.datacolumn[1].text = res.data.episodesAired.map(e => ({ label: `${e}` }));
            dataSource.categories = res.data.categories;

            setGanttDataSource(dataSource);

            const y = res.data.animeTitles.map((a, i) => `${res.data.ranks[i].label}: ${a}`);

            let barData = [{
                x: res.data.airespans.map(({ daysAired }) => daysAired),
                y: y,
                type: 'bar',
                orientation: 'h',
                name: '# days aired',
                hovertemplate: "<b>%{x} days</b> "
            }, {
                x: res.data.episodesAired,
                y: y,
                type: 'bar',
                orientation: 'h',
                name: '# episodes aired',
                hovertemplate: "<b>%{x} episodes</b>"
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