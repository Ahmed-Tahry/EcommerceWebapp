
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function BestShopSellers1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Best Shop Sellers</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-best-shop-sellers">
                    <ul className="table-title flex gap20 mb-14">
                        <li>
                            <div className="body-title">Shop</div>
                        </li>
                        <li>
                            <div className="body-title">Categories</div>
                        </li>
                        <li>
                            <div className="body-title">Total</div>
                        </li>
                        <li>
                            <div className="body-title">Status</div>
                        </li>
                    </ul>
                    <ul className="flex flex-column gap18">
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/1.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Robert</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text">Kitchen, Pets</div>
                                <div className="body-text">$1,000</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar">
                                        <span data-progress={29} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/2.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Calvin</Link>
                                    <div className="text-tiny mt-4">66 Purchases</div>
                                </div>
                                <div className="body-text">Health, Grocery</div>
                                <div className="body-text">$4,000</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar t1">
                                        <span data-progress={59} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/3.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Dwight</Link>
                                    <div className="text-tiny mt-4">15,890 Purchases</div>
                                </div>
                                <div className="body-text">Electronics</div>
                                <div className="body-text">$2,700</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar t2">
                                        <span data-progress={29} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/4.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Cody</Link>
                                    <div className="text-tiny mt-4">15 Purchases</div>
                                </div>
                                <div className="body-text">Movies, Music</div>
                                <div className="body-text">$2,100</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar">
                                        <span data-progress={25} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/5.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Bruce</Link>
                                    <div className="text-tiny mt-4">127 Purchases</div>
                                </div>
                                <div className="body-text">Sports, Fitness</div>
                                <div className="body-text">$4,400</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar t3">
                                        <span data-progress={52} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/6.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Jorge</Link>
                                    <div className="text-tiny mt-4">30 Purchases</div>
                                </div>
                                <div className="body-text">Toys, Baby</div>
                                <div className="body-text">$4,750</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar t4">
                                        <span data-progress={23} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/shop/7.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="body-text name">Kristin Watson</Link>
                                    <div className="text-tiny mt-4">93 Purchases</div>
                                </div>
                                <div className="body-text">Gift Cards</div>
                                <div className="body-text">$1,000</div>
                                <div className="flex items-center justify-between gap10">
                                    <div className="progress-level-bar t5">
                                        <span data-progress={45} data-max={70} />
                                    </div>
                                    <div className="text-tiny">100%</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
