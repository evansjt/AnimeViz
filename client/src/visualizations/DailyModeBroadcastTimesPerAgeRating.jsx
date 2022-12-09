/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
import moment from 'moment-timezone';

const Plot = createPlotlyComponent(Plotly);
const tzNames = moment.tz.names();

const polarLayout = { angularaxis: { direction: 'clockwise', rotation: 64.2857142857 }, radialaxis: { type: 'date', tickformat: '%I:%M %p', fixedrange: true, showgrid: false, range: ["Jan 01, 1970 00:00:00", "Jan 01, 1970 23:59:59"] } };

const layoutJP = { title: { text: `<b>Asia/Tokyo (${moment.tz.zone('Asia/Tokyo').abbr(new Date())}) [Local Broadcast Time]</b>`, font: { size: 14 } }, width: window.innerWidth / 2, polar: polarLayout, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, margin: { b: 0, t: 0, l: 0, r: 0 }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };

function DailyModeBroadcastTimesPerAgeRating() {
    const [dataJST, setJSTData] = useState([]);
    const [otherTZ, setOtherTZ] = useState(moment.tz.zone('America/New_York'));
    const [dataOtherTZ, setDataOtherTZ] = useState([]);
    const [layoutOtherTZ, setLayoutOtherTZ] = useState({});

    useEffect(() => {
        let name = otherTZ.name;
        let abbr = otherTZ.abbr(new Date());

        let layout = JSON.parse(JSON.stringify(layoutJP));
        layout.title.text = `<b>${name} (${abbr})</b>`;
        setLayoutOtherTZ(layout);

        drawPloyForTimeZone(setJSTData, moment.tz.zone('Asia/Tokyo').abbr(new Date()));
        drawPloyForTimeZone(setDataOtherTZ, abbr);

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
    }, [otherTZ]);

    return (
        <>
            <div style={{ textAlign: 'left', width: window.innerWidth / 2 }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}>Most Common Broadcast Times among each Age Rating<br />(by Day of the Week)</h3>
                    <i style={{ fontSize: '12px' }}>(Raw data can be seen with API extension: /daily-mode-bc-times-per-rating/:TZ)<br />[:TZ is 'UTC' by default]</i>
                </div>
                <div>
                    <Plot id="dailymodebctimes-jst-data-viz" data={dataJST} layout={layoutJP} />
                    <div style={{ 'text-align': 'center' }}>
                        <label for="timezone">Enter Timezone:</label>
                        <input id="timezone" list={"timezone-list"}
                            onInput={e => {
                                const val = e.target.value;
                                const obj = $('#timezone-list').find("option[value='" + val + "']");
                                if (obj != null && obj.length > 0)
                                    setOtherTZ(moment.tz.zone(val));
                            }} />
                        <datalist id="timezone-list" >
                            {tzNames.map(tz => {
                                let abbr = moment.tz.zone(tz).abbr(new Date());
                                let offset = moment().tz(tz).format('ZZ');
                                return (<option value={tz}>{`${tz} (${abbr}/GMT${offset})`}</option>);
                            })}
                        </datalist>
                    </div>
                    <Plot id="dailymodebctimes-pst-data-viz" data={dataOtherTZ} layout={layoutOtherTZ} />
                </div>
            </div>
        </>
    );
}

export default DailyModeBroadcastTimesPerAgeRating;