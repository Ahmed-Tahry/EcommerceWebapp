
import Layout from "@/components/layout/Layout"
import ChartDefault1 from "@/components/sections/ChartDefault1"
import CustomerGrowth1 from "@/components/sections/CustomerGrowth1"
import Customers1 from "@/components/sections/Customers1"
import Orders2 from "@/components/sections/Orders2"
import ProductOverview2 from "@/components/sections/ProductOverview2"
import ProductOverview3 from "@/components/sections/ProductOverview3"
import Revenue1 from "@/components/sections/Revenue1"
import TopCountries2 from "@/components/sections/TopCountries2"
export default function Home2() {

    return (
        <>

            <Layout breadcrumbTitleParent="Parenttitle" breadcrumbTitle="title">
                <div className="tf-section-4 mb-30">
                    <ChartDefault1 />
                </div>
                <div className="tf-section-2 mb-30">
                    <ProductOverview2 />
                    <Orders2 />
                </div>
                <div className="tf-section-7 mb-30">
                    <Customers1 />
                    <TopCountries2 />
                </div>
                <div className="tf-section-6 mb-30">
                    <CustomerGrowth1 />
                    <Revenue1 />
                </div>
                <div className="tf-section">
                    <ProductOverview3 />
                </div>
            </Layout>
        </>
    )
}