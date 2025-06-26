
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function ProductOverview2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Top selling product</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-top-selling-product">
                    <ul className="table-title flex gap20 mb-14">
                        <li>
                            <div className="body-title">Product</div>
                        </li>
                        <li>
                            <div className="body-title">Category</div>
                        </li>
                        <li>
                            <div className="body-title">Total sale</div>
                        </li>
                        <li>
                            <div className="body-title">Stock</div>
                        </li>
                    </ul>
                    <div className="divider mb-14" />
                    <ul className="flex flex-column gap10">
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/16.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Patimax
                                        Fragrance Long...</Link>
                                </div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-not-available">Out of stock</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/17.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">WholeHearted Grain Free
                                        Large...</Link>
                                </div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">In stock</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/18.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Dog Food
                                        Rachael Ray Nutrish®</Link>
                                </div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">In stock</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/19.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Freshpet
                                        Healthy Dog Food and Cat...</Link>
                                </div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">In stock</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image">
                                <img src="/images/products/20.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Natural Dog
                                        Food Healthy Dog Food</Link>
                                </div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-not-available">Out of stock</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
