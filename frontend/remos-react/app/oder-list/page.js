
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function OderList() {

    return (
        <>

            <Layout breadcrumbTitleParent="Order" breadcrumbTitle="Order List">
                <div className="wg-box">
                    <div className="flex items-center justify-between gap10 flex-wrap">
                        <div className="wg-filter flex-grow">
                            <form className="form-search">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <Link className="tf-button style-1 w208" href="/oder-detail"><i className="icon-file-text" />Export all order</Link>
                    </div>
                    <div className="wg-table table-all-category">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <div className="body-title">Product</div>
                            </li>
                            <li>
                                <div className="body-title">Order ID</div>
                            </li>
                            <li>
                                <div className="body-title">Price</div>
                            </li>
                            <li>
                                <div className="body-title">Quantity</div>
                            </li>
                            <li>
                                <div className="body-title">Payment</div>
                            </li>
                            <li>
                                <div className="body-title">Status</div>
                            </li>
                            <li>
                                <div className="body-title">Tracking</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/51.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/52.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-pending">Pending</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/53.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/54.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/55.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Cancel</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/56.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Cancel</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/57.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/58.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/59.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/60.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Kristin Watson</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-available">Success</div>
                                    </div>
                                    <div>
                                        <div className="block-tracking">Tracking</div>
                                    </div>
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
                            </li>
                        </ul>
                    </div>
                    <div className="divider" />
                    <div className="flex items-center justify-between flex-wrap gap10">
                        <div className="text-tiny">Showing 10 entries</div>
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
                </div>

            </Layout>
        </>
    )
}