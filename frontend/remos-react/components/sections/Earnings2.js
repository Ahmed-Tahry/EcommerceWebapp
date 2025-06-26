import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"


export default function Earnings2() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Earnings revenue</h5>
                        <DotDropdown />
                </div>
                <div className="flex flex-wrap gap40">
                    <div>
                        <div className="mb-2">
                            <div className="block-legend">
                                <div className="dot t1" />
                                <div className="text-tiny">Revenue</div>
                            </div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>$37,802</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                                <div className="body-title number">0.56%</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            <div className="block-legend">
                                <div className="dot t2" />
                                <div className="text-tiny">Order</div>
                            </div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>$28,305</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                                <div className="body-title number">0.56%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChartList style={6} />
            </div>
        </>
    )
}
