
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function ProductOverview1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Product overview</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-product-overview">
                    <ul className="table-title flex gap20 mb-14">
                        <li>
                            <div className="body-title">Name</div>
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
                            <div className="body-title">Revenue</div>
                        </li>
                        <li>
                            <div className="body-title">Status</div>
                        </li>
                    </ul>
                    <ul className="flex flex-column gap10">
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/6.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Soft Fluffy
                                        Cats</Link>
                                </div>
                                <div className="body-text">#327</div>
                                <div className="body-text">$11.70</div>
                                <div className="body-text">28</div>
                                <div className="body-text">On sale</div>
                                <div className="body-text">$328.85</div>
                                <div className="block-not-available">Not Available</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/7.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Taste of the
                                        Wild Formula Finder</Link>
                                </div>
                                <div className="body-text">#380</div>
                                <div className="body-text">$8.99</div>
                                <div className="body-text">10</div>
                                <div className="body-text">On sale</div>
                                <div className="body-text">$105.55</div>
                                <div className="block-not-available">Not Available</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/8.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Wellness
                                        Natural Food</Link>
                                </div>
                                <div className="body-text">#126</div>
                                <div className="body-text">$5.22</div>
                                <div className="body-text">578</div>
                                <div className="body-text">--/--</div>
                                <div className="body-text">$202.87</div>
                                <div className="block-not-available">Not Available</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/9.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Dog Food
                                        Rachael Ray</Link>
                                </div>
                                <div className="body-text">#582</div>
                                <div className="body-text">$14.81</div>
                                <div className="body-text">36</div>
                                <div className="body-text">--/--</div>
                                <div className="body-text">$475.22</div>
                                <div>
                                    <div className="block-available">Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/10.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Best Buddy
                                        Bits Dog Treats</Link>
                                </div>
                                <div className="body-text">#293</div>
                                <div className="body-text">$6.48</div>
                                <div className="body-text">84</div>
                                <div className="body-text">--/--</div>
                                <div className="body-text">$219.78</div>
                                <div className="block-not-available">Not Available</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="divider" />
                <div className="flex items-center justify-between flex-wrap gap10">
                    <div className="text-tiny">Showing 5 entries</div>
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
        </>
    )
}
