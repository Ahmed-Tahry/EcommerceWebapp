import Layout from "@/components/layout/Layout"
import BestShopSellers1 from "@/components/sections/BestShopSellers1"
import ChartDefault1 from "@/components/sections/ChartDefault1"
import Earnings1 from "@/components/sections/Earnings1"
import NewComment1 from "@/components/sections/NewComment1"
import Orders1 from "@/components/sections/Orders1"
import ProductOverview1 from "@/components/sections/ProductOverview1"
import RecentOrder1 from "@/components/sections/RecentOrder1"
import TopCountries1 from "@/components/sections/TopCountries1"
import TopProduct1 from "@/components/sections/TopProduct1"
export default function Home() {

    return (
        <>

            <Layout>
                <div className="tf-section-4 mb-30">
                    <ChartDefault1 />
                </div>
                <div className="tf-section-5 mb-30">
                    <RecentOrder1 />
                    <TopProduct1 />
                    <TopCountries1 />
                </div>
                <div className="tf-section-6 mb-30">
                    <BestShopSellers1 />
                    <ProductOverview1 />
                </div>
                <div className="tf-section-3">
                    <Orders1 />
                    <Earnings1 />
                    <NewComment1 />
                </div>
            </Layout>
        </>
    )
}