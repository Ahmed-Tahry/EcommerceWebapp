
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function ProductList() {

    return (
        <>

            <Layout breadcrumbTitleParent="Ecommerce" breadcrumbTitle="Product List">
                <div className="wg-box">
                    <div className="title-box">
                        <i className="icon-coffee" />
                        <div className="body-text">Tip search by Product ID: Each product is provided with a unique ID, which you can rely on to find the exact product you need.</div>
                    </div>
                    <div className="flex items-center justify-between gap10 flex-wrap">
                        <div className="wg-filter flex-grow">
                            <div className="show">
                                <div className="text-tiny">Showing</div>
                                <div className="select">
                                    <select className>
                                        <option>10</option>
                                        <option>20</option>
                                        <option>30</option>
                                    </select>
                                </div>
                                <div className="text-tiny">entries</div>
                            </div>
                            <form className="form-search">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <Link className="tf-button style-1 w208" href="/add-product"><i className="icon-plus" />Add new</Link>
                    </div>
                    <div className="wg-table table-product-list">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <div className="body-title">Product</div>
                            </li>
                            <li>
                                <div className="body-title">Product ID</div>
                            </li>
                            <li>
                                <div className="body-title">Price</div>
                            </li>
                            <li>
                                <div className="body-title">Quantity</div>
                            </li>
                            <li>
                                <div className="body-title">Sale</div>
                            </li>
                            <li>
                                <div className="body-title">Stock</div>
                            </li>
                            <li>
                                <div className="body-title">Start date</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="product-item gap14">
                                <div className="image no-bg">
                                    <img src="/images/products/41.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Dog Food, Chicken &amp; Chicken Liver Recipe...</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/42.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Grain Free Dry Dog Food | Rachael Ray® Nutrish®</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/43.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Weruva Pumpkin Patch Up! Pumpkin With Ginger...</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/44.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Milk-Bone Mini's Flavor Snacks Dog Treats, 15 Ounce </Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/45.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Milk-Bone Mini's Flavor Snacks Dog Treats, 15 Ounce </Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/46.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="/product-list" className="body-title-2">Weruva Pumpkin Patch Up! Dog &amp; Cat Food...</Link>
                                    </div>
                                    <div className="body-text">#7712309</div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="body-text">20</div>
                                    <div>
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/47.png" alt="" />
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
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/48.png" alt="" />
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
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/49.png" alt="" />
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
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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
                                    <img src="/images/products/50.png" alt="" />
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
                                        <div className="block-not-available">Out of stock</div>
                                    </div>
                                    <div className="body-text">$28,672.36</div>
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