/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

function AgeRatingDistOfBLGenre() {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});
    const [ratingInfo, setRatingInfo] = useState([]);

    useEffect(() => {
        axios.get("/age-rating-dist-of-bl-genre", { crossdomain: true }).then(res => {
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
                document.getElementById('rating-data').innerHTML = `<h3>Top Ten BL Anime Titles with a "${max.rating}" rating</h3>${max.text}`;
                return tmp;
            });
            setLayout({
                title: {
                    text: '<b>Age Rating Distribution of Boys Love Titles</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /age-rating-dist-of-bl-genre)</i>',
                    y: 0.89
                },
                width: window.innerWidth/2,
                margin: {
                    t: 130,
                    b: 0
                },
                legend: {
                    title: {
                        text: "<b>Age Rating<b>",
                        font: {
                            size: 14
                        },
                        side: "top"
                    },
                    bgcolor: '#E2E2E2',
                    bordercolor: '#FFFFFF',
                    borderwidth: 2
                }
            });
        });
    }, []);

    const hover = e => {
        let rating = e.points[0].label;
        let ratingInfoHTML = ratingInfo[rating];

        document.getElementById('rating-data').innerHTML = `<h3>Top Ten BL Anime Titles with a "${rating}" rating</h3>${ratingInfoHTML}`;
    };

    return (
        <div>
            <Plot id="ageratingdistbl-data-viz" data={data} layout={layout} onHover={hover} />
            <div id="rating-data" style={{ border: '1px solid black', background: 'lightgrey' }}></div>
        </div>
    );
}

export default AgeRatingDistOfBLGenre;