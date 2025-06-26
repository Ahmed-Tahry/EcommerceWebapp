
import Link from "next/link"
import DotDropdown from "../elements/DotDropdown"

export default function Orders1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Orders</h5>
                        <DotDropdown />
                </div>
                <div className="wg-table table-orders">
                    <ul className="table-title flex gap10 mb-14">
                        <li>
                            <div className="body-title">Product</div>
                        </li>
                        <li>
                            <div className="body-title">Price</div>
                        </li>
                        <li>
                            <div className="body-title">Delivery date</div>
                        </li>
                    </ul>
                    <ul className="flex flex-column gap18">
                        <li className="product-item gap14">
                            <div className="image small">
                                <img src="/images/products/11.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Prodotti per
                                        il tuo cane...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image small">
                                <img src="/images/products/12.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Wholesome
                                        Pride...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image small">
                                <img src="/images/products/13.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Beneful Baked
                                        Delights...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image small">
                                <img src="/images/products/14.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Taste of the
                                        Wild...</Link>
                                </div>
                                <div className="body-text">20 Nov 2023</div>
                                <div className="body-text">20 Nov 2023</div>
                            </div>
                        </li>
                        <li className="product-item gap14">
                            <div className="image small">
                                <img src="/images/products/15.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow gap10">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Canagan -
                                        Britain's...</Link>
                                </div>
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
