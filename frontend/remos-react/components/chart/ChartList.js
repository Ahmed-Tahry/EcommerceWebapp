import dynamic from 'next/dynamic'

const StatsChart1 = dynamic(() => import('./StatsChart1'), { ssr: false })
const StatsChart2 = dynamic(() => import('./StatsChart2'), { ssr: false })
const StatsChart3 = dynamic(() => import('./StatsChart3'), { ssr: false })
const OrderChart1 = dynamic(() => import('./OrderChart1'), { ssr: false })
const EarningsChart1 = dynamic(() => import('./EarningsChart1'), { ssr: false })
const EarningsChart2 = dynamic(() => import('./EarningsChart2'), { ssr: false })
const EarningsChart3 = dynamic(() => import('./EarningsChart3'), { ssr: false })
const RevenueChart1 = dynamic(() => import('./RevenueChart1'), { ssr: false })
const RevenueChart2 = dynamic(() => import('./RevenueChart2'), { ssr: false })
const VisitorChart1 = dynamic(() => import('./VisitorChart1'), { ssr: false })
const SaleChart1 = dynamic(() => import('./SaleChart1'), { ssr: false })
const SellerChart1 = dynamic(() => import('./SellerChart1'), { ssr: false })
const SaleChart2 = dynamic(() => import('./SaleChart2'), { ssr: false })
const SaleChart3 = dynamic(() => import('./SaleChart3'), { ssr: false })
const SaleDonutChart1 = dynamic(() => import('./SaleDonutChart1'), { ssr: false })

export default function ChartList({ style, color }) {
    return (
        <>
            {style === 1 && <StatsChart1 color={color} />}
            {style === 2 && <StatsChart2 color={color} />}
            {style === 3 && <OrderChart1 />}
            {style === 4 && <EarningsChart1 />}
            {style === 5 && <RevenueChart1 />}
            {style === 6 && <EarningsChart2 />}
            {style === 7 && <EarningsChart3 />}
            {style === 8 && <VisitorChart1 />}
            {style === 9 && <SaleChart1 />}
            {style === 10 && <RevenueChart2 />}
            {style === 11 && <StatsChart3 color={color} />}
            {style === 12 && <SellerChart1 color={color} />}
            {style === 13 && <SaleChart2 />}
            {style === 14 && <SaleChart3 />}
            {style === 15 && <SaleDonutChart1 />}
        </>
    )
}