
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function AllUser() {

    return (
        <>

            <Layout breadcrumbTitleParent="User" breadcrumbTitle="All User">
                <div className="wg-box">
                    <div className="flex items-center justify-between gap10 flex-wrap">
                        <div className="wg-filter flex-grow">
                            <form className="form-search">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <Link className="tf-button style-1 w208" href="/add-new-user"><i className="icon-plus" />Add new</Link>
                    </div>
                    <div className="wg-table table-all-user">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <div className="body-title">User</div>
                            </li>
                            <li>
                                <div className="body-title">Phone</div>
                            </li>
                            <li>
                                <div className="body-title">Email</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-6.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-7.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-8.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-9.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-10.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-11.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-12.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-13.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-14.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="user-item gap14">
                                <div className="image">
                                    <img src="/images/avatar/user-15.png" alt="" />
                                </div>
                                <div className="flex items-center justify-between gap20 flex-grow">
                                    <div className="name">
                                        <Link href="#" className="body-title-2">Kristin Watson</Link>
                                        <div className="text-tiny mt-3">Product name</div>
                                    </div>
                                    <div className="body-text">$1,452.500</div>
                                    <div className="body-text">1,638</div>
                                    <div className="list-icon-function">
                                        <div className="item eye">
                                            <i className="icon-eye" />
                                        </div>
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="divider" />
                    <div className="flex items-center justify-between flex-wrap gap10">
                        <div className="text-tiny">Showing 10 entries</div>
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

            </Layout>
        </>
    )
}