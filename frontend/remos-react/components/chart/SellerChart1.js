'use client'
import Chart from 'react-apexcharts'

export default function SellerChart1() {
    var options = {

        chart: {
            type: 'bar',
            height: 470,
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                columnWidth: '40px',
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        yaxis: {
            show: false,
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        colors: ['#2377FC', '#D3E4FE'],
        xaxis: {
            labels: {
                style: {
                    colors: '#95989D',
                },
            },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        },
        fill: {
            opacity: 1
        },
        responsive: [{
            breakpoint: 991,
            options: {
                chart: {
                    height: 500
                },
                plotOptions: {
                    bar: {
                        columnWidth: '20px',
                    },
                },
            }
        }]
    }
    const series = [{
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22]
    }, {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27, 44, 55, 41, 67, 22]
    }]
    return (
        <>
            <Chart options={options} series={series} type="bar" height={470} />
        </>
    )
}
