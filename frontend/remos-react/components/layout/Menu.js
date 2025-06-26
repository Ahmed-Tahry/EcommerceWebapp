"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Menu() {
    const router = usePathname()

    const [activeAccordion, setActiveAccordion] = useState(null)

    useEffect(() => {
        const accordionRoutes = {
            '/': 1,
            '/home-2': 1,
            '/home-3': 1,
            '/home-4': 1,
            '/home-boxed': 1,
            '/home-menu-icon-hover': 1,
            '/home-menu-icon-default': 1,
            '/add-product': 2,
            '/product-list': 2,
            '/product-detail-1': 2,
            '/product-detail-2': 2,
            '/product-detail-3': 2,
            '/category-list': 3,
            '/new-category': 3,
            '/attributes': 4,
            '/add-attributes': 4,
            '/oder-list': 5,
            '/oder-detail': 5,
            '/oder-tracking': 5,
            '/all-user': 6,
            '/add-new-user': 6,
            '/login': 6,
            '/sign-up': 6,
            '/all-roles': 7,
            '/create-role': 7,
            '/gallery': 0,
            '/report': 0,
            '/countries': 8,
            '/states': 8,
            '/cities': 8,
            '/setting': 0,
            '/list-page': 9,
            '/new-page': 9,
            '/edit-page': 9,
            '/components': 0,
            '/faq': 10,
            '/privacy-policy': 10,
        }

        // Check if the current path is in the object of accordion routes and set the activeAccordion state accordingly
        if (accordionRoutes.hasOwnProperty(router)) {
            setActiveAccordion(accordionRoutes[router])
        } else {
            setActiveAccordion(null)
        }
    }, [router])

    const handleAccordion = (key) => {
        setActiveAccordion(prevState => prevState === key ? null : key)
    }

    const isSubMenuItemActive = (path) => {
        return router === path
    }

    return (
        <div className="center">
            <div className="center-item">
                <div className="center-heading">Main Home</div>
                <ul className="menu-list">
                    <li className={`menu-item has-children ${activeAccordion === 1 ? 'active' : ''}`}>
                        <a className="menu-item-button" onClick={() => handleAccordion(1)}>
                            <div className="icon"><i className="icon-grid" /></div>
                            <div className="text">Dashboard</div>
                        </a>
                        <ul className="sub-menu" style={{ display: `${activeAccordion === 1 ? "block" : "none"}` }}>
                            <li className="sub-menu-item">
                                <Link href="/" className={isSubMenuItemActive('/') ? 'active' : ''}>
                                    <div className="text">Home 01</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-2" className={isSubMenuItemActive('/home-2') ? 'active' : ''}>
                                    <div className="text">Home 02</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-3" className={isSubMenuItemActive('/home-3') ? 'active' : ''}>
                                    <div className="text">Home 03</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-4" className={isSubMenuItemActive('/home-4') ? 'active' : ''}>
                                    <div className="text">Home 04</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-boxed" className={isSubMenuItemActive('/home-boxed') ? 'active' : ''}>
                                    <div className="text">Home Boxed</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-menu-icon-hover" className={isSubMenuItemActive('/home-menu-icon-hover') ? 'active' : ''}>
                                    <div className="text">Home Menu Icon Hover</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/home-menu-icon-default" className={isSubMenuItemActive('/home-menu-icon-default') ? 'active' : ''}>
                                    <div className="text">Home Menu Icon Default</div>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="center-item">
                <div className="center-item">
                    <div className="center-heading">All page</div>
                    <ul className="menu-list">
                        <li className={`menu-item has-children ${activeAccordion === 2 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(2)}>
                                <div className="icon"><i className="icon-shopping-cart" /></div>
                                <div className="text">Ecommerce</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 2 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/add-product" className={isSubMenuItemActive('/add-product') ? 'active' : ''}>
                                        <div className="text">Add Product</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/product-list" className={isSubMenuItemActive('/product-list') ? 'active' : ''}>
                                        <div className="text">Product List</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/product-detail-1" className={isSubMenuItemActive('/product-detail-1') ? 'active' : ''}>
                                        <div className="text">Product Detail 1</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/product-detail-2" className={isSubMenuItemActive('/product-detail-2') ? 'active' : ''}>
                                        <div className="text">Product Detail 2</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/product-detail-3" className={isSubMenuItemActive('/product-detail-3') ? 'active' : ''}>
                                        <div className="text">Product Detail 3</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item has-children ${activeAccordion === 3 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(3)}>
                                <div className="icon"><i className="icon-layers" /></div>
                                <div className="text">Category</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 3 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/category-list" className={isSubMenuItemActive('/category-list') ? 'active' : ''}>
                                        <div className="text">Category list</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/new-category" className={isSubMenuItemActive('/new-category') ? 'active' : ''}>
                                        <div className="text">New category</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item has-children ${activeAccordion === 4 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(4)}>
                                <div className="icon"><i className="icon-box" /></div>
                                <div className="text">Attributes</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 4 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/attributes" className={isSubMenuItemActive('/attributes') ? 'active' : ''}>
                                        <div className="text">Attributes</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/add-attributes" className={isSubMenuItemActive('/add-attributes') ? 'active' : ''}>
                                        <div className="text">Add attributes</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item has-children ${activeAccordion === 5 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(5)}>
                                <div className="icon"><i className="icon-file-plus" /></div>
                                <div className="text">Order</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 5 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/oder-list" className={isSubMenuItemActive('/oder-list') ? 'active' : ''}>
                                        <div className="text">Order list</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/oder-detail" className={isSubMenuItemActive('/oder-detail') ? 'active' : ''}>
                                        <div className="text">Order detail</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/oder-tracking" className={isSubMenuItemActive('/oder-tracking') ? 'active' : ''}>
                                        <div className="text">Order tracking</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item has-children ${activeAccordion === 6 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(6)}>
                                <div className="icon"><i className="icon-user" /></div>
                                <div className="text">User</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 6 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/all-user" className={isSubMenuItemActive('/all-user') ? 'active' : ''}>
                                        <div className="text">All user</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/add-new-user" className={isSubMenuItemActive('/add-new-user') ? 'active' : ''}>
                                        <div className="text">Add new user</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/login" className={isSubMenuItemActive('/login') ? 'active' : ''}>
                                        <div className="text">Login</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/sign-up" className={isSubMenuItemActive('/sign-up') ? 'active' : ''}>
                                        <div className="text">Sign up</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item has-children ${activeAccordion === 7 ? 'active' : ''}`}>
                            <a className="menu-item-button" onClick={() => handleAccordion(7)}>
                                <div className="icon"><i className="icon-user-plus" /></div>
                                <div className="text">Roles</div>
                            </a>
                            <ul className="sub-menu" style={{ display: `${activeAccordion === 7 ? "block" : "none"}` }}>
                                <li className="sub-menu-item">
                                    <Link href="/all-roles" className={isSubMenuItemActive('/all-roles') ? 'active' : ''}>
                                        <div className="text">All roles</div>
                                    </Link>
                                </li>
                                <li className="sub-menu-item">
                                    <Link href="/create-role" className={isSubMenuItemActive('/create-role') ? 'active' : ''}>
                                        <div className="text">Create role</div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`menu-item ${router === '/gallery' ? 'active' : ''}`}>
                            <Link href="/gallery" className={isSubMenuItemActive('/gallery') ? 'active' : ''}>
                                <div className="icon"><i className="icon-image" /></div>
                                <div className="text">Gallery</div>
                            </Link>
                        </li>
                        <li className={`menu-item ${router === '/report' ? 'active' : ''}`}>
                            <Link href="/report" className={isSubMenuItemActive('/report') ? 'active' : ''}>
                                <div className="icon"><i className="icon-pie-chart" /></div>
                                <div className="text">Report</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="center-item">
                <div className="center-heading">Setting</div>
                <ul className="menu-list">
                    <li className={`menu-item has-children ${activeAccordion === 8 ? 'active' : ''}`}>
                        <a className="menu-item-button" onClick={() => handleAccordion(8)}>
                            <div className="icon"><i className="icon-map-pin" /></div>
                            <div className="text">Location</div>
                        </a>
                        <ul className="sub-menu" style={{ display: `${activeAccordion === 8 ? "block" : "none"}` }}>
                            <li className="sub-menu-item">
                                <Link href="/countries" className={isSubMenuItemActive('/countries') ? 'active' : ''}>
                                    <div className="text">Countries</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/states" className={isSubMenuItemActive('/states') ? 'active' : ''}>
                                    <div className="text">States</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/cities" className={isSubMenuItemActive('/cities') ? 'active' : ''}>
                                    <div className="text">Cities</div>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`menu-item ${router === '/setting' ? 'active' : ''}`}>
                        <Link href="/setting" className={isSubMenuItemActive('/setting') ? 'active' : ''}>
                            <div className="icon"><i className="icon-settings" /></div>
                            <div className="text">Setting</div>
                        </Link>
                    </li>
                    <li className={`menu-item has-children ${activeAccordion === 9 ? 'active' : ''}`}>
                        <a className="menu-item-button" onClick={() => handleAccordion(9)}>
                            <div className="icon"><i className="icon-edit" /></div>
                            <div className="text">Pages</div>
                        </a>
                        <ul className="sub-menu" style={{ display: `${activeAccordion === 9 ? "block" : "none"}` }}>
                            <li className="sub-menu-item">
                                <Link href="/list-page" className={isSubMenuItemActive('/list-page') ? 'active' : ''}>
                                    <div className="text">List page</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/new-page" className={isSubMenuItemActive('/new-page') ? 'active' : ''}>
                                    <div className="text">New page</div>
                                </Link>
                            </li>
                            <li className="sub-menu-item">
                                <Link href="/edit-page" className={isSubMenuItemActive('/edit-page') ? 'active' : ''}>
                                    <div className="text">Edit page</div>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="center-item">
                <div className="center-heading">Components</div>
                <ul className="menu-list">
                    <li className={`menu-item ${router === '/components' ? 'active' : ''}`}>
                        <Link href="/components" className={isSubMenuItemActive('/components') ? 'active' : ''}>
                            <div className="icon"><i className="icon-database" /></div>
                            <div className="text">Components</div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="center-item">
                <div className="center-heading">Support</div>
                <ul className="menu-list">
                    <li className={`menu-item`}>
                        <Link href="#" className>
                            <div className="icon"><i className="icon-help-circle" /></div>
                            <div className="text">Help center</div>
                        </Link>
                    </li>
                    <li className={`menu-item`}>
                        <Link href="#" className>
                            <div className="icon">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.7727 4.27031C15.025 3.51514 14.1357 2.91486 13.1558 2.50383C12.1758 2.09281 11.1244 1.87912 10.0617 1.875H10C7.84512 1.875 5.77849 2.73102 4.25476 4.25476C2.73102 5.77849 1.875 7.84512 1.875 10V14.375C1.875 14.8723 2.07254 15.3492 2.42417 15.7008C2.77581 16.0525 3.25272 16.25 3.75 16.25H5C5.49728 16.25 5.9742 16.0525 6.32583 15.7008C6.67746 15.3492 6.875 14.8723 6.875 14.375V11.25C6.875 10.7527 6.67746 10.2758 6.32583 9.92417C5.9742 9.57254 5.49728 9.375 5 9.375H3.15313C3.27366 8.07182 3.76315 6.83 4.56424 5.79508C5.36532 4.76016 6.44481 3.97502 7.67617 3.53169C8.90753 3.08836 10.2398 3.0052 11.5167 3.29196C12.7936 3.57872 13.9624 4.22352 14.8859 5.15078C16.0148 6.28539 16.7091 7.78052 16.8477 9.375H15C14.5027 9.375 14.0258 9.57254 13.6742 9.92417C13.3225 10.2758 13.125 10.7527 13.125 11.25V14.375C13.125 14.8723 13.3225 15.3492 13.6742 15.7008C14.0258 16.0525 14.5027 16.25 15 16.25H16.875C16.875 16.7473 16.6775 17.2242 16.3258 17.5758C15.9742 17.9275 15.4973 18.125 15 18.125H10.625C10.4592 18.125 10.3003 18.1908 10.1831 18.3081C10.0658 18.4253 10 18.5842 10 18.75C10 18.9158 10.0658 19.0747 10.1831 19.1919C10.3003 19.3092 10.4592 19.375 10.625 19.375H15C15.8288 19.375 16.6237 19.0458 17.2097 18.4597C17.7958 17.8737 18.125 17.0788 18.125 16.25V10C18.1291 8.93717 17.9234 7.88398 17.5197 6.90077C17.1161 5.91757 16.5224 5.02368 15.7727 4.27031ZM5 10.625C5.16576 10.625 5.32473 10.6908 5.44194 10.8081C5.55915 10.9253 5.625 11.0842 5.625 11.25V14.375C5.625 14.5408 5.55915 14.6997 5.44194 14.8169C5.32473 14.9342 5.16576 15 5 15H3.75C3.58424 15 3.42527 14.9342 3.30806 14.8169C3.19085 14.6997 3.125 14.5408 3.125 14.375V10.625H5ZM15 15C14.8342 15 14.6753 14.9342 14.5581 14.8169C14.4408 14.6997 14.375 14.5408 14.375 14.375V11.25C14.375 11.0842 14.4408 10.9253 14.5581 10.8081C14.6753 10.6908 14.8342 10.625 15 10.625H16.875V15H15Z" fill="#111111" />
                                </svg>
                            </div>
                            <div className="text">FAQs</div>
                        </Link>
                    </li>
                    <li className={`menu-item`}>
                        <Link href="#" className>
                            <div className="icon">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_604_18468)">
                                        <path d="M4.71875 7V1H15.5561L18.9991 4.44801V19H4.71875C4.71875 19 4.71875 16.2 4.71875 13.5" stroke="#111111" strokeWidth="1.2" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M19.0015 4.44801H15.5586V1L19.0015 4.44801Z" stroke="#111111" strokeWidth="1.2" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7.53469 14.5507C9.89243 14.5507 11.8037 12.6366 11.8037 10.2754C11.8037 7.91415 9.89243 6 7.53469 6C5.17695 6 3.26562 7.91415 3.26562 10.2754C3.26562 12.6366 5.17695 14.5507 7.53469 14.5507Z" stroke="#111111" strokeWidth="1.2" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5.41029 13.9852L2.90967 16.4895C2.47263 16.9272 1.76451 16.9272 1.3275 16.4895C0.890833 16.0522 0.890833 15.3427 1.3275 14.9054L3.82812 12.4011M6.14799 10.2051L7.11794 11.175L8.91794 9.375" stroke="#111111" strokeWidth="1.2" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_604_18468">
                                            <rect width={20} height={20} fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="text">Privacy policy</div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="center-item">
                <div className="center-heading">Connect us</div>
                <ul className="wg-social">
                    <li>
                        <Link href="#"><i className="icon-facebook" /></Link>
                    </li>
                    <li className="active">
                        <Link href="#"><i className="icon-twitter" /></Link>
                    </li>
                    <li>
                        <Link href="#"><i className="icon-linkedin" /></Link>
                    </li>
                    <li>
                        <Link href="#"><i className="icon-instagram" /></Link>
                    </li>
                </ul>
            </div>

        </div>
    )
}
