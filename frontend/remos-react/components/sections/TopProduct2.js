
import Link from "next/link"
import DotDropdown from "../elements/DotDropdown"

export default function TopProduct2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Top product</h5>
                        <DotDropdown />
                </div>
                <div className="wg-table table-top-product-1">
                    <ul className="table-title flex gap10 mb-14">
                        <li>
                            <div className="body-title">Product</div>
                        </li>
                        <li>
                            <div className="body-title">Review</div>
                        </li>
                        <li>
                            <div className="body-title">Sold</div>
                        </li>
                        <li>
                            <div className="body-title">Profit</div>
                        </li>
                    </ul>
                    <ul className="flex flex-column gap18">
                        <li className="product-item">
                            <div className="image small no-bg">
                                <img src="/images/products/36.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Prodotti per
                                        il tuo cane...</Link>
                                </div>
                                <div>
                                    <div className="rating-number">
                                        <div className="icon">
                                            <i className="icon-star1" />
                                        </div>
                                        <div className="number body-text">4.7</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="body-text">120</div>
                                </div>
                                <div>
                                    <div className="body-text">$16.960</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image small no-bg">
                                <img src="/images/products/37.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Wholesome
                                        Pride...</Link>
                                </div>
                                <div>
                                    <div className="rating-number">
                                        <div className="icon">
                                            <i className="icon-star1" />
                                        </div>
                                        <div className="number body-text">4.7</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="body-text">120</div>
                                </div>
                                <div>
                                    <div className="body-text">$16.960</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image small no-bg">
                                <img src="/images/products/38.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Beneful Baked
                                        Delights...</Link>
                                </div>
                                <div>
                                    <div className="rating-number">
                                        <div className="icon">
                                            <i className="icon-star1" />
                                        </div>
                                        <div className="number body-text">4.7</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="body-text">120</div>
                                </div>
                                <div>
                                    <div className="body-text">$16.960</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image small no-bg">
                                <img src="/images/products/39.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Taste of the
                                        Wild...</Link>
                                </div>
                                <div>
                                    <div className="rating-number">
                                        <div className="icon">
                                            <i className="icon-star1" />
                                        </div>
                                        <div className="number body-text">4.7</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="body-text">120</div>
                                </div>
                                <div>
                                    <div className="body-text">$16.960</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image small no-bg">
                                <img src="/images/products/40.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Canagan -
                                        Britain's...</Link>
                                </div>
                                <div>
                                    <div className="rating-number">
                                        <div className="icon">
                                            <i className="icon-star1" />
                                        </div>
                                        <div className="number body-text">4.7</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="body-text">120</div>
                                </div>
                                <div>
                                    <div className="body-text">$16.960</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
