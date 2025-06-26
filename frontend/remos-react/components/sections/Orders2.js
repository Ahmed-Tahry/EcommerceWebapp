
import Link from "next/link"
import DotDropdown from "../elements/DotDropdown"

export default function Orders2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Orders</h5>
                        <DotDropdown />
                </div>
                <div className="wg-table table-orders-1">
                    <ul className="table-title flex gap10 mb-14">
                        <li>
                            <div className="body-title">Product</div>
                        </li>
                        <li>
                            <div className="body-title">Customer</div>
                        </li>
                        <li>
                            <div className="body-title">Price</div>
                        </li>
                        <li>
                            <div className="body-title">Delivery date</div>
                        </li>
                    </ul>
                    <div className="divider mb-14" />
                    <ul className="flex flex-column gap18">
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/21.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Sojos Crunchy
                                        Natural Grain Free...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/22.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Kristin
                                        Watson</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/23.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Mega Pumpkin
                                        Bone</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/24.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Cloud Star
                                        Dynamo Dog Hip &amp; Joint...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/25.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">What to Give a
                                        Constipated Dog?</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/24.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Cloud Star
                                        Dynamo Dog Hip &amp; Joint...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
