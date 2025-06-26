'use client'
import Chart from 'react-apexcharts'

export default function OrderChart1() {
    var options = {
        chart: {
            height: 291,
            type: "area",
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#2275fc"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.9,
                stops: [0, 90, 100]
            }
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#95989D',
                },
            },
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ]
        }
    }
    const series = [
        {
            name: "$",
            data: [45, 52, 38, 45, 49, 43, 40, 45, 52, 38, 45, 19]
        }
    ]
    return (
        <>
            <Chart options={options} series={series} type="area" height={291} />
        </>
    )
}
