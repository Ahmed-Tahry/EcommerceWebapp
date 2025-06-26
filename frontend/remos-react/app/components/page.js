'use client'
import ChartList from "@/components/chart/ChartList"
import DotDropdown from "@/components/elements/DotDropdown"
import ViewAllDropdown from "@/components/elements/ViewAllDropdown"
import WeeklyDropdown from "@/components/elements/WeeklyDropdown"
import Layout from "@/components/layout/Layout"
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useState } from "react"
const UsaMap = dynamic(() => import('@/components/elements/UsaMap'), {
    ssr: false,
})
export default function Components() {
    const [isTab1, setIsTab1] = useState(1)
    const handleTab1 = (i) => {
        setIsTab1(i)
    }
    const [isTab2, setIsTab2] = useState(1)
    const handleTab2 = (i) => {
        setIsTab2(i)
    }

    const [isToggle1, setToggle1] = useState(false)
    const handleToggle1 = () => setToggle1(!isToggle1)

    const [isToggle2, setToggle2] = useState(false)
    const handleToggle2 = () => setToggle2(!isToggle2)

    const [isToggle3, setToggle3] = useState(false)
    const handleToggle3 = () => setToggle3(!isToggle3)

    const [isToggle4, setToggle4] = useState(false)
    const handleToggle4 = () => setToggle4(!isToggle4)

    return (
        <>

            <Layout>
                <div className="themesflat-container full">
                    <div className="row">
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Alerts</h3>
                                <div className="block-warning">
                                    <i className="icon-alert-octagon" />
                                    <div className="body-title-2">Your license is invalid. Please activate your license!</div>
                                </div>
                                <div className="block-warning w-full">
                                    <i className="icon-alert-octagon" />
                                    <div className="body-title-2">Your license is invalid. Please activate your license!</div>
                                </div>
                                <div className="block-warning type-main">
                                    <i className="icon-alert-octagon" />
                                    <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                                </div>
                                <div className="block-warning type-main w-full">
                                    <i className="icon-alert-octagon" />
                                    <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Button</h3>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use class .tf-button</p>
                                    <button className="tf-button">Add product</button>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use .style-1 in class .btn class to change style 1</p>
                                    <button className="tf-button style-1">Add product</button>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use .style-2 in class .btn class to change style 2</p>
                                    <button className="tf-button style-2">Add product</button>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Button funtion</p>
                                    <div className="tf-button-funtion">
                                        <i className="icon-upload-cloud" />
                                        <div className="body-title">Upload</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Radio buttons</p>
                                    <div className="radio-buttons">
                                        <div className="item">
                                            <input type="radio" name="admin-language" id="admin-language1" defaultChecked />
                                            <label htmlFor="admin-language1"><span className="body-title-2">Left to Right</span></label>
                                        </div>
                                        <div className="item">
                                            <input type="radio" name="admin-language" id="admin-language2" />
                                            <label htmlFor="admin-language2"><span className="body-title-2">Right to Left</span></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Badges</h3>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use class .block-not-available</p>
                                    <div className="block-not-available">Not Available</div>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use class .block-available</p>
                                    <div className="block-available">Available</div>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use class .block-published</p>
                                    <div className="block-published">Published</div>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use class .block-pending</p>
                                    <div className="block-pending">Pending</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Chart</h3>
                                <div className="row">
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart default</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={1} color="#22C55E" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart bar</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={4} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart area</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={5} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart bar two column</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={12} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart bar full column</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={2} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart line</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={13} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart half donut</h5>
                                            <div className="wrap-chart">
                                                <ChartList style={7} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart donut</h5>
                                            <div className="flex justify-center">
                                                <ChartList style={15} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Chart map</h5>
                                            <UsaMap />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Dropdowns</h3>
                                <div className="row">
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">Select has image</h6>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Use &lt;select&gt; and class .image-select.no-text</p>
                                                <select className="image-select no-text">
                                                    <option data-thumbnail="images/country/1.png">ENG</option>
                                                    <option data-thumbnail="images/country/9.png">VIE</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">Dropdowns has content</h6>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Dropdown default</p>
                                                <div className="popup-wrap noti type-header">
                                                    <Menu as="div" className="dropdown">
                                                        <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <span className="item">
                                                                <span className="text-tiny">1</span>
                                                                <i className="icon-bell" />
                                                            </span>
                                                        </Menu.Button>
                                                        <Menu.Items as="ul" className="dropdown-menu has-content  d-block" aria-labelledby="dropdownButton1">
                                                            <li>
                                                                <h6>Message</h6>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-11.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Cameron Williamson</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Hello?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-12.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Ralph Edwards</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Are you there?  interested i this...</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-13.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Eleanor Pena</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Interested in this loads?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-11.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Jane Cooper</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Okay...Do we have a deal?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li><Link href="#" className="tf-button w-full">View all</Link></li>
                                                        </Menu.Items>
                                                    </Menu>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Dropdown end : add class .dropdown-menu-end in ul.dropdown-menu</p>
                                                <div className="popup-wrap noti type-header">
                                                    <Menu as="div" className="dropdown">
                                                        <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <span className="item">
                                                                <span className="text-tiny">1</span>
                                                                <i className="icon-bell" />
                                                            </span>
                                                        </Menu.Button>
                                                        <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content d-block" aria-labelledby="dropdownButton2">
                                                            <li>
                                                                <h6>Message</h6>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-11.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Cameron Williamson</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Hello?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-12.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Ralph Edwards</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Are you there?  interested i this...</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-13.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Eleanor Pena</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Interested in this loads?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="noti-item w-full wg-user active">
                                                                    <div className="image">
                                                                        <img src="/images/avatar/user-11.png" alt="" />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <Link href="#" className="body-title">Jane Cooper</Link>
                                                                            <div className="time">10:13 PM</div>
                                                                        </div>
                                                                        <div className="text-tiny">Okay...Do we have a deal?</div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li><Link href="#" className="tf-button w-full">View all</Link></li>
                                                        </Menu.Items>
                                                    </Menu>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">More</h6>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Dropdown more</p>
                                                <DotDropdown />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">View all</h6>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Dropdown view all</p>
                                                <ViewAllDropdown />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">Sort</h6>
                                            <div className="flex items-center gap10 flex-wrap">
                                                <p>Use &lt;select&gt; and class .style-default</p>
                                                <div className="select style-default">
                                                    <select className>
                                                        <option>Sort</option>
                                                        <option>Name</option>
                                                        <option>Day</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">Box dropdown no select</h6>
                                            <WeeklyDropdown />
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h6 className="mb-10">Box dropdown select</h6>
                                            <div className="select">
                                                <select className>
                                                    <option>EU - 44</option>
                                                    <option>EU - 40</option>
                                                    <option>EU - 50</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Form</h3>
                                <div className="row">
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Form search</h5>
                                            <form className="form-search">
                                                <fieldset className="name">
                                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                                </fieldset>
                                                <div className="button-submit">
                                                    <button type="submit"><i className="icon-search" /></button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Form select date</h5>
                                            <form className>
                                                <div className="select">
                                                    <input type="date" name="date" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-20">
                                        <div>
                                            <h5 className="mb-16">Form checkbox</h5>
                                            <form className>
                                                <div className="wrap-checkbox">
                                                    <ul className="table-title flex gap20 mb-14">
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="total-checkbox" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">Stt</div>
                                                        </li>
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="checkbox-item" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">#01</div>
                                                        </li>
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="checkbox-item" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">#02</div>
                                                        </li>
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="checkbox-item" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">#03</div>
                                                        </li>
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="checkbox-item" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">#04</div>
                                                        </li>
                                                        <li className="countries-item">
                                                            <div className="mb-10">
                                                                <input className="checkbox-item" type="checkbox" />
                                                            </div>
                                                            <div className="body-text">#05</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Form text</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div>
                                            <form className>
                                                <fieldset className="name mb-24">
                                                    <div className="body-title mb-10">Name <span className="tf-color-1">*</span></div>
                                                    <input type="text" placeholder="Name" name="text" tabIndex={0} aria-required="true" required />
                                                </fieldset>
                                                <fieldset className="email mb-24">
                                                    <div className="body-title mb-10">Admin email</div>
                                                    <input className="flex-grow" type="email" placeholder="Enter your email" name="email" tabIndex={0} aria-required="true" required />
                                                </fieldset>
                                                <fieldset className="description mb-24">
                                                    <div className="body-title mb-10">Description <span className="tf-color-1">*</span></div>
                                                    <textarea name="description" placeholder="Description" tabIndex={0} aria-required="true" required />
                                                </fieldset>
                                                <div className="bot">
                                                    <button className="tf-button w208" type="submit">Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Form text</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <form className="form-style-1">
                                            <fieldset className="name mb-24">
                                                <div className="body-title">Product name <span className="tf-color-1">*</span></div>
                                                <input className="flex-grow" type="text" placeholder="Category name" name="text" tabIndex={0} aria-required="true" required />
                                            </fieldset>
                                            <fieldset className="email mb-24">
                                                <div className="body-title mb-10">Admin email</div>
                                                <input className="flex-grow" type="email" placeholder="Enter your email" name="email" tabIndex={0} aria-required="true" required />
                                            </fieldset>
                                            <div className="bot">
                                                <div />
                                                <button className="tf-button w208" type="submit">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box">
                                <h3>Add image</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="upload-image mb-16">
                                            <div className="item">
                                                <img src="/images/images-section/gallery-1.png" alt="" />
                                            </div>
                                            <div className="item">
                                                <img src="/images/images-section/gallery-2.png" alt="" />
                                            </div>
                                            <div className="item">
                                                <img src="/images/images-section/gallery-3.png" alt="" />
                                            </div>
                                            <div className="item">
                                                <img src="/images/images-section/gallery-4.png" alt="" />
                                            </div>
                                            <div className="item up-load">
                                                <label className="uploadfile" htmlFor="myFile">
                                                    <span className="icon">
                                                        <i className="icon-upload-cloud" />
                                                    </span>
                                                    <span className="text-tiny">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                                    <input type="file" id="myFile" name="filename" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Offcanvas</h3>
                                <div className="setting cursor-pointer" onClick={handleToggle1}>
                                    <p>Offcanvas Right</p>
                                </div>
                                <div className="setting cursor-pointer" onClick={handleToggle2}>
                                    <p>Offcanvas Left</p>
                                </div>
                                <div className="setting cursor-pointer" onClick={handleToggle3}>
                                    <p>Offcanvas Top</p>
                                </div>
                                <div className="setting cursor-pointer" onClick={handleToggle4}>
                                    <p>Offcanvas Bottom</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Pagination</h3>
                                <div>
                                    <p className="mb-10">Pagination start</p>
                                    <ul className="wg-pagination">
                                        <li>
                                            <Link href="#"><i className="icon-chevron-left" /></Link>
                                        </li>
                                        <li>
                                            <Link href="#">1</Link>
                                        </li>
                                        <li className="active">
                                            <Link href="#">2</Link>
                                        </li>
                                        <li>
                                            <Link href="#">3</Link>
                                        </li>
                                        <li>
                                            <Link href="#"><i className="icon-chevron-right" /></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-10">Pagination center : add class .justify-content-center</p>
                                    <ul className="wg-pagination justify-content-center">
                                        <li>
                                            <Link href="#"><i className="icon-chevron-left" /></Link>
                                        </li>
                                        <li>
                                            <Link href="#">1</Link>
                                        </li>
                                        <li className="active">
                                            <Link href="#">2</Link>
                                        </li>
                                        <li>
                                            <Link href="#">3</Link>
                                        </li>
                                        <li>
                                            <Link href="#"><i className="icon-chevron-right" /></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-10">Pagination end : add class .justify-content-end</p>
                                    <ul className="wg-pagination justify-content-end">
                                        <li>
                                            <Link href="#"><i className="icon-chevron-left" /></Link>
                                        </li>
                                        <li>
                                            <Link href="#">1</Link>
                                        </li>
                                        <li className="active">
                                            <Link href="#">2</Link>
                                        </li>
                                        <li>
                                            <Link href="#">3</Link>
                                        </li>
                                        <li>
                                            <Link href="#"><i className="icon-chevron-right" /></Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Progress</h3>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">20%</div>
                                    <div className="progress-level-bar w-full">
                                        <span data-progress={20} data-max={100} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">40%</div>
                                    <div className="progress-level-bar t1 w-full">
                                        <span data-progress={40} data-max={100} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">50%</div>
                                    <div className="progress-level-bar t2 w-full">
                                        <span data-progress={50} data-max={100} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">60%</div>
                                    <div className="progress-level-bar t3 w-full">
                                        <span data-progress={60} data-max={100} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">80%</div>
                                    <div className="progress-level-bar t4 w-full">
                                        <span data-progress={80} data-max={100} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="text-tiny">100%</div>
                                    <div className="progress-level-bar t5 w-full">
                                        <span data-progress={100} data-max={100} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Tabs</h3>
                                <div>
                                    <h5 className="mb-16">Tabs default</h5>
                                    <div className="widget-tabs">
                                        <ul className="widget-menu-tab">
                                            <li className={isTab1 === 1 ? "item-title active" : "item-title"} onClick={() => handleTab1(1)}>
                                                <span className="inner"><span className="h6">Tabs 1</span></span>
                                            </li>
                                            <li className={isTab1 === 2 ? "item-title active" : "item-title"} onClick={() => handleTab1(2)}>
                                                <span className="inner"><span className="h6">Tabs 2</span></span>
                                            </li>
                                        </ul>
                                        <div className="widget-content-tab">
                                            <div className="widget-content-inner active" style={{ display: `${isTab1 === 1 ? "block" : "none"}` }}>
                                                <p>
                                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo molestias saepe id dolores at sed, numquam vero, amet iure reiciendis exercitationem ut laudantium! Voluptas tempora architecto dicta ex a eum?
                                                    Neque distinctio, deleniti enim, similique accusantium saepe asperiores sed aperiam tenetur itaque ullam quidem qui minus culpa minima, id pariatur unde. Eum, nobis? Animi consequatur et dolorum distinctio veniam assumenda.
                                                </p>
                                            </div>
                                            <div className="widget-content-inner" style={{ display: `${isTab1 === 2 ? "block" : "none"}` }}>
                                                <p>
                                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat fugit doloribus quibusdam a quae? Eveniet modi obcaecati, quis a debitis minima! Optio libero quam vitae expedita quisquam minus voluptatem debitis?
                                                    Aspernatur minima reprehenderit culpa rerum, asperiores recusandae. Sunt molestias fugiat impedit, porro itaque iusto dolor consectetur excepturi, tenetur quae sed architecto ab explicabo voluptate at modi! Expedita quisquam accusantium quas.
                                                    Aliquam placeat beatae iste eos optio enim in, aperiam ipsa qui similique sapiente, quos exercitationem tempore, obcaecati libero quas aut repellendus rerum ab vitae dicta dolor a dignissimos modi. Maxime.
                                                    Pariatur harum mollitia numquam impedit vitae magnam quo quaerat dignissimos ipsam sunt, itaque beatae, sequi velit! Voluptas magni adipisci mollitia minus, veniam illo excepturi commodi odit nihil tempora eum impedit.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-16">Tabs style 1</h5>
                                    <div className="widget-tabs">
                                        <ul className="widget-menu-tab style-1">
                                            <li className={isTab2 === 1 ? "item-title active" : "item-title"} onClick={() => handleTab2(1)}>
                                                <span className="inner"><span className="h6">Tabs 1</span></span>
                                            </li>
                                            <li className={isTab2 === 2 ? "item-title active" : "item-title"} onClick={() => handleTab2(2)}>
                                                <span className="inner"><span className="h6">Tabs 2</span></span>
                                            </li>
                                        </ul>
                                        <div className="widget-content-tab">
                                            <div className="widget-content-inner active" style={{ display: `${isTab2 === 1 ? "block" : "none"}` }}>
                                                <p>
                                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo molestias saepe id dolores at sed, numquam vero, amet iure reiciendis exercitationem ut laudantium! Voluptas tempora architecto dicta ex a eum?
                                                    Neque distinctio, deleniti enim, similique accusantium saepe asperiores sed aperiam tenetur itaque ullam quidem qui minus culpa minima, id pariatur unde. Eum, nobis? Animi consequatur et dolorum distinctio veniam assumenda.
                                                </p>
                                            </div>
                                            <div className="widget-content-inner" style={{ display: `${isTab2 === 2 ? "block" : "none"}` }}>
                                                <p>
                                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat fugit doloribus quibusdam a quae? Eveniet modi obcaecati, quis a debitis minima! Optio libero quam vitae expedita quisquam minus voluptatem debitis?
                                                    Aspernatur minima reprehenderit culpa rerum, asperiores recusandae. Sunt molestias fugiat impedit, porro itaque iusto dolor consectetur excepturi, tenetur quae sed architecto ab explicabo voluptate at modi! Expedita quisquam accusantium quas.
                                                    Aliquam placeat beatae iste eos optio enim in, aperiam ipsa qui similique sapiente, quos exercitationem tempore, obcaecati libero quas aut repellendus rerum ab vitae dicta dolor a dignissimos modi. Maxime.
                                                    Pariatur harum mollitia numquam impedit vitae magnam quo quaerat dignissimos ipsam sunt, itaque beatae, sequi velit! Voluptas magni adipisci mollitia minus, veniam illo excepturi commodi odit nihil tempora eum impedit.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Typography</h3>
                                <p>Display Headings</p>
                                <h1>h1</h1>
                                <h2>h2</h2>
                                <h3>h3</h3>
                                <h4>h4</h4>
                                <h5>h5</h5>
                                <h6>h5</h6>
                                <div className="body-title">body title</div>
                                <div className="body-title-2">body title 2</div>
                                <div className="body-text">body text</div>
                                <div className="text-tiny">text tiny</div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3 className="mb-16">Other</h3>
                                <div>
                                    <h5 className="mb-10">Rating</h5>
                                    <div className="flex items-center gap10">
                                        <p>Rating default</p>
                                        <div className="ratings">
                                            <i className="icon-star1 active" />
                                            <i className="icon-star1 active" />
                                            <i className="icon-star1 active" />
                                            <i className="icon-star1 active" />
                                            <i className="icon-star1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <p>Rating has number</p>
                                        <div className="rating-number">
                                            <div className="icon">
                                                <i className="icon-star1" />
                                            </div>
                                            <div className="number body-text">4.7</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-10">List box text</h5>
                                    <div className="list-box-value mb-10">
                                        <div className="box-value-item"><div className="body-text">EU - 38.5</div></div>
                                        <div className="box-value-item"><div className="body-text">EU - 39</div></div>
                                        <div className="box-value-item"><div className="body-text">EU - 40</div></div>
                                        <div className="box-value-item"><div className="body-text">EU - 38.5</div></div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-10">List icon function</h5>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Box icon</h3>
                                <div className>
                                    <p>Change number up</p>
                                    <div className="box-icon-trending up">
                                        <i className="icon-trending-up" />
                                        <div className="body-title number">1.56%</div>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <h4>$37,802</h4>
                                        <div className="box-icon-trending up">
                                            <i className="icon-trending-up" />
                                            <div className="body-title number">1.56%</div>
                                        </div>
                                        <div className="text-tiny">since last weekend</div>
                                    </div>
                                </div>
                                <div className>
                                    <p>No-change number</p>
                                    <div className="box-icon-trending">
                                        <i className="icon-trending-up" />
                                        <div className="body-title number">0.00%</div>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <h4>$37,802</h4>
                                        <div className="box-icon-trending">
                                            <i className="icon-trending-up" />
                                            <div className="body-title number">0.00%</div>
                                        </div>
                                        <div className="text-tiny">since last weekend</div>
                                    </div>
                                </div>
                                <div className>
                                    <p>Change number down</p>
                                    <div className="box-icon-trending down">
                                        <i className="icon-trending-down" />
                                        <div className="body-title number">1.56%</div>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <h4>$37,802</h4>
                                        <div className="box-icon-trending down">
                                            <i className="icon-trending-down" />
                                            <div className="body-title number">1.56%</div>
                                        </div>
                                        <div className="text-tiny">since last weekend</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Breadcrumb</h3>
                                <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                                    <li>
                                        <Link href="/"><div className="text-tiny">Dashboard</div></Link>
                                    </li>
                                    <li>
                                        <i className="icon-chevron-right" />
                                    </li>
                                    <li>
                                        <Link href="#"><div className="text-tiny">Ecommerce</div></Link>
                                    </li>
                                    <li>
                                        <i className="icon-chevron-right" />
                                    </li>
                                    <li>
                                        <div className="text-tiny">Add product</div>
                                    </li>
                                </ul>
                                <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                                    <li>
                                        <Link href="/"><div className="text-tiny">Dashboard</div></Link>
                                    </li>
                                    <li>
                                        <i className="icon-chevron-right" />
                                    </li>
                                    <li>
                                        <div className="text-tiny">Setting</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div className="wg-box h-full">
                                <h3>Gallery item</h3>
                                <div className="row">
                                    <div className="col-xl-12 mb-20">
                                        <div className="flex">
                                            <Link href="#" className="gallery-item">
                                                <div className="image">
                                                    <img src="/images/images-section/all-gallery-4.png" alt="" />
                                                </div>
                                                <div className="text-tiny">Feed for dogs and cats – Brit</div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box h-full">
                                <h3>Product item</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="product-item">
                                            <div className="image">
                                                <img src="/images/products/1.png" alt="" />
                                            </div>
                                            <div className="flex items-center justify-between flex-grow">
                                                <div className="name">
                                                    <Link href="/product-list" className="body-title-2">Patimax Fragrance Long...</Link>
                                                    <div className="text-tiny mt-3">100 Items</div>
                                                </div>
                                                <div>
                                                    <div className="text-tiny mb-3">Coupon Code</div>
                                                    <div className="body-text">Sflat</div>
                                                </div>
                                                <div className="country">
                                                    <img src="/images/country/2.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className="body-title-2 mb-3">-15%</div>
                                                    <div className="text-tiny">$27.00</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box h-full">
                                <h3>Country item</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="country-item">
                                            <div className="image">
                                                <img src="/images/country/6.png" alt="" />
                                            </div>
                                            <div className="flex-grow flex items-center justify-between">
                                                <Link href="/countries" className="body-text name">Turkish Flag</Link>
                                                <div className="box-icon-trending up">
                                                    <i className="icon-trending-up" />
                                                </div>
                                                <div className="body-text number">6,972</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box h-full">
                                <h3>Shop item</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="shop-item">
                                            <div className="image">
                                                <img src="/images/shop/1.png" alt="" />
                                            </div>
                                            <div className="flex-grow flex items-center justify-between gap20">
                                                <div>
                                                    <Link href="#" className="body-text name">Robert</Link>
                                                    <div className="text-tiny mt-4">73 Purchases</div>
                                                </div>
                                                <div className="body-text">Kitchen, Pets</div>
                                                <div className="body-text">$1,000</div>
                                                <div className="flex items-center justify-between gap10">
                                                    <div className="progress-level-bar">
                                                        <span data-progress={29} data-max={70} style={{ width: '41.4286%' }} />
                                                    </div>
                                                    <div className="text-tiny">100%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box h-full">
                                <h3>Comment item</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="comment-item">
                                            <div className="image">
                                                <img src="/images/avatar/user-4.png" alt="" />
                                            </div>
                                            <div className>
                                                <div className="mb-4 name">
                                                    <Link href="/all-user" className="body-title-2">Devon Lane</Link>
                                                </div>
                                                <div className="ratings mb-10">
                                                    <i className="icon-star1 active" />
                                                    <i className="icon-star1 active" />
                                                    <i className="icon-star1 active" />
                                                    <i className="icon-star1 active" />
                                                    <i className="icon-star1" />
                                                </div>
                                                <div className="text-tiny">Morbi eget commodo diam. Praesent dignissim purus ac turpis porta</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-20">
                            <div className="wg-box h-full">
                                <h3>Attribute item</h3>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <div className="attribute-item flex items-center justify-between gap20 mb-10">
                                            <div className="name">
                                                <Link href="/add-attributes" className="body-title-2">Color</Link>
                                            </div>
                                            <div className="body-text">Blue, green, white</div>
                                            <div className="list-icon-function">
                                                <div className="item eye">
                                                    <i className="icon-eye" />
                                                </div>
                                                <div className="item edit">
                                                    <i className="icon-edit-3" />
                                                </div>
                                                <div className="item trash">
                                                    <i className="icon-trash-2" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="attribute-item flex items-center justify-between gap20">
                                            <div className="name">
                                                <Link href="/add-attributes" className="body-title-2">Size</Link>
                                            </div>
                                            <div className="body-text">S, M, L, XL</div>
                                            <div className="list-icon-function">
                                                <div className="item eye">
                                                    <i className="icon-eye" />
                                                </div>
                                                <div className="item edit">
                                                    <i className="icon-edit-3" />
                                                </div>
                                                <div className="item trash">
                                                    <i className="icon-trash-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="wg-box h-full">
                                <h3>Roadmap</h3>
                                <div className="road-map">
                                    <div className="road-map-item active">
                                        <div className="icon"><i className="icon-check" /></div>
                                        <h6>Receiving orders</h6>
                                        <div className="body-text">05:43 AM</div>
                                    </div>
                                    <div className="road-map-item active">
                                        <div className="icon"><i className="icon-check" /></div>
                                        <h6>Order processing</h6>
                                        <div className="body-text">01:21 PM</div>
                                    </div>
                                    <div className="road-map-item active">
                                        <div className="icon"><i className="icon-check" /></div>
                                        <h6>Being delivered</h6>
                                        <div className="body-text">Processing</div>
                                    </div>
                                    <div className="road-map-item">
                                        <div className="icon"><i className="icon-check" /></div>
                                        <h6>Delivered</h6>
                                        <div className="body-text">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`offcanvas offcanvas-end ${isToggle1 ? "show" : ""}`} style={{ visibility: `${isToggle1 ? "visible" : "hidden"}` }}>
                    <div className="offcanvas-header">
                        <h6>Offcanvas</h6>
                        <button type="button" className="btn-close text-reset" onClick={handleToggle1} />
                    </div>
                    <div className="offcanvas-body">
                        <p>Offcanvas Right</p>
                    </div>
                </div>
                <div className={`offcanvas offcanvas-start ${isToggle2 ? "show" : ""}`} style={{ visibility: `${isToggle2 ? "visible" : "hidden"}` }}>
                    <div className="offcanvas-header">
                        <h6>Offcanvas</h6>
                        <button type="button" className="btn-close text-reset" onClick={handleToggle2} />
                    </div>
                    <div className="offcanvas-body">
                        <p>Offcanvas Left</p>
                    </div>
                </div>
                <div className={`offcanvas offcanvas-top ${isToggle3 ? "show" : ""}`} style={{ visibility: `${isToggle3 ? "visible" : "hidden"}` }}>
                    <div className="offcanvas-header">
                        <h6>Offcanvas</h6>
                        <button type="button" className="btn-close text-reset" onClick={handleToggle3} />
                    </div>
                    <div className="offcanvas-body">
                        <p>Offcanvas Top</p>
                    </div>
                </div>
                <div className={`offcanvas offcanvas-bottom ${isToggle4 ? "show" : ""}`} style={{ visibility: `${isToggle4 ? "visible" : "hidden"}` }}>
                    <div className="offcanvas-header">
                        <h6>Offcanvas</h6>
                        <button type="button" className="btn-close text-reset" onClick={handleToggle4} />
                    </div>
                    <div className="offcanvas-body">
                        <p>Offcanvas Bottom</p>
                    </div>
                </div>
                {isToggle1 &&
                    <div className="modal-backdrop fade show" onClick={() => { handleToggle1() }} />
                }
                {isToggle2 &&
                    <div className="modal-backdrop fade show" onClick={() => { handleToggle2() }} />
                }
                {isToggle3 &&
                    <div className="modal-backdrop fade show" onClick={() => { handleToggle3() }} />
                }
                {isToggle4 &&
                    <div className="modal-backdrop fade show" onClick={() => { handleToggle4() }} />
                }


            </Layout>
        </>
    )
}