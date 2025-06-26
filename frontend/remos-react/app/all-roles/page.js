
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function AllRoles() {

    return (
        <>

            <Layout breadcrumbTitleParent="Roles" breadcrumbTitle="Role List">
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
                        <Link className="tf-button style-1 w208" href="/create-roles"><i className="icon-plus" />Add role</Link>
                    </div>
                    <div className="wg-table table-all-roles">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <div className="body-title">No</div>
                            </li>
                            <li>
                                <div className="body-title">Name</div>
                            </li>
                            <li>
                                <div className="body-title">Create at</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="roles-item">
                                <div className="body-text">01</div>
                                <div className="body-text">Guy Hawkins</div>
                                <div className="body-text">May 31, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">02</div>
                                <div className="body-text">Bessie Cooper</div>
                                <div className="body-text">December 2, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">03</div>
                                <div className="body-text">Wade Warren</div>
                                <div className="body-text">February 28, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">04</div>
                                <div className="body-text">Ralph Edwards</div>
                                <div className="body-text">December 19, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">05</div>
                                <div className="body-text">Devon Lane</div>
                                <div className="body-text">December 29, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">06</div>
                                <div className="body-text">Courtney Henry</div>
                                <div className="body-text">August 24, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">07</div>
                                <div className="body-text">Savannah Nguyen</div>
                                <div className="body-text">September 24, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">08</div>
                                <div className="body-text">Jane Cooper</div>
                                <div className="body-text">November 28, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">09</div>
                                <div className="body-text">Esther Howard</div>
                                <div className="body-text">February 9, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                            <li className="roles-item">
                                <div className="body-text">10</div>
                                <div className="body-text">Cameron Williamson</div>
                                <div className="body-text">August 7, 2023</div>
                                <div className="list-icon-function">
                                    <div className="item edit">
                                        <i className="icon-edit-3" />
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2" />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="divider" />
                    <div className="flex items-center justify-between flex-wrap gap10">
                        <div className="text-tiny">Showing 10 to 16 in 16 records</div>
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