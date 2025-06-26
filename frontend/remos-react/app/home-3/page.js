
import Layout from "@/components/layout/Layout"
import Category1 from "@/components/sections/Category1"
import ChartDefault1 from "@/components/sections/ChartDefault1"
import Earnings2 from "@/components/sections/Earnings2"
import Earnings3 from "@/components/sections/Earnings3"
import Orders3 from "@/components/sections/Orders3"
import TopProduct2 from "@/components/sections/TopProduct2"
import WebsiteVisitors1 from "@/components/sections/WebsiteVisitors1"
export default function Home3() {

    return (
        <>

            <Layout breadcrumbTitleParent="Parenttitle" breadcrumbTitle="title">
                <div className="tf-section-2 mb-30">
                    <div className="flex gap20 flex-wrap-mobile">
                        <div className="w-half">
                            <ChartDefault1 mb />
                        </div>
                        <Category1 />
                    </div>
                    <Earnings2 />
                </div>
                <div className="tf-section mb-30">
                    <Orders3 />
                </div>
                <div className="tf-section-3">
                    <TopProduct2 />
                    <Earnings3 />
                    <WebsiteVisitors1 />
                </div>
            </Layout>
        </>
    )
}