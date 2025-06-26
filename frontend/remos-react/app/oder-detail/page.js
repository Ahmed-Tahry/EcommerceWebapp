'use client'
import Layout from "@/components/layout/Layout"
import { Menu } from '@headlessui/react'
import Link from "next/link"
export default function OderDetail() {

    return (
        <>

            <Layout breadcrumbTitleParent="Order" breadcrumbTitle="Order detail">
                <div className="wg-order-detail">
                    <div className="left flex-grow">
                        <div className="wg-box mb-20">
                            <div className="wg-table table-order-detail">
                                <ul className="table-title flex items-center justify-between gap20 mb-24">
                                    <li>
                                        <div className="body-title">All item</div>
                                    </li>
                                    <li>
                                        <Menu as="div" className="dropdown default">
                                            <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span className="body-title-2 flex items-center gap8">Sort<i className="h6 icon-chevron-down" /></span>
                                            </Menu.Button>
                                            <Menu.Items as="ul" className="dropdown-menu d-block">
                                                <li>
                                                    <a>Name</a>
                                                </li>
                                                <li>
                                                    <a>Quantity</a>
                                                </li>
                                                <li>
                                                    <a>Price</a>
                                                </li>
                                            </Menu.Items>
                                        </Menu>
                                    </li>
                                </ul>
                                <ul className="flex flex-column">
                                    <li className="product-item gap14">
                                        <div className="image no-bg">
                                            <img src="/images/products/41.png" alt="" />
                                        </div>
                                        <div className="flex items-center justify-between gap40 flex-grow">
                                            <div className="name">
                                                <div className="text-tiny mb-1">Product name</div>
                                                <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Quantity</div>
                                                <div className="body-title-2">1</div>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Price</div>
                                                <div className="body-title-2">$50.47</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="product-item gap14">
                                        <div className="image no-bg">
                                            <img src="/images/products/44.png" alt="" />
                                        </div>
                                        <div className="flex items-center justify-between gap40 flex-grow">
                                            <div className="name">
                                                <div className="text-tiny mb-1">Product name</div>
                                                <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Quantity</div>
                                                <div className="body-title-2">1</div>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Price</div>
                                                <div className="body-title-2">$50.47</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="product-item gap14">
                                        <div className="image no-bg">
                                            <img src="/images/products/43.png" alt="" />
                                        </div>
                                        <div className="flex items-center justify-between gap40 flex-grow">
                                            <div className="name">
                                                <div className="text-tiny mb-1">Product name</div>
                                                <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Quantity</div>
                                                <div className="body-title-2">1</div>
                                            </div>
                                            <div className="name">
                                                <div className="text-tiny mb-1">Price</div>
                                                <div className="body-title-2">$50.47</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="wg-box">
                            <div className="wg-table table-cart-totals">
                                <ul className="table-title flex mb-24">
                                    <li>
                                        <div className="body-title">Cart Totals</div>
                                    </li>
                                    <li>
                                        <div className="body-title">Price</div>
                                    </li>
                                </ul>
                                <ul className="flex flex-column gap14">
                                    <li className="cart-totals-item">
                                        <span className="body-text">Subtotal:</span>
                                        <span className="body-title-2">$70.13</span>
                                    </li>
                                    <li className="divider" />
                                    <li className="cart-totals-item">
                                        <span className="body-text">Shipping:</span>
                                        <span className="body-title-2">$10.00</span>
                                    </li>
                                    <li className="divider" />
                                    <li className="cart-totals-item">
                                        <span className="body-text">Tax (GST):</span>
                                        <span className="body-title-2">$5.00</span>
                                    </li>
                                    <li className="divider" />
                                    <li className="cart-totals-item">
                                        <span className="body-title">Total price:</span>
                                        <span className="body-title tf-color-1">$90.58</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="wg-box mb-20 gap10">
                            <div className="body-title">Summary</div>
                            <div className="summary-item">
                                <div className="body-text">Order ID</div>
                                <div className="body-title-2">#192847</div>
                            </div>
                            <div className="summary-item">
                                <div className="body-text">Date</div>
                                <div className="body-title-2">20 Nov 2023</div>
                            </div>
                            <div className="summary-item">
                                <div className="body-text">Total</div>
                                <div className="body-title-2 tf-color-1">$948.5</div>
                            </div>
                        </div>
                        <div className="wg-box mb-20 gap10">
                            <div className="body-title">Shipping Address</div>
                            <div className="body-text">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                        </div>
                        <div className="wg-box mb-20 gap10">
                            <div className="body-title">Payment Method</div>
                            <div className="body-text">Pay on Delivery (Cash/Card). Cash on delivery (COD) available. Card/Net banking acceptance subject to device availability.</div>
                        </div>
                        <div className="wg-box gap10">
                            <div className="body-title">Expected Date Of Delivery</div>
                            <div className="body-title-2 tf-color-2">20 Nov 2023</div>
                            <Link className="tf-button style-1 w-full" href="/oder-tracking"><i className="icon-truck" />Track order</Link>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}