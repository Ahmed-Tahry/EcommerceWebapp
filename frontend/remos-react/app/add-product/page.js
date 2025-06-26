
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function AddProduct() {

    return (
        <>

            <Layout breadcrumbTitleParent="Ecommerce" breadcrumbTitle="Add product">
                <form className="tf-section-2 form-add-product">
                    <div className="wg-box">
                        <fieldset className="name">
                            <div className="body-title mb-10">Product name <span className="tf-color-1">*</span></div>
                            <input className="mb-10" type="text" placeholder="Enter product name" name="text" tabIndex={0} aria-required="true" required />
                            <div className="text-tiny">Do not exceed 20 characters when entering the product name.</div>
                        </fieldset>
                        <div className="gap22 cols">
                            <fieldset className="category">
                                <div className="body-title mb-10">Category <span className="tf-color-1">*</span></div>
                                <div className="select">
                                    <select className>
                                        <option>Choose category</option>
                                        <option>Shop</option>
                                        <option>Product</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="male">
                                <div className="body-title mb-10">Gender <span className="tf-color-1">*</span></div>
                                <div className="select">
                                    <select className>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                        <fieldset className="brand">
                            <div className="body-title mb-10">Brand <span className="tf-color-1">*</span></div>
                            <div className="select">
                                <select className>
                                    <option>Choose category</option>
                                    <option>Shop</option>
                                    <option>Product</option>
                                </select>
                            </div>
                        </fieldset>
                        <fieldset className="description">
                            <div className="body-title mb-10">Description <span className="tf-color-1">*</span></div>
                            <textarea className="mb-10" name="description" placeholder="Description" tabIndex={0} aria-required="true" required />
                            <div className="text-tiny">Do not exceed 100 characters when entering the product name.</div>
                        </fieldset>
                    </div>
                    <div className="wg-box">
                        <fieldset>
                            <div className="body-title mb-10">Upload images</div>
                            <div className="upload-image mb-16">
                                <div className="item">
                                    <img src="/images/upload/upload-1.png" alt="" />
                                </div>
                                <div className="item">
                                    <img src="/images/upload/upload-2.png" alt="" />
                                </div>
                                <div className="item up-load">
                                    <label className="uploadfile" htmlFor="myFile">
                                        <span className="icon">
                                            <i className="icon-upload-cloud" />
                                        </span>
                                        <span className="text-tiny">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                        <input type="file" id="myFile" name="filename" />
                                    </label>
                                </div>
                            </div>
                            <div className="body-text">You need to add at least 4 images. Pay attention to the quality of the pictures you add, comply with the background color standards. Pictures must be in certain dimensions. Notice that the product shows all the details</div>
                        </fieldset>
                        <div className="cols gap22">
                            <fieldset className="name">
                                <div className="body-title mb-10">Add size</div>
                                <div className="select mb-10">
                                    <select className>
                                        <option>EU - 44</option>
                                        <option>EU - 40</option>
                                        <option>EU - 50</option>
                                    </select>
                                </div>
                                <div className="list-box-value mb-10">
                                    <div className="box-value-item"><div className="body-text">EU - 38.5</div></div>
                                    <div className="box-value-item"><div className="body-text">EU - 39</div></div>
                                    <div className="box-value-item"><div className="body-text">EU - 40</div></div>
                                </div>
                                <div className="list-box-value">
                                    <div className="box-value-item"><div className="body-text">EU - 41.5</div></div>
                                    <div className="box-value-item"><div className="body-text">EU - 42</div></div>
                                    <div className="box-value-item"><div className="body-text">EU - 43</div></div>
                                </div>
                            </fieldset>
                            <fieldset className="name">
                                <div className="body-title mb-10">Product date</div>
                                <div className="select">
                                    <input type="date" name="date" />
                                </div>
                            </fieldset>
                        </div>
                        <div className="cols gap10">
                            <button className="tf-button w-full" type="submit">Add product</button>
                            <button className="tf-button style-1 w-full" type="submit">Save product</button>
                            <Link href="#" className="tf-button style-2 w-full">Schedule</Link>
                        </div>
                    </div>
                </form>

            </Layout>
        </>
    )
}