
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function States() {

    return (
        <>

            <Layout breadcrumbTitleParent="Location" breadcrumbTitle="States">
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
                                <div className="body-title">Country</div>
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
                                <div className="body-text">Tamra</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Taibeh</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Yokneam</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Sderot</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Yehud-Monosson</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Tel Aviv</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Yavne</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Tiberias</div>
                                <div className="body-text">Russia</div>
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
                                <div className="body-text">Tirat Carmel	</div>
                                <div className="body-text">Vietnamese</div>
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
                                <div className="body-text">Tsfat</div>
                                <div className="body-text">Vietnamese</div>
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
                    </div>
                </div>

            </Layout>
        </>
    )
}