'use client'
import Chart from 'react-apexcharts'

export default function StatsChart3({color}) {
    var options = {

        chart: {
            type: 'bar',
            height: 170,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '3px',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        colors: [color ? color : "#000"],
        stroke: {
            show: false,
        },
        xaxis: {
            labels: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            show: false,
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val
                }
            }
        }
    }
    const series = [{
        name: 'Price',
        data: [
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120
        ]
    }]
    return (
        <>
            <Chart options={options} series={series} type="bar" height={170} />
        </>
    )
}
