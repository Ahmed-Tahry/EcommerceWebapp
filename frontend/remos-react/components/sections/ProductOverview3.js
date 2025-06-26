
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function ProductOverview3() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Product overview</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-product-overview t1">
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
                    <div className="divider mb-14" />
                    <ul className="flex flex-column gap10">
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/26.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Dog Food,
                                        Chicken &amp; Chicken Liver Recipe...</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
                                <div className="body-text">403</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$928.41</div>
                                <div>
                                    <div className="block-available">Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/27.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Grain Free Dry
                                        Dog Food | Rachael Ray® Nutrish®</Link>
                                </div>
                                <div className="body-text">#22739</div>
                                <div className="body-text">$450</div>
                                <div className="body-text">202</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$450.54</div>
                                <div>
                                    <div className="block-not-available">Not Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/28.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Weruva Pumpkin
                                        Patch Up! Pumpkin With Ginger...</Link>
                                </div>
                                <div className="body-text">#43178</div>
                                <div className="body-text">$420</div>
                                <div className="body-text">5032</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$293.01</div>
                                <div>
                                    <div className="block-available">Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/29.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Milk-Bone
                                        Mini's Flavor Snacks Dog Treats, 15 Ounce </Link>
                                </div>
                                <div className="body-text">#43756</div>
                                <div className="body-text">$159</div>
                                <div className="body-text">503</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$475.22</div>
                                <div>
                                    <div className="block-available">Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/30.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Weruva Pumpkin
                                        Patch Up! Dog &amp; Cat Food...</Link>
                                </div>
                                <div className="body-text">#39635</div>
                                <div className="body-text">$408</div>
                                <div className="body-text">203</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$767.50</div>
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
