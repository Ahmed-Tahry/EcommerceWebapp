
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function OderTracking() {

    return (
        <>

            <Layout breadcrumbTitleParent="Order" breadcrumbTitle="Track Order">
                <div>
                    <div className="wg-box mb-20">
                        <div className="order-track">
                            <div className="image">
                                <img src="/images/images-section/track-oder-1.png" alt="" />
                            </div>
                            <div className="content">
                                <h5 className="mb-20">Pouch Pocket Hoodie Orange</h5>
                                <div className="infor mb-10">
                                    <div className="body-text">Order ID</div>
                                    <div className="body-title-2">#192847</div>
                                </div>
                                <div className="infor mb-10">
                                    <div className="body-text">Brand:</div>
                                    <div className="body-title-2">20 Nov 2023</div>
                                </div>
                                <div className="infor mb-10">
                                    <div className="body-text">Order Placed:</div>
                                    <div className="body-title-2">20 Nov 2023</div>
                                </div>
                                <div className="infor mb-20">
                                    <div className="body-text">Quantity:</div>
                                    <div className="body-title-2">1</div>
                                </div>
                                <div className="flex gap10 flex-wrap">
                                    <Link className="tf-button style-1 w230" href="/product-list">View shop</Link>
                                    <Link className="tf-button w230" href="/product-list">View product</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /order-track */}
                    {/* detail */}
                    <div className="wg-box mb-20">
                        <div>
                            <h6 className="mb-10">Detail</h6>
                            <div className="body-text">Your items is on the way. Tracking information will be available within 24 hours.</div>
                        </div>
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
                    {/* /detail */}
                    {/* table */}
                    <div className="wg-box">
                        <div className="wg-table table-order-track">
                            <ul className="table-title flex mb-24 gap20">
                                <li>
                                    <div className="body-title">Date</div>
                                </li>
                                <li>
                                    <div className="body-title">Time</div>
                                </li>
                                <li>
                                    <div className="body-title">Description</div>
                                </li>
                                <li>
                                    <div className="body-title">Location</div>
                                </li>
                            </ul>
                            <ul className="flex flex-column gap14">
                                <li className="cart-totals-item">
                                    <div className="body-text">20 Nov 2023</div>
                                    <div className="body-text">2:30 PM</div>
                                    <div className="body-text">The sender is preparing the goods</div>
                                    <div className="body-text">2715 Ash Dr. San Jose, South Dakota 83475</div>
                                </li>
                                <li className="divider" />
                                <li className="cart-totals-item">
                                    <div className="body-text">20 Nov 2023</div>
                                    <div className="body-text">01:00 PM</div>
                                    <div className="body-text">The order has arrived at the post office</div>
                                    <div className="body-text">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                                </li>
                                <li className="divider" />
                                <li className="cart-totals-item">
                                    <div className="body-text">21 Nov 2023</div>
                                    <div className="body-text">03:58 AM</div>
                                    <div className="body-text">The carrier is picking up the goods</div>
                                    <div className="body-text">1901 Thornridge Cir. Shiloh, Hawaii 81063</div>
                                </li>
                                <li className="divider" />
                                <li className="cart-totals-item">
                                    <div className="body-text">22 Nov 2023</div>
                                    <div className="body-text">06:26 PM</div>
                                    <div className="body-text">The order has been shipped</div>
                                    <div className="body-text">4140 Parker Rd. Allentown, New Mexico 31134</div>
                                </li>
                                <li className="divider" />
                                <li className="cart-totals-item">
                                    <div className="body-text">22 Nov 2023</div>
                                    <div className="body-text">03:45 PM</div>
                                    <div className="body-text">Your order will be delivered to you in 30 minutes</div>
                                    <div className="body-text">8502 Preston Rd. Inglewood, Maine 98380</div>
                                </li>
                                <li className="divider" />
                                <li className="cart-totals-item">
                                    <div className="body-text">23 Nov 2023</div>
                                    <div className="body-text">12:21 AM</div>
                                    <div className="body-text">The order has been delivered successfully</div>
                                    <div className="body-text">3891 Ranchview Dr. Richardson, California 62639</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}