/* eslint-disable no-undef */
import React, { useEffect } from "react";
import axios from "axios";

function AvgAnimeMembershipPerYear() {

    useEffect(() => {
        var data = [];
        function plotData(avgMemberData) {
            for (let mediaType in avgMemberData) {
                data.push({
                    x: avgMemberData[mediaType]['Years'],
                    y: avgMemberData[mediaType]['Average Members'],
                    showlegend: true,
                    name: mediaType === 'OVA' || mediaType === 'ONA' ? `${mediaType}*` : mediaType,
                    type: 'scatter',
                    fill: 'none',
                    mode: 'lines+markers',
                    line: {
                        width: 3
                    },
                    hovertemplate: `<b>${mediaType} - %{x}</b><br><i>Avg. members</i>: %{y}<extra></extra>`
                });
            }
        }

        const layout = {
            title: 'Average Membership of Anime Media Released per Year',
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

        axios.get("http://localhost:5000/avg_membership_per_yr", { crossdomain: true }).then(res => {
            plotData(res.data);
            Plotly.newPlot('temporal-data-viz', data, layout);
        });
    }, []);

    return (
        <div id="temporal-data-viz"></div>
    );
}

export default AvgAnimeMembershipPerYear;