
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function Product() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Top Products</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-top-product">
                    <ul className="flex flex-column gap14">
                        <li className="product-item">
                            <div className="image">
                                <img src="/images/products/1.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Patimax
                                        Fragrance Long...</Link>
                                    <div className="text-tiny mt-3">100 Items</div>
                                </div>
                                <div>
                                    <div className="text-tiny mb-3">Coupon Code</div>
                                    <div className="body-text">Sflat</div>
                                </div>
                                <div className="country">
                                    <img src="/images/country/2.png" alt="" />
                                </div>
                                <div>
                                    <div className="body-title-2 mb-3">-15%</div>
                                    <div className="text-tiny">$27.00</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image">
                                <img src="/images/products/2.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Nulo
                                        MedalSeries Adult Cat...</Link>
                                    <div className="text-tiny mt-3">100 Items</div>
                                </div>
                                <div>
                                    <div className="text-tiny mb-3">Coupon Code</div>
                                    <div className="body-text">Sflat</div>
                                </div>
                                <div className="country">
                                    <img src="/images/country/3.png" alt="" />
                                </div>
                                <div>
                                    <div className="body-title-2 mb-3">-15%</div>
                                    <div className="text-tiny">$27.00</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image">
                                <img src="/images/products/3.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Pedigree Puppy Dry Dog...</Link>
                                    <div className="text-tiny mt-3">100 Items</div>
                                </div>
                                <div>
                                    <div className="text-tiny mb-3">Coupon Code</div>
                                    <div className="body-text">Sflat</div>
                                </div>
                                <div className="country">
                                    <img src="/images/country/1.png" alt="" />
                                </div>
                                <div>
                                    <div className="body-title-2 mb-3">-15%</div>
                                    <div className="text-tiny">$27.00</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image">
                                <img src="/images/products/4.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2">Biscoito Premier Cookie...</Link>
                                    <div className="text-tiny mt-3">100 Items</div>
                                </div>
                                <div>
                                    <div className="text-tiny mb-3">Coupon Code</div>
                                    <div className="body-text">Sflat</div>
                                </div>
                                <div className="country">
                                    <img src="/images/country/4.png" alt="" />
                                </div>
                                <div>
                                    <div className="body-title-2 mb-3">-15%</div>
                                    <div className="text-tiny">$27.00</div>
                                </div>
                            </div>
                        </li>
                        <li className="product-item">
                            <div className="image">
                                <img src="/images/products/5.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-title-2 mb-3">Pedigree Adult Dry
                                        Dog...</Link>
                                    <div className="text-tiny">100 Items</div>
                                </div>
                                <div>
                                    <div className="text-tiny mb-3">Coupon Code</div>
                                    <div className="body-text">Sflat</div>
                                </div>
                                <div className="country">
                                    <img src="/images/country/5.png" alt="" />
                                </div>
                                <div>
                                    <div className="body-title-2 mb-3">-15%</div>
                                    <div className="text-tiny">$27.00</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
