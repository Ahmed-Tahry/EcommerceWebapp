'use client'
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from "next/link"
import FullScreenButton from '../elements/FullScreenButton'
import Language from '../elements/Language'
const ThemeSwitch = dynamic(() => import('../elements/ThemeSwitch'), {
    ssr: false,
})

export default function Header1({ scroll, isMobileMenu, handleSidebar, handleOffcanvas }) {
    return (
        <>

            <div className="header-dashboard">
                <div className="wrap">
                    <div className="header-left">
                        <Link href="/">
                            <img id="logo_header_mobile" alt="" src="/images/logo/logo.png" data-light="images/logo/logo.png" data-dark="images/logo/logo-dark.png" data-width="154px" data-height="52px" data-retina="images/logo/logo@2x.png" />
                        </Link>
                        <div className="button-show-hide" onClick={handleSidebar}>
                            <i className="icon-menu-left" />
                        </div>
                        <form className="form-search flex-grow">
                            <fieldset className="name">
                                <input type="text" placeholder="Search here..." className="show-search" name="name" tabIndex={2} aria-required="true" required />
                            </fieldset>
                            <div className="button-submit">
                                <button type="submit"><i className="icon-search" /></button>
                            </div>
                            <div className="box-content-search" id="box-content-search">
                                <ul className="mb-24">
                                    <li className="mb-14">
                                        <div className="body-title">Top selling product</div>
                                    </li>
                                    <li className="mb-14">
                                        <div className="divider" />
                                    </li>
                                    <li>
                                        <ul>
                                            <li className="product-item gap14 mb-10">
                                                <div className="image no-bg">
                                                    <img src="/images/products/17.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Dog Food
                                                            Rachael Ray Nutrish®</Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-10">
                                                <div className="divider" />
                                            </li>
                                            <li className="product-item gap14 mb-10">
                                                <div className="image no-bg">
                                                    <img src="/images/products/18.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Natural
                                                            Dog Food Healthy Dog Food</Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-10">
                                                <div className="divider" />
                                            </li>
                                            <li className="product-item gap14">
                                                <div className="image no-bg">
                                                    <img src="/images/products/19.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Freshpet
                                                            Healthy Dog Food and Cat</Link>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul className>
                                    <li className="mb-14">
                                        <div className="body-title">Order product</div>
                                    </li>
                                    <li className="mb-14">
                                        <div className="divider" />
                                    </li>
                                    <li>
                                        <ul>
                                            <li className="product-item gap14 mb-10">
                                                <div className="image no-bg">
                                                    <img src="/images/products/20.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Sojos
                                                            Crunchy Natural Grain Free...</Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-10">
                                                <div className="divider" />
                                            </li>
                                            <li className="product-item gap14 mb-10">
                                                <div className="image no-bg">
                                                    <img src="/images/products/21.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Kristin
                                                            Watson</Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-10">
                                                <div className="divider" />
                                            </li>
                                            <li className="product-item gap14 mb-10">
                                                <div className="image no-bg">
                                                    <img src="/images/products/22.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Mega
                                                            Pumpkin Bone</Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-10">
                                                <div className="divider" />
                                            </li>
                                            <li className="product-item gap14">
                                                <div className="image no-bg">
                                                    <img src="/images/products/23.png" alt="" />
                                                </div>
                                                <div className="flex items-center justify-between gap20 flex-grow">
                                                    <div className="name">
                                                        <Link href="/product-list" className="body-text">Mega
                                                            Pumpkin Bone</Link>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                    <div className="header-grid">
                        <div className="header-item country">
                            <Language />
                        </div>
                        <ThemeSwitch />
                        <div className="popup-wrap noti type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <span className="text-tiny">1</span>
                                        <i className="icon-bell" />
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0" aria-labelledby="dropdownMenuButton1">
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
                                                <div className="text-tiny">Are you there? interested i this...</div>
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
                        <div className="popup-wrap message type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <span className="text-tiny">1</span>
                                        <i className="icon-message-square" />
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0" aria-labelledby="dropdownMenuButton2">
                                    <li>
                                        <h6>Notifications</h6>
                                    </li>
                                    <li>
                                        <div className="message-item item-1">
                                            <div className="image">
                                                <i className="icon-noti-1" />
                                            </div>
                                            <div>
                                                <div className="body-title-2">Discount available</div>
                                                <div className="text-tiny">Morbi sapien massa, ultricies at rhoncus
                                                    at, ullamcorper nec diam</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="message-item item-2">
                                            <div className="image">
                                                <i className="icon-noti-2" />
                                            </div>
                                            <div>
                                                <div className="body-title-2">Account has been verified</div>
                                                <div className="text-tiny">Mauris libero ex, iaculis vitae rhoncus
                                                    et</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="message-item item-3">
                                            <div className="image">
                                                <i className="icon-noti-3" />
                                            </div>
                                            <div>
                                                <div className="body-title-2">Order shipped successfully</div>
                                                <div className="text-tiny">Integer aliquam eros nec sollicitudin
                                                    sollicitudin</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="message-item item-4">
                                            <div className="image">
                                                <i className="icon-noti-4" />
                                            </div>
                                            <div>
                                                <div className="body-title-2">Order pending: <span>ID 305830</span>
                                                </div>
                                                <div className="text-tiny">Ultricies at rhoncus at ullamcorper</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li><Link href="#" className="tf-button w-full">View all</Link></li>
                                </Menu.Items>
                            </Menu>
                        </div>
                        <FullScreenButton />
                        <div className="popup-wrap apps type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <i className="icon-grid" />
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0" aria-labelledby="dropdownMenuButton4">
                                    <li>
                                        <h6>Related apps</h6>
                                    </li>
                                    <li>
                                        <ul className="list-apps">
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-1.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Photoshop</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-2.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">illustrator</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-3.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Sheets</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-4.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Gmail</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-5.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Messenger</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-6.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Youtube</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-7.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Flaticon</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-8.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">Instagram</div>
                                                </Link>
                                            </li>
                                            <li className="item">
                                                <div className="image">
                                                    <img src="/images/apps/item-9.png" alt="" />
                                                </div>
                                                <Link href="#">
                                                    <div className="text-tiny">PDF</div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li><Link href="#" className="tf-button w-full">View all app</Link></li>
                                </Menu.Items>
                            </Menu>
                        </div>
                        <div className="popup-wrap user type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="header-user wg-user">
                                        <span className="image">
                                            <img src="/images/avatar/user-1.png" alt="" />
                                        </span>
                                        <span className="flex flex-column">
                                            <span className="body-title mb-2">Kristin Watson</span>
                                            <span className="text-tiny">Admin</span>
                                        </span>
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0" aria-labelledby="dropdownMenuButton3">
                                    <li>
                                        <Link href="#" className="user-item">
                                            <div className="icon">
                                                <i className="icon-user" />
                                            </div>
                                            <div className="body-title-2">Account</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="user-item">
                                            <div className="icon">
                                                <i className="icon-mail" />
                                            </div>
                                            <div className="body-title-2">Inbox</div>
                                            <div className="number">27</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="user-item">
                                            <div className="icon">
                                                <i className="icon-file-text" />
                                            </div>
                                            <div className="body-title-2">Taskboard</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/setting" className="user-item">
                                            <div className="icon">
                                                <i className="icon-settings" />
                                            </div>
                                            <div className="body-title-2">Setting</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="user-item">
                                            <div className="icon">
                                                <i className="icon-headphones" />
                                            </div>
                                            <div className="body-title-2">Support</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="user-item">
                                            <div className="icon">
                                                <i className="icon-log-out" />
                                            </div>
                                            <div className="body-title-2">Log out</div>
                                        </Link>
                                    </li>
                                </Menu.Items>
                            </Menu>
                        </div>
                        <div className="divider" />

                        <div className="setting cursor-pointer" onClick={handleOffcanvas}><i className="icon-settings" /></div>

                    </div>
                </div>
            </div>

        </>
    )
}
