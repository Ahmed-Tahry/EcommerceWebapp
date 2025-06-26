'use client'
import Chart from 'react-apexcharts'

export default function SaleChart1() {

    var options = {

        chart: {
            type: 'bar',
            height: 330,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '10px',
            },
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: '#95989D',
                },
            },
            tooltip: {
                enabled: false
            }
        },
        fill: {
            opacity: 1
        },
        stroke: {
            show: false
        },
        legend: {
            show: false
        },
        yaxis: {
            show: false,
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#2377FC', '#D3E4FE'],
    }
    const series = [{
        name: '',
        data: [44, 55, 41, 67, 22, 43, 21]
    }, {
        name: '',
        data: [13, 23, 20, 8, 13, 27, 33]
    }]
    return (
        <>
            <Chart options={options} series={series} type="bar" height={330} />
        </>
    )
}
