
import Layout from "@/components/layout/Layout"
export default function AddAttributes() {

    return (
        <>

            <Layout breadcrumbTitleParent="Attributes" breadcrumbTitle="Add Attribute">
                <div className="wg-box">
                    <form className="form-new-product form-style-1">
                        <fieldset className="name">
                            <div className="body-title">Attribute name</div>
                            <input className="flex-grow" type="text" placeholder="Attribute name" name="text" tabIndex={0} aria-required="true" required />
                        </fieldset>
                        <fieldset className="name">
                            <div className="body-title">Attribute value</div>
                            <input className="flex-grow" type="text" placeholder="Attribute value" name="text" tabIndex={0} aria-required="true" required />
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