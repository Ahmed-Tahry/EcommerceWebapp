
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Setting() {

    return (
        <>

            <Layout breadcrumbTitleParent="Page" breadcrumbTitle="Setting">
                <form className="form-setting form-style-2">
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Recent Order</h5>
                            <div className="body-text">Setup license code</div>
                        </div>
                        <div className="right flex-grow">
                            <div className="block-warning w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">Your license is invalid. Please activate your license!</div>
                            </div>
                            <fieldset className="name mb-24">
                                <div className="body-title mb-10">Your username</div>
                                <input className="flex-grow" type="text" placeholder="Enter your username" name="name" tabIndex={0} aria-required="true" required />
                            </fieldset>
                            <fieldset className="text mb-24">
                                <div className="flex items-center justify-between gap10 mb-10">
                                    <div className="body-title">Purchase code</div>
                                    <Link href="#" className="body-text tf-color">What’s this?</Link>
                                </div>
                                <input className="flex-grow" type="text" placeholder="Enter your purchase code" name="text" tabIndex={0} aria-required="true" required />
                            </fieldset>
                            <div className="flex gap10 mb-24">
                                <input className="total-checkbox" type="checkbox" />
                                <div className="body-text">Confirm that, according to the Envato License Terms, each license entitles one person for a single project. Creating multiple unregistered installations is a copyright violation. <span className="tf-color">More info</span></div>
                            </div>
                            <div className="flex flex-wrap gap10 mb-50">
                                <Link href="#" className="tf-button">Active license</Link>
                                <Link href="#" className="tf-button style-1">Reset license on this domain</Link>
                            </div>
                            <div className="text-tiny tf-color-1 mb-10">Note: Your site IP will be added to blacklist after 5 failed attempts.</div>
                            <div className="body-text">A purchase code (license) is only valid for One Domain. Are you using this theme on a new domain? Purchase a new license here to get a new purchase code.</div>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">General Information</h5>
                            <div className="body-text">Setting site information</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="email mb-10 add-more-right">
                                <div className="body-title mb-10">Admin email</div>
                                <input className="flex-grow" type="email" placeholder="Enter your email" name="email" tabIndex={0} aria-required="true" required />
                                <Link href="#" className="tf-button add-more">Add more <i className="icon-plus" /></Link>
                            </fieldset>
                            <div className="block-warning type-main w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">You can add up to 4 emails</div>
                            </div>
                            <fieldset className="timezone mb-24">
                                <div className="body-title mb-10">Timezone</div>
                                <div className="select flex-grow">
                                    <select className>
                                        <option>UTC</option>
                                        <option>UTC +0</option>
                                        <option>UTC +1</option>
                                        <option>UTC +2</option>
                                        <option>UTC +3</option>
                                        <option>UTC +4</option>
                                        <option>UTC +5</option>
                                        <option>UTC +6</option>
                                        <option>UTC +7</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="language mb-24">
                                <div className="body-title mb-10">Site language</div>
                                <div className="select flex-grow">
                                    <select className>
                                        <option>English - EN</option>
                                        <option>France</option>
                                        <option>Japan</option>
                                        <option>Viet Nam</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Front site language direction</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="site-language" id="site-language1" defaultChecked />
                                        <label htmlFor="site-language1"><span className="body-title-2">Left to Right</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="site-language" id="site-language2" />
                                        <label htmlFor="site-language2"><span className="body-title-2">Right to Left</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="flex gap10">
                                <input type="checkbox" />
                                <div className="body-text">Enable to send error reporting via email?</div>
                            </div>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Admin appearance</h5>
                            <div className="body-text">Setting admin appearance such as editor, language...</div>
                        </div>
                        <div className="right flex-grow">
                            <div className="flex gap24 mobile-wrap">
                                <div className="flex gap24 w-half">
                                    <fieldset className="title mb-24">
                                        <div className="body-title mb-10">Avatar</div>
                                        <div className="upload-image style-2">
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
                                    </fieldset>
                                    <fieldset className="title mb-24">
                                        <div className="body-title mb-10">Favicon</div>
                                        <div className="upload-image style-2">
                                            <div className="item up-load">
                                                <label className="uploadfile" htmlFor="myFile1">
                                                    <span className="icon">
                                                        <i className="icon-upload-cloud" />
                                                    </span>
                                                    <span className="text-tiny">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                                    <input type="file" id="myFile1" name="filename" />
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <fieldset className="title mb-24 w-half">
                                    <div className="body-title mb-10">Cover (1920x1080)</div>
                                    <div className="upload-image style-2">
                                        <div className="item up-load">
                                            <label className="uploadfile" htmlFor="myFile2">
                                                <span className="icon">
                                                    <i className="icon-upload-cloud" />
                                                </span>
                                                <span className="text-tiny">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                                <input type="file" id="myFile2" name="filename" />
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <fieldset className="title mb-24">
                                <div className="body-title mb-10">Admin title</div>
                                <input className="flex-grow" type="text" placeholder="Enter title" name="title" tabIndex={0} aria-required="true" required />
                            </fieldset>
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Admin language direction</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="admin-language" id="admin-language1" defaultChecked />
                                        <label htmlFor="admin-language1"><span className="body-title-2">Left to Right</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="admin-language" id="admin-language2" />
                                        <label htmlFor="admin-language2"><span className="body-title-2">Right to Left</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Rich Editor</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="rich-editor" id="rich-editor1" defaultChecked />
                                        <label htmlFor="rich-editor1"><span className="body-title-2">CKEditor</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="rich-editor" id="rich-editor2" />
                                        <label htmlFor="rich-editor2"><span className="body-title-2">TinyMCE</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="flex gap10">
                                <input type="checkbox" />
                                <div className="body-text">Enable change admin theme?</div>
                            </div>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Cache</h5>
                            <div className="body-text">Config cache for system for optimize speed</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Enable cache?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="enable-cache" id="enable-cache1" />
                                        <label htmlFor="enable-cache1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="enable-cache" id="enable-cache2" defaultChecked />
                                        <label htmlFor="enable-cache2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className>
                                <div className="body-title mb-10">Cache admin menu?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="cache-admin" id="cache-admin1" />
                                        <label htmlFor="cache-admin1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="cache-admin" id="cache-admin2" defaultChecked />
                                        <label htmlFor="cache-admin2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Datatables</h5>
                            <div className="body-text">Settings for datatables</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Default show column visibility?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="show-column" id="show-column1" />
                                        <label htmlFor="show-column1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="show-column" id="show-column2" defaultChecked />
                                        <label htmlFor="show-column2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className>
                                <div className="body-title mb-10">Default show export button?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="show-export" id="show-export1" />
                                        <label htmlFor="show-export1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="show-export" id="show-export2" defaultChecked />
                                        <label htmlFor="show-export2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Optimize page speed</h5>
                            <div className="body-text">Minify HTML output, inline CSS, remove comments...</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className>
                                <div className="body-title mb-10">Enable optimize page speed?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="optimize" id="optimize1" />
                                        <label htmlFor="optimize1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="optimize" id="optimize2" defaultChecked />
                                        <label htmlFor="optimize2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Theme</h5>
                            <div className="body-text">Setting for theme</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Enable cache site map?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="cache-site" id="cache-site1" defaultChecked />
                                        <label htmlFor="cache-site1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="cache-site" id="cache-site2" />
                                        <label htmlFor="cache-site2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Cache Time Site map (minutes)</div>
                                <input className="flex-grow" type="text" placeholder="Enter title" name="title" tabIndex={0} aria-required="true" required />
                            </fieldset>
                            <div className="flex gap10 mb-24">
                                <input type="checkbox" />
                                <div className="body-text">Show admin bar (When admin logged in, still show admin bar in website)?</div>
                            </div>
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Redirect all not found requests to homepage?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="redirect" id="redirect1" />
                                        <label htmlFor="redirect1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="redirect" id="redirect2" defaultChecked />
                                        <label htmlFor="redirect2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className>
                                <div className="body-title mb-10">Show guidelines?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="guidelines" id="guidelines1" />
                                        <label htmlFor="guidelines1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="guidelines" id="guidelines2" defaultChecked />
                                        <label htmlFor="guidelines2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Contact</h5>
                            <div className="body-text">Settings for contact plugin</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="text mb-10 add-more-right">
                                <div className="body-title mb-10">Blacklist keywords</div>
                                <input className="flex-grow" type="text" placeholder="keywords" name="text" tabIndex={0} aria-required="true" required />
                                <Link href="#" className="tf-button add-more">Add more <i className="icon-plus" /></Link>
                            </fieldset>
                            <div className="block-warning type-main w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                            </div>
                            <fieldset className="text mb-10 add-more-right">
                                <div className="body-title mb-10">Blacklist email domains</div>
                                <input className="flex-grow" type="text" placeholder="Domains" name="text" tabIndex={0} aria-required="true" required />
                                <Link href="#" className="tf-button add-more">Add more <i className="icon-plus" /></Link>
                            </fieldset>
                            <div className="block-warning type-main w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">Blacklist contact requests if the email domain is in blacklist domains (separate by comma).</div>
                            </div>
                            <div className="flex gap10">
                                <input type="checkbox" />
                                <div className="body-text">Enable math captcha?</div>
                            </div>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Google Analytics</h5>
                            <div className="body-text">Config Credentials for Google Analytics</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="text mb-10 add-more-right">
                                <div className="body-title mb-10">Google tag ID</div>
                                <input className="flex-grow" type="text" placeholder="Enter your Google tag ID" name="text" tabIndex={0} aria-required="true" required />
                                <Link href="#" className="tf-button add-more">Add more <i className="icon-plus" /></Link>
                            </fieldset>
                            <div className="block-warning type-main w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">https://support.google.com/analytics/answer/9539598#find-G-ID</div>
                            </div>
                            <fieldset className="text mb-10 add-more-right">
                                <div className="body-title mb-10">Property ID for GA4</div>
                                <input className="flex-grow" type="text" placeholder="Google analytics property ID (GA4)" name="text" tabIndex={0} aria-required="true" required />
                                <Link href="#" className="tf-button add-more">Add more <i className="icon-plus" /></Link>
                            </fieldset>
                            <div className="block-warning type-main w-full">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">https://developers.google.com/analytics/devguides/reporting/data/v1/property-id</div>
                            </div>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Blog</h5>
                            <div className="body-text">Settings for Blog</div>
                        </div>
                        <div className="right flex-grow">
                            <div className="flex gap10 mb-10">
                                <input type="checkbox" />
                                <div className="body-text">Enable Blog Post Schema?</div>
                            </div>
                            <div className="block-warning type-main w-full mb-24">
                                <i className="icon-alert-octagon" />
                                <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                            </div>
                            <fieldset className>
                                <div className="body-title mb-10">Schema type</div>
                                <div className="select flex-grow">
                                    <select className>
                                        <option>News Article</option>
                                        <option>Line Chart</option>
                                        <option>Column Chart</option>
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Newsletter</h5>
                            <div className="body-text">Settings for newsletter (auto send newsletter email to SendGrid, Mailchimp... when someone register newsletter on website).</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className>
                                <div className="body-title mb-10">Enable newsletter contacts list API?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="newsletter" id="newsletter1" />
                                        <label htmlFor="newsletter1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="newsletter" id="newsletter2" defaultChecked />
                                        <label htmlFor="newsletter2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Captcha</h5>
                            <div className="body-text">Settings for Google Captcha</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className>
                                <div className="body-title mb-10">Enable Captcha?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="captcha" id="captcha1" />
                                        <label htmlFor="captcha1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="captcha" id="captcha2" defaultChecked />
                                        <label htmlFor="captcha2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="wg-box">
                        <div className="left">
                            <h5 className="mb-4">Simple sliders</h5>
                            <div className="body-text">Settings for Simple sliders</div>
                        </div>
                        <div className="right flex-grow">
                            <fieldset className="mb-24">
                                <div className="body-title mb-10">Using default assets?</div>
                                <div className="radio-buttons">
                                    <div className="item">
                                        <input type="radio" name="assets" id="assets1" defaultChecked />
                                        <label htmlFor="assets1"><span className="body-title-2">Yes</span></label>
                                    </div>
                                    <div className="item">
                                        <input type="radio" name="assets" id="assets2" />
                                        <label htmlFor="assets2"><span className="body-title-2">No</span></label>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="body-text mb-24">If using assets option is enabled then below scripts will be auto added to front site.</div>
                            <div className="body-text tf-color-3">
                                /vendor/core/plugins/simple-slider/libraries/owl-carousel/owl.carousel.css <br />
                                /vendor/core/plugins/simple-slider/css/simple-slider.css <br />
                                /vendor/core/plugins/simple-slider/libraries/owl-carousel/owl.carousel.js <br />
                                /vendor/core/plugins/simple-slider/js/simple-slider.js
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="tf-button w180 m-auto">Save setting</button>
                </form>

            </Layout>
        </>
    )
}