
import Link from "next/link"
import ViewAllDropdown from "../elements/ViewAllDropdown"

export default function Sales2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Top Countries By Sales</h5>
                    <ViewAllDropdown />
                </div>
                <div className="flex items-center gap10">
                    <h4>$37,802</h4>
                    <div className="box-icon-trending up">
                        <i className="icon-trending-up" />
                        <div className="body-title number">1.56%</div>
                    </div>
                    <div className="text-tiny">since last weekend</div>
                </div>
                <ul className="flex flex-column justify-between gap10 h-full">
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/6.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Turkish Flag</Link>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/7.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Belgium</Link>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/8.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Sweden</Link>
                            <div className="box-icon-trending down">
                                <i className="icon-trending-down" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/9.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Vietnamese</Link>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/10.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Australia</Link>
                            <div className="box-icon-trending down">
                                <i className="icon-trending-down" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                    <li className="country-item">
                        <div className="image">
                            <img src="/images/country/11.png" alt="" />
                        </div>
                        <div className="flex-grow flex items-center justify-between">
                            <Link href="/countries" className="body-text name">Saudi Arabia</Link>
                            <div className="box-icon-trending down">
                                <i className="icon-trending-down" />
                            </div>
                            <div className="body-text number">6,972</div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}
