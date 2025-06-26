'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from "react"
export default function Gallery() {
    const [isTab, setIsTab] = useState(1)
    const handleTab = (i) => {
        setIsTab(i)
    }
    return (
        <>

            <Layout breadcrumbTitleParent="Page" breadcrumbTitle="Gallery">
                <div className="all-gallery-wrap">
                    <div className="wg-box left flex-grow">
                        <div className="flex items-center justify-between gap10 flex-wrap">
                            <div className="flex items-center flex-wrap gap10">
                                <div className="tf-button-funtion">
                                    <i className="icon-upload-cloud" />
                                    <div className="body-title">Upload</div>
                                </div>
                                <div className="tf-button-funtion">
                                    <i className="icon-download-cloud" />
                                    <div className="body-title">Download</div>
                                </div>
                                <div className="tf-button-funtion">
                                    <i className="icon-folder-plus" />
                                    <div className="body-title">Create folder</div>
                                </div>
                                <div className="tf-button-funtion">
                                    <i className="icon-filter" />
                                    <div className="body-title">Filter</div>
                                </div>
                                <div className="tf-button-funtion">
                                    <i className="icon-eye" />
                                    <div className="body-title">View in</div>
                                </div>
                            </div>
                            <form className="form-search w286">
                                <fieldset className="name">
                                    <input type="text" placeholder="Search here..." name="name" tabIndex={2} aria-required="true" required />
                                </fieldset>
                                <div className="button-submit">
                                    <button type="submit"><i className="icon-search" /></button>
                                </div>
                            </form>
                        </div>
                        <div className="wrap-title flex items-center justify-between gap20 flex-wrap">
                            <div className="body-title">File</div>
                            <div className="flex items-center gap20">
                                <div className="select style-default">
                                    <select className>
                                        <option>Sort</option>
                                        <option>Name</option>
                                        <option>Day</option>
                                    </select>
                                </div>
                                <div className="grid-list-style">
                                    <div className="button-grid-style" onClick={() => handleTab(1)}><i className="icon-grid" /></div>
                                    <div className="button-list-style" onClick={() => handleTab(2)}><i className="icon-list" /></div>
                                </div>
                            </div>
                        </div>
                        <div className={isTab === 2 ? "wrap-gallery-item list" : "wrap-gallery-item"}>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-1.png" alt="" />
                                </div>
                                <div className="text-tiny">The Pet Marketing Agency | MarketPlace</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-2.png" alt="" />
                                </div>
                                <div className="text-tiny">Three Dog Bakery Itty Bitty Bones Baked Dog...</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-3.png" alt="" />
                                </div>
                                <div className="text-tiny">Roll over image to zoom in Rachael Ray Nutrish Just...</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-4.png" alt="" />
                                </div>
                                <div className="text-tiny">Feed for dogs and cats – Brit</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-5.png" alt="" />
                                </div>
                                <div className="text-tiny">Halo Purely For Pets Halo Holistic Dog Food, Chicken &amp; Chicken Liver Recipe, Dry Dog Food Bag, Adult Formula, 14-lb</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-6.png" alt="" />
                                </div>
                                <div className="text-tiny">Best Grain Free Dry Dog Food 2023 | DogFoodAdvisor</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-7.png" alt="" />
                                </div>
                                <div className="text-tiny">Innovative pet food packaging</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-8.png" alt="" />
                                </div>
                                <div className="text-tiny">Calico need a design for dry cat food bag (2kg) | Product packaging contest</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-9.png" alt="" />
                                </div>
                                <div className="text-tiny">Calico need a design for dry cat food bag (2kg)| concursos de Packaging y Envases</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-10.png" alt="" />
                                </div>
                                <div className="text-tiny">Biscoito Premier Cookie para Cães Filhotes - 250g</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-11.png" alt="" />
                                </div>
                                <div className="text-tiny">Dog Food (Puppy) with Fresh Chicken for Medium and Large Breeds 5kg *2</div>
                            </Link>
                            <Link href="#" className="gallery-item">
                                <div className="image">
                                    <img src="/images/images-section/all-gallery-12.png" alt="" />
                                </div>
                                <div className="text-tiny">Arden Grange Adult Dry Dog Food Chicken and Rice, 12 kg (Pack of 1)</div>
                            </Link>
                        </div>
                    </div>
                    <div className="wg-box right">
                        <div className="image">
                            <img src="/images/images-section/all-gallery.png" alt="" />
                        </div>
                        <div className>
                            <div className="body-title mb-4">Name</div>
                            <div className="body-text">image 8</div>
                        </div>
                        <div className="divider" />
                        <div className>
                            <div className="body-title mb-4">Uploaded at</div>
                            <div className="body-text">20 Nov 2023 - 2:30 PM</div>
                        </div>
                        <div className="divider" />
                        <div className>
                            <div className="body-title mb-4">Modified at</div>
                            <div className="body-text">20 Nov 2023 - 2:30 PM</div>
                        </div>
                        <div className="divider" />
                        <div className>
                            <div className="body-title mb-10">Full URL</div>
                            <div className="box-coppy">
                                <div className="coppy-content body-text">https://themeforest.net/user/themesflat</div>
                                <i className="icon-copy button-coppy" />
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}