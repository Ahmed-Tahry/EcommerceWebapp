'use client'
import Chart from 'react-apexcharts'

export default function SaleDonutChart1() {
    var options = {
        chart: {
            type: 'donut',
            height: 380,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '10px',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        colors: ['#2377FC33', '#2377FC'],
        stroke: {
            show: false,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            labels: {
                style: {
                    colors: '#95989D',
                },
            },
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
                    return "$ " + val + " thousands"
                }
            }
        }
    }
    const series= [44, 55, 13, 33]
    return (
        <>
            <Chart options={options} series={series} type="donut" height={320} />
        </>
    )
}
