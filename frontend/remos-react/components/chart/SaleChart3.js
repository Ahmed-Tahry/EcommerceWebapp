'use client'
import Chart from 'react-apexcharts'

export default function SaleChart3() {

    var options = {

        chart: {
            height: 160,
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '11px',
            },
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        colors: '#E2E8F0',
        stroke: {
            show: false,
        },
        yaxis: {
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
        tooltip: {
            x: {
                format: 'dd/mm/yy'
            },
        },
    }
    const series = [{
        name: 'Item 01',
        data: [
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
            81, 121, 40, 52, 164, 113, 26, 68, 135, 182, 76, 112, 199, 168, 49, 120,
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
            <Chart options={options} series={series} type="bar" height={160} />
        </>
    )
}
