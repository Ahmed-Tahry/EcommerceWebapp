'use client'
import Chart from 'react-apexcharts'

export default function StatsChart1({ color }) {
    const options = {
        colors: [color ? color : "#000"],
        chart: {
            type: "area",
            maxWidth: 96,
            height: 28,
            sparkline: { enabled: !0 },
        },
        plotOptions: { bar: { columnWidth: "50%" } },
        xaxis: { crosshairs: { width: 1 } },

        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 3,
            dashArray: 0,
        },

        tooltip: {
            fixed: { enabled: !1 },
            x: { show: !1 },
            y: {
                title: {
                    formatter: function (e) {
                        return ""
                    },
                },
            },
            marker: { show: !1 },
        },
        states: {
            hover: {
                filter: {
                    type: "none",
                    value: 0,
                },
            },
        },
    }
    const series = [
        {
            data: [20, 50, 7, 100, 30, 80, 100],
        },
    ]
    return (
        <>
            <Chart options={options} series={series} type="area" height={28} />
        </>
    )
}
