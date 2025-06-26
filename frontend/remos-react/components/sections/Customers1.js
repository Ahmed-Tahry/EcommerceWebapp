import DotDropdown from "../elements/DotDropdown"


export default function Customers1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Group of potential customers</h5>
                        <DotDropdown />
                </div>
                <div className="wg-table table-customers">
                    <ul className="table-title flex gap10 mb-14">
                        <li>
                            <div className="body-title">Age</div>
                        </li>
                        <li>
                            <div className="body-title">Category</div>
                        </li>
                        <li>
                            <div className="body-title">Purchases</div>
                        </li>
                        <li>
                            <div className="body-title">Country</div>
                        </li>
                        <li>
                            <div className="body-title">Amount of money</div>
                        </li>
                    </ul>
                    <div className="divider mb-22" />
                    <ul className="flex flex-column gap34">
                        <li className="item flex gap10 items-center ">
                            <div className="body-text">18-22</div>
                            <div className="body-text">Industrial</div>
                            <div className="body-text">130</div>
                            <div className="body-text">India</div>
                            <div className="body-text">$120 - $240</div>
                        </li>
                        <li className="item flex gap10 items-center ">
                            <div className="body-text">23-27</div>
                            <div className="body-text">Video Games</div>
                            <div className="body-text">583</div>
                            <div className="body-text">Russia</div>
                            <div className="body-text">$120 - $240</div>
                        </li>
                        <li className="item flex gap10 items-center ">
                            <div className="body-text">28-34</div>
                            <div className="body-text">Books</div>
                            <div className="body-text">426</div>
                            <div className="body-text">China</div>
                            <div className="body-text">$712 - $1,778</div>
                        </li>
                        <li className="item flex gap10 items-center ">
                            <div className="body-text">35-44</div>
                            <div className="body-text">Men's Fashion</div>
                            <div className="body-text">561</div>
                            <div className="body-text">UK</div>
                            <div className="body-text">$573 - $940</div>
                        </li>
                        <li className="item flex gap10 items-center ">
                            <div className="body-text">45-59</div>
                            <div className="body-text">Home, Kitchen, Pets</div>
                            <div className="body-text">177</div>
                            <div className="body-text">USA</div>
                            <div className="body-text">$120 - $240</div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
