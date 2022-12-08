/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

const polarLayout = { angularaxis: { direction: 'clockwise', rotation: 64.2857142857 }, radialaxis: { type: 'date', tickformat: '%I:%M %p', fixedrange: true, showgrid: false, range: ["Jan 01, 1970 00:00:00", "Jan 01, 1970 23:59:59"] } };

const layoutJST = { title: { text: '<b>Tokyo<br>(JST/UTC+9)</b>' }, width: window.innerWidth / 2, polar: polarLayout, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, margin: { b: 0, t: 0, l: 0, r: 0 }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };
const layoutPST = { title: { text: '<b>Los Angeles<br>(PST/UTC-8)</b>' }, width: window.innerWidth / 2, polar: polarLayout, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, margin: { b: 0, t: 0, l: 0, r: 0 }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };
const layoutEST = { title: { text: '<b>New York<br>(EST/UTC-5)</b>' }, width: window.innerWidth / 2, polar: polarLayout, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, margin: { b: 0, t: 0, l: 0, r: 0 }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };

function DailyModeBroadcastTimesPerAgeRating() {
    const [dataJST, setJSTData] = useState([]);
    const [dataPST, setPSTData] = useState([]);
    const [dataEST, setESTData] = useState([]);

    useEffect(() => {
        drawPloyForTimeZone(setJSTData, 'JST');
        drawPloyForTimeZone(setPSTData, 'PST');
        drawPloyForTimeZone(setESTData, 'EST');

        function drawPloyForTimeZone(setData, timezone) {
            axios.get(`/daily-mode-bc-times-per-rating/${timezone}`, { crossdomain: true }).then(res => {
                setData(Object.keys(res.data).map(rating => {
                    const modetimes = res.data[rating].modetimes.map(time => '1970-01-01 ' + time);
                    const daysofweek = res.data[rating].daysofweek;
                    return {
                        type: 'scatterpolar',
                        name: rating,
                        r: modetimes.concat(modetimes[0]),
                        theta: daysofweek.concat(daysofweek[0]),
                        hovertemplate: `<i>${rating}</i><br><b>Most Common Broadcast Time (${timezone})<br>on %{theta}</b>:<br>%{r}<extra></extra>`
                    }
                }));
            });
        }
    }, []);

    return (
        <>
            <div style={{ textAlign: 'left', width: window.innerWidth / 2 }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}>Most Common Broadcast Times among each Age Rating<br/>(by Day of the Week)</h3>
                    <i style={{ fontSize: '12px' }}>(Raw data can be seen with API extension: /daily-mode-bc-times-per-rating/:TZ)<br />[:TZ is 'UTC' by default]</i>
                </div>
                <div>
                    <Plot id="dailymodebctimes-jst-data-viz" data={dataJST} layout={layoutJST} />
                    <Plot id="dailymodebctimes-pst-data-viz" data={dataPST} layout={layoutPST} />
                    <Plot id="dailymodebctimes-est-data-viz" data={dataEST} layout={layoutEST} />
                </div>
            </div>
        </>
    );
}

export default DailyModeBroadcastTimesPerAgeRating;