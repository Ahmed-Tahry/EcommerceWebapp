'use client'
import Layout from "@/components/layout/Layout"
import { Menu } from '@headlessui/react'
import Link from "next/link"
import { useState } from "react"
export default function NewPage() {
    const [isTab1, setIsTab1] = useState(1)
    const handleTab1 = (i) => {
        setIsTab1(i)
    }
    return (
        <>

            <Layout breadcrumbTitleParent="Page" breadcrumbTitle="New Page">
                <form className="form-new-page">
                    <div className="new-page-wrap">
                        <div className="left">
                            <div className="wg-box">
                                <div className="widget-tabs">
                                    <ul className="widget-menu-tab">
                                        <li className={isTab1 === 1 ? "item-title active" : "item-title"} onClick={() => handleTab1(1)}>
                                            <span className="inner"><span className="h6">Detail</span></span>
                                        </li>
                                        <li className={isTab1 === 2 ? "item-title active" : "item-title"} onClick={() => handleTab1(2)}>
                                            <span className="inner"><span className="h6">Revision history</span></span>
                                        </li>
                                    </ul>
                                    <div className="widget-content-tab">
                                        <div className="widget-content-inner active" style={{ display: `${isTab1 === 1 ? "block" : "none"}` }}>
                                            <fieldset className="name mb-24">
                                                <div className="body-title mb-10">Name <span className="tf-color-1">*</span></div>
                                                <input type="text" placeholder="Name" name="text" tabIndex={0} aria-required="true" required />
                                            </fieldset>
                                            <fieldset className="description mb-24">
                                                <div className="body-title mb-10">Description <span className="tf-color-1">*</span></div>
                                                <textarea name="description" placeholder="Description" tabIndex={0} aria-required="true" required />
                                            </fieldset>
                                            <fieldset className="content">
                                                <div className="body-title mb-10">Content</div>
                                                <textarea className="textarea-tinymce" name="area" />
                                            </fieldset>
                                        </div>
                                        <div className="widget-content-inner"style={{ display: `${isTab1  === 2 ? "block" : "none"}` }}>
                                            <div className="wg-table table-revision-history">
                                                <ul className="table-title flex gap20 mb-24">
                                                    <li>
                                                        <div className="body-title">Author</div>
                                                    </li>
                                                    <li>
                                                        <div className="body-title">Column</div>
                                                    </li>
                                                    <li>
                                                        <div className="body-title">Origin</div>
                                                    </li>
                                                    <li>
                                                        <div className="body-title">After changes</div>
                                                    </li>
                                                    <li>
                                                        <div className="body-title">Created at</div>
                                                    </li>
                                                </ul>
                                                <ul className="flex flex-column items-center justify-center">
                                                    <li className="image mb-10">
                                                        <img src="/images/item-background/history.png" alt="" />
                                                    </li>
                                                    <li className="mb-2 h6">No record</li>
                                                    <li className="body-text">This is the original and unedited article</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="wg-box">
                                <div className="flex gap10 items-center justify-between">
                                    <div className="body-title">Search engine optimize</div>
                                    <Menu as="div" className="dropdown default style-box">
                                        <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <a className="view-all w-max">
                                                <div className="body-text tf-color">Edit SEO meta</div>
                                                <i className="icon-chevron-down" />
                                            </a>
                                        </Menu.Button>
                                        <Menu.Items as='ul' className="dropdown-menu d-block">
                                            <li>
                                                <Link href="#">Edit SEO meta</Link>
                                            </li>
                                            <li>
                                                <Link href="#">Edit SEO meta</Link>
                                            </li>
                                        </Menu.Items>
                                    </Menu>
                                </div>
                                <div className="divider" />
                                <div>
                                    <h6 className="mb-10">Lorem ipsum dolor sit amet</h6>
                                    <div className="mb-2">
                                        <Link className="body-text tf-color" href="/https://themeforest.net/user/themesflat">https://themeforest.net/user/themesflat</Link>
                                    </div>
                                    <div className="body-text">20 Nov 2023</div>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="wg-box">
                                <div>
                                    <div className="body-title mb-10">Publish</div>
                                    <div className="flex gap10">
                                        <button className="tf-button style-1 w-full" type="submit">View</button>
                                        <button className="tf-button w-full" type="submit">Publish</button>
                                    </div>
                                </div>
                            </div>
                            <div className="wg-box">
                                <div>
                                    <div className="body-title mb-10">Status</div>
                                    <div className="select">
                                        <select className>
                                            <option>Published</option>
                                            <option>Wating</option>
                                            <option>Finish</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="wg-box">
                                <div>
                                    <div className="body-title mb-10">Template</div>
                                    <div className="select">
                                        <select className>
                                            <option>Default</option>
                                            <option>Wating</option>
                                            <option>Finish</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="wg-box">
                                <div>
                                    <div className="body-title mb-10">Gallery</div>
                                    <div className="upload-image style-1 mb-16">
                                        <div className="item">
                                            <img src="/images/images-section/gallery-1.png" alt="" />
                                        </div>
                                        <div className="item">
                                            <img src="/images/images-section/gallery-2.png" alt="" />
                                        </div>
                                        <div className="item">
                                            <img src="/images/images-section/gallery-3.png" alt="" />
                                        </div>
                                        <div className="item">
                                            <img src="/images/images-section/gallery-4.png" alt="" />
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
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </Layout>
        </>
    )
}