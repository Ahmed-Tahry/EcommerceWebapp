'use client'
import Chart from 'react-apexcharts'

export default function VisitorChart1() {

    var options = {

        chart: {
            type: 'bar',
            height: 335,
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
        colors: '#2377FC',
        stroke: {
            show: false,
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#95989D',
                },
            },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
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
    const series = [{
        name: 'Revenue',
        data: [135, 182, 76, 112, 199, 168, 49, 120, 164, 113]
    }]
    return (
        <>
            <Chart options={options} series={series} type="bar" height={335} />
        </>
    )
}
