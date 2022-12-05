/* eslint-disable no-undef */
import React, { useEffect } from "react";
import axios from "axios";

function QuarterlyMembersPerLast5Years() {

    useEffect(() => {
        const layout = {
            title: '<b>Quarterly Membership per the last 5 Years</b><br><i style="font-size:12px">(Raw data can be seen with API extension: /qtly-mem-per-lst5yrs)</i>',
            width: 500,
            height: 500,
            polar: {
                angularaxis: {
                    direction: "clockwise",
                    rotation: 45
                },
                radialaxis: {
                    visible: true
                }
            },
            legend: {
                title: {
                    text: "<b>Year<b>",
                    font: {
                        size: 14
                    },
                    side: "top"
                },
                bgcolor: '#E2E2E2',
                bordercolor: '#FFFFFF',
                borderwidth: 2
            }
        };

        axios.get("/qtly-mem-per-lst5yrs", { crossdomain: true }).then(res => {
            let data = Object.keys(res.data).map(year => ({
                type: 'scatterpolar',
                r: res.data[year].avgMembers,
                theta: res.data[year].Season,
                fill: 'toself',
                name: year,
                hovertemplate: `<b>${year} - %{theta}</b><br><i>Avg. members</i>: %{r}<extra></extra>`
            }));
            Plotly.newPlot('qtlymemplst5yrs-data-viz', data, layout);
        });
    }, []);

    return (
        <div id="qtlymemplst5yrs-data-viz"></div>
    );
}

export default QuarterlyMembersPerLast5Years;