
import Layout from "@/components/layout/Layout"
export default function CreateRole() {

    return (
        <>

            <Layout breadcrumbTitleParent="Roles" breadcrumbTitle="Create role">
                <form className="form-create-role">
                    <div className="wg-box mb-24">
                        <fieldset className="name">
                            <div className="body-title mb-10">Name</div>
                            <input className="flex-grow" type="text" placeholder="Username" name="name" tabIndex={0} aria-required="true" required />
                        </fieldset>
                        <div className="wg-table table-create-role">
                            <ul className="table-title flex gap20 mb-14">
                                <li>
                                    <div className="body-title">Permissions</div>
                                </li>
                            </ul>
                            <ul className="flex flex-column">
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Roles</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Users</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Product</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Category</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Attributes</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Order</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Location</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Coupon</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Tax</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Product review</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Support ticket</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                                <li className="item gap20 wrap-checkbox">
                                    <div className="body-text">Report</div>
                                    <div className="flex items-center gap10">
                                        <input className="total-checkbox" type="checkbox" />
                                        <label className><div className="body-text">All</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Index</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Create</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Edit</div></label>
                                    </div>
                                    <div className="flex items-center gap10">
                                        <input className="checkbox-item" type="checkbox" />
                                        <label className><div className="body-text">Delete</div></label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bot">
                        <button className="tf-button w180" type="submit">Save</button>
                    </div>
                </form>

            </Layout>
        </>
    )
}