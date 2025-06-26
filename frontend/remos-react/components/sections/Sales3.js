
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function Sales3() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Product overview</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table table-product-overview t4">
                    <ul className="table-title flex gap20 mb-14">
                        <li>
                            <div className="body-title">Name</div>
                        </li>
                        <li>
                            <div className="body-title">ID</div>
                        </li>
                        <li>
                            <div className="body-title">Price</div>
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
                                <img src="/images/products/6.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between gap20 flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Dog Food,
                                        Chicken &amp; Chicken Liver Recipe...</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
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
                                <img src="/images/products/7.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between gap20 flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Grain Free Dry
                                        Dog Food | Rachael Ray® Nutrish®</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$928.41</div>
                                <div>
                                    <div className="block-not-available">Not Available</div>
                                </div>
                            </div>
                        </li>
                        <li className="divider" />
                        <li className="product-item gap14">
                            <div className="image no-bg">
                                <img src="/images/products/8.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between gap20 flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Weruva Pumpkin
                                        Patch Up! Pumpkin With Ginger...</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
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
                                <img src="/images/products/9.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between gap20 flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Milk-Bone
                                        Mini's Flavor Snacks Dog Treats, 15...</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
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
                                <img src="/images/products/10.png" alt="" />
                            </div>
                            <div className="flex items-center justify-between gap20 flex-grow">
                                <div className="name">
                                    <Link href="/product-list" className="body-text">Weruva Pumpkin
                                        Patch Up! Dog &amp; Cat Food...</Link>
                                </div>
                                <div className="body-text">#70668</div>
                                <div className="body-text">$450</div>
                                <div className="body-text">$28,672.36</div>
                                <div className="body-text">$928.41</div>
                                <div>
                                    <div className="block-not-available">Not Available</div>
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
