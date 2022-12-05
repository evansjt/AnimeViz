/* eslint-disable no-undef */
import React, { useEffect } from "react";
import axios from "axios";

function AvgAnimeMembershipPerYear() {

    useEffect(() => {
        const layout = {
            title: '<b>Average Membership of Anime Media Released per Year</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /avg-mem-per-yr)</i>',
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: '# of Avg. members'
            },
            legend: {
                title: {
                    text: "<b>Media Types<b>",
                    font: {
                        size: 14
                    },
                    side: "top"
                },
                orientation: "h",
                bgcolor: '#E2E2E2',
                bordercolor: '#FFFFFF',
                borderwidth: 2
            },
            annotations: [
                {
                    xref: 'paper',
                    yref: 'paper',
                    xanchor: 'left',
                    yanchor: 'bottom',
                    x: 0,
                    y: 1,
                    text: '<i>OVA* = Original video animation (direct-to-video anime)</i><br><i>ONA* = Original net animation (direct-to-internet anime)</i>',
                    font: {
                        size: 10
                    },
                    align: 'left',
                    showarrow: false
                }
            ]
        };

        axios.get("/avg-mem-per-yr", { crossdomain: true }).then(res => {
            let data = Object.keys(res.data).map(mediaType => ({
                x: res.data[mediaType]['Years'],
                y: res.data[mediaType]['Average Members'],
                showlegend: true,
                name: mediaType === 'OVA' || mediaType === 'ONA' ? `${mediaType}*` : mediaType,
                type: 'scatter',
                fill: 'none',
                mode: 'lines+markers',
                line: {
                    width: 3
                },
                hovertemplate: `<b>${mediaType} - %{x}</b><br><i>Avg. members</i>: %{y}<extra></extra>`
            }));
            Plotly.newPlot('avgmempyr-data-viz', data, layout);
        });
    }, []);

    return (
        <div id="avgmempyr-data-viz"></div>
    );
}

export default AvgAnimeMembershipPerYear;