

import Layout from "@/components/layout/Layout"
export default function NewCategory() {

    return (
        <>

            <Layout breadcrumbTitleParent="Category" breadcrumbTitle="New category">
                <div className="wg-box">
                    <form className="form-new-product form-style-1">
                        <fieldset className="name">
                            <div className="body-title">Product name <span className="tf-color-1">*</span></div>
                            <input className="flex-grow" type="text" placeholder="Category name" name="text" tabIndex={0} aria-required="true" required />
                        </fieldset>
                        <fieldset>
                            <div className="body-title">Upload images <span className="tf-color-1">*</span></div>
                            <div className="upload-image flex-grow">
                                <div className="item up-load">
                                    <label className="uploadfile" htmlFor="myFile">
                                        <span className="icon">
                                            <i className="icon-upload-cloud" />
                                        </span>
                                        <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                        <input type="file" id="myFile" name="filename" />
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="category">
                            <div className="body-title">Select category icon</div>
                            <div className="select flex-grow">
                                <select className>
                                    <option>Select icon</option>
                                    <option>icon 1</option>
                                    <option>icon 2</option>
                                </select>
                            </div>
                        </fieldset>
                        <div className="bot">
                            <div />
                            <button className="tf-button w208" type="submit">Save</button>
                        </div>
                    </form>
                </div>

            </Layout>
        </>
    )
}