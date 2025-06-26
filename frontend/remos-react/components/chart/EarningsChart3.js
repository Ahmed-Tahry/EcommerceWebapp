'use client'
import Chart from 'react-apexcharts'

export default function EarningsChart3() {

    var options = {

        chart: {
            type: 'donut',
            // height: 423,
        },
        plotOptions: {
            pie: {
                startAngle: -100,
                endAngle: 100,
                offsetY: 0
            }
        },
        grid: {
            padding: {
                bottom: -80
            }
        },
        responsive: [{
            breakpoint: 991,
            options: {
                chart: {
                    height: 300
                },
            }
        }],
        legend: {
            show: false,
        }
    }
    const series = [90, 35, 41]
    return (
        <>
            <Chart options={options} series={series} type="donut" height={340} />
        </>
    )
}
