
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function Orders3() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Recent orders</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-product-overview t2">
                    <ul className="table-title flex gap20 mb-14">
                        <li>
                            <div className="body-title">Product</div>
                        </li>
                        <li>
                            <div className="body-title">Customer</div>
                        </li>
                        <li>
                            <div className="body-title">Product ID</div>
                        </li>
                        <li>
                            <div className="body-title">Quantity</div>
                        </li>
                        <li>
                            <div className="body-title">Price</div>
                        </li>
                        <li>
                            <div className="body-title">Status</div>
                        </li>
                    </ul>
                    <div className="divider mb-14" />
                    <ul className="flex flex-column gap10">
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/31.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Taste of
                                        the Wild Formula Finder</Link>
                                </div>
                                <div className="body-text">2,672</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">Delivered</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/32.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Proden
                                        Plaqueoff Dental Bites Dog, 150 G</Link>
                                </div>
                                <div className="body-text">2,672</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">X2</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">Delivered</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/33.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Zuke's Lil'
                                        Links Healthy Little Sausage Links for Dogs...</Link>
                                </div>
                                <div className="body-text">2,672</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">X1</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">Delivered</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/34.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Rachael Ray
                                        Nutrish Grain Free Chicken Drumstick...</Link>
                                </div>
                                <div className="body-text">2,672</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">X3</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">Delivered</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/35.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap20">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Fruitables
                                        Dog Treats Sweet Potato &amp; Pecan Flavor</Link>
                                </div>
                                <div className="body-text">2,672</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">X2</div>
                                <div className="body-text">$28,672.36</div>
                                <div>
                                    <div className="block-available">Delivered</div>
                                </div>
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
