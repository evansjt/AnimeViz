/* eslint-disable no-undef */
import axios from "axios";
import { useState, useEffect } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
import './top-bl-anime.css';

const Plot = createPlotlyComponent(Plotly);
const layout = { title: { text: '<b>Age Rating Composition of Boys Love Titles</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /age-rating-comp-of-bl-genre)</i>' }, legend: { title: { text: "<b>Age Rating<b>", font: { size: 14 }, side: "top" }, bgcolor: '#E2E2E2', bordercolor: '#FFFFFF', borderwidth: 2 }, margin: { b: 25 } };

function AgeRatingCompOfBLGenre() {
    const [data, setData] = useState([]);
    const [ratingInfos, setRatingInfos] = useState([{ rating: "default", value: 0, currImg: "", topTitlesInGenre: [] }]);
    const [currRatingInfo, setCurrRatingInfo] = useState({ rating: "default", value: 0, currImg: "", topTitlesInGenre: [] });

    useEffect(() => {
        axios.get("/age-rating-comp-of-bl-genre", { crossdomain: true }).then(res => {
            setData([{
                values: Object.keys(res.data).map(key => res.data[key].value),
                labels: Object.keys(res.data),
                type: 'pie',
                direction: 'clockwise',
                sort: false
            }]);
            setRatingInfos(() => {
                let tmp = {};
                let max = { value: 0 };
                Object.keys(res.data).forEach(key => {
                    tmp[key] = { rating: key, value: res.data[key].value, currImg: res.data[key].topTitlesInGenre[0].jpg, topTitlesInGenre: res.data[key].topTitlesInGenre };
                    if (res.data[key].value > max.value)
                        max = tmp[key];
                });
                setCurrRatingInfo(max);
                return tmp;
            });
        });
    }, []);

    return (
        <>
            <div>
                <Plot id="ageratingcompbl-data-viz" className="dataplot" data={data} layout={layout} onHover={e => setCurrRatingInfo(ratingInfos[e.points[0].label])} /><div id="rating-data">
                    <h3>Top Ten BL Anime Titles with a<br />"{currRatingInfo.rating}" rating</h3>
                    <div id="topBLAnime">
                        <img src={currRatingInfo.currImg} alt="bl-title-img" /><ul id="bl-list">
                            {currRatingInfo.topTitlesInGenre.map(t => <li onMouseOver={e => setCurrRatingInfo(prev => ({ ...prev, currImg: t.jpg }))}>#{t.rank}: <a href={t.url}>{t.title}</a></li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AgeRatingCompOfBLGenre;