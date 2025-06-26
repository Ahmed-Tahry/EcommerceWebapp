
'use client'
import { useState } from "react"
import ClearButton1 from "../ThemeSettings/Clear1"
import ClearButton2 from "../ThemeSettings/Clear2"
import ColorsHeader from "../ThemeSettings/ColorsHeader"
import ColorsMenu from "../ThemeSettings/ColorsMenu"
import HeaderPosition from "../ThemeSettings/HeaderPosition"
import LayoutWidth from "../ThemeSettings/LayoutWidth"
import MenuBackground from "../ThemeSettings/MenuBackground"
import MenuPosition from "../ThemeSettings/MenuPosition"
import MenuStyle from "../ThemeSettings/MenuStyle"
import PrimaryTheme from "../ThemeSettings/PrimaryTheme"
import StyleLoader from "../ThemeSettings/StyleLoader"
import ThemeBackground from "../ThemeSettings/ThemeBackground"
import ProgressBar from "../elements/ProgressBar"
import Breadcrumb from './Breadcrumb'
import Footer1 from './Footer1'
import Header1 from "./Header1"
import Offcanvas from "./Offcanvas"
import Sidebar from './Sidebar'

export default function Layout({ headerStyle, breadcrumbTitleParent, breadcrumbTitle, children, boxed, menuIconHover, menuIconDefault }) {
    // Moblile Menu
    const [isSidebar, setSidebar] = useState(false)
    const handleSidebar = () => setSidebar(!isSidebar)

    const [isOffcanvas, setIsOffcanvas] = useState(false)
    const handleOffcanvas = () => setIsOffcanvas(!isOffcanvas)


    return (
        <>
            <ProgressBar />
            <MenuStyle />
            <LayoutWidth />
            <MenuPosition />
            <HeaderPosition />
            <StyleLoader />
            <ClearButton1 />
            <ColorsMenu />
            <ColorsHeader />
            <PrimaryTheme />
            <ThemeBackground />
            <MenuBackground />
            <ClearButton2 />
            <div id="wrapper">
                <div id="page">
                    <div className={`layout-wrap 
                    ${boxed ? "layout-width-boxed" : ""}
                    ${menuIconHover ? "menu-style-icon" : ""}
                    ${menuIconDefault ? "menu-style-icon-default" : ""}
                    ${isSidebar ? "full-width" : ""}
                    `}>
                        <Sidebar handleSidebar={handleSidebar} />
                        <div className="section-content-right">
                            <Header1 isSidebar={isSidebar} handleSidebar={handleSidebar} handleOffcanvas={handleOffcanvas} />
                            <div className="main-content">
                                <div className="main-content-inner">
                                    <div className="main-content-wrap">
                                        {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle}breadcrumbTitleParent={breadcrumbTitleParent} />}

                                        {children}
                                    </div>
                                </div>
                                <Footer1 />
                            </div>
                        </div>
                    </div>
                </div>
                <Offcanvas isOffcanvas={isOffcanvas} handleOffcanvas={handleOffcanvas} />
            </div>
        </>
    )
}
