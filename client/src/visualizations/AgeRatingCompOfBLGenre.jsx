/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
import './top-bl-anime.css';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Age Rating Composition of Boys Love Titles</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /age-rating-comp-of-bl-genre)</i>', y: 0.89 }, margin: { t: 130, b: 0 }, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 } };

function AgeRatingCompOfBLGenre() {
    const [data, setData] = useState([]);
    const [ratingInfo, setRatingInfo] = useState([]);

    useEffect(() => {
        axios.get("/age-rating-comp-of-bl-genre", { crossdomain: true }).then(res => {
            setData([{
                values: Object.keys(res.data).map(key => res.data[key].value),
                labels: Object.keys(res.data),
                type: 'pie',
                direction: 'clockwise',
                textinfo: "label+percent",
                automargin: true,
                sort: false
            }]);
            setRatingInfo(() => {
                let tmp = {};
                let max = { rating: null, value: 0, text: null };
                Object.keys(res.data).forEach(key => {
                    if (parseInt(res.data[key].value) > max.value) max = { rating: key, value: parseInt(res.data[key].value), text: res.data[key].text };
                    tmp[key] = res.data[key].text;
                });
                document.getElementById('rating-data').innerHTML = `<h3>Top Ten BL Anime Titles with a<br />"${max.rating}" rating</h3>${max.text}`;
                return tmp;
            });
        });
    }, []);

    const hover = e => {
        let rating = e.points[0].label;
        let ratingInfoHTML = ratingInfo[rating];

        document.getElementById('rating-data').innerHTML = `<h3>Top Ten BL Anime Titles with a<br />"${rating}" rating</h3>${ratingInfoHTML}`;
    };

    return (
        <div>
            <Plot id="ageratingcompbl-data-viz" data={data} layout={layout} onHover={hover} />
            <div id="rating-data" style={{ border: '1px solid black', background: 'lightgrey', minHeight: 305, width: 600, margin: 'auto' }}></div>
        </div>
    );
}

export default AgeRatingCompOfBLGenre;