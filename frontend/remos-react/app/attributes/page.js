
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Attributes() {

    return (
        <>

            <Layout breadcrumbTitleParent="Attributes" breadcrumbTitle="All attributes">
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
                            <form className="form-search">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <Link className="tf-button style-1 w208" href="/add-attributes"><i className="icon-plus" />Add new</Link>
                    </div>
                    <div className="wg-table table-all-attribute">
                        <ul className="table-title flex gap20 mb-14">
                            <li>
                                <div className="body-title">Category</div>
                            </li>
                            <li>
                                <div className="body-title">Value</div>
                            </li>
                            <li>
                                <div className="body-title">Action</div>
                            </li>
                        </ul>
                        <ul className="flex flex-column">
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Color</Link>
                                </div>
                                <div className="body-text">Blue, green, white</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Size</Link>
                                </div>
                                <div className="body-text">S, M, L, XL</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Material</Link>
                                </div>
                                <div className="body-text">Cotton, Polyster</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Style</Link>
                                </div>
                                <div className="body-text">Classic, mordern, ethnic, western</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Meat Type</Link>
                                </div>
                                <div className="body-text">Fresh, Frozen, Marinated</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Weight</Link>
                                </div>
                                <div className="body-text">1kg, 2kg, 3kg, over 5kg</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Packaging</Link>
                                </div>
                                <div className="body-text">Plastic box, paper, nylon, tin cans</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Kind of food</Link>
                                </div>
                                <div className="body-text">Dried food, wet food, supplementary food</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Milk</Link>
                                </div>
                                <div className="body-text">Formula milk, fresh milk</div>
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
                            </li>
                            <li className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link href="/add-attributes" className="body-title-2">Combo</Link>
                                </div>
                                <div className="body-text">Cat food, dog food</div>
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