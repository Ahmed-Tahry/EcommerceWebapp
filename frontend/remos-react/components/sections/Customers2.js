
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function Customers2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Top Customers</h5>
                    <ViewAllDropdown />
                </div>
                <div className="wg-table">
                    <ul className="table-title flex justify-between gap20 mb-14">
                        <li>
                            <div className="body-title">Name</div>
                        </li>
                        <li>
                            <div className="body-title">Total money</div>
                        </li>
                    </ul>
                    <ul className="flex flex-column gap18">
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/avatar/user-1.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="tf-color-3 body-text name">Devon Lane</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text tf-color-3">$8.99</div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/avatar/user-2.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="tf-color-3 body-text name">Jenny
                                        Wilson</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text tf-color-3">$6.48</div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/avatar/user-3.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="tf-color-3 body-text name">Eleanor
                                        Pena</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text tf-color-3">$14.81</div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/avatar/user-4.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="tf-color-3 body-text name">Albert
                                        Flores</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text tf-color-3">$5.22</div>
                            </div>
                        </li>
                        <li className="shop-item">
                            <div className="image">
                                <img src="/images/avatar/user-5.png" alt="" />
                            </div>
                            <div className="flex-grow flex items-center justify-between gap20">
                                <div>
                                    <Link href="#" className="tf-color-3 body-text name">Ronald
                                        Richards</Link>
                                    <div className="text-tiny mt-4">73 Purchases</div>
                                </div>
                                <div className="body-text tf-color-3">$17.84</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
