
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function ListPage() {

    return (
        <>

            <Layout breadcrumbTitleParent="Page" breadcrumbTitle="List Page">
                <div className="wg-box">
                    <div className="flex items-center justify-between gap10 flex-wrap">
                        <div className="wg-filter flex-grow">
                            <div className="show">
                                <div className="text-tiny">Showing</div>
                                <div className="select">
                                    <select className>
                                        <option>10</option>
                                        <option>20</option>
                                        <option>30</option>
                                    </select>
                                </div>
                                <div className="text-tiny">entries</div>
                            </div>
                            <div className="flex gap10">
                                <div className="select w200">
                                    <select className>
                                        <option>Bulk Action</option>
                                        <option>Action 1</option>
                                        <option>Action 2</option>
                                    </select>
                                </div>
                                <button className="tf-button style-1 w128">Filters</button>
                            </div>
                            <form className="form-search">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <Link className="tf-button style-1 w208" href="#"><i className="icon-plus" />New</Link>
                    </div>
                    <div className="wg-table table-countries wrap-checkbox">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <input className="total-checkbox" type="checkbox" />
                            </li>
                            <li>
                                <div className="body-title">ID</div>
                            </li>
                            <li>
                                <div className="body-title">Name</div>
                            </li>
                            <li>
                                <div className="body-title">Template</div>
                            </li>
                            <li>
                                <div className="body-title">Created at</div>
                            </li>
                            <li>
                                <div className="body-title">Status</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#01</div>
                                <div className="body-text">Home 1</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#02</div>
                                <div className="body-text">Home 2</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#03</div>
                                <div className="body-text">Home 3</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#04</div>
                                <div className="body-text">About us</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#05</div>
                                <div className="body-text">Our Services</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#06</div>
                                <div className="body-text">Contact</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#07</div>
                                <div className="body-text">News</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#08</div>
                                <div className="body-text">Product detail</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#09</div>
                                <div className="body-text">Terms &amp; Conditions</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
                                        <div className="item edit">
                                            <i className="icon-edit-3" />
                                        </div>
                                        <div className="item trash">
                                            <i className="icon-trash-2" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="countries-item">
                                <div>
                                    <input className="checkbox-item" type="checkbox" />
                                </div>
                                <div className="body-text">#10</div>
                                <div className="body-text">Cookie Policy</div>
                                <div className="body-text">Default</div>
                                <div className="body-text">20 Nov 2023</div>
                                <div>
                                    <div className="block-published">Published</div>
                                </div>
                                <div>
                                    <div className="list-icon-function">
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