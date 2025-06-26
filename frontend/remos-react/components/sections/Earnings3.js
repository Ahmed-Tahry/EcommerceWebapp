import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"


export default function Earnings3() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Earnings</h5>
                        <DotDropdown />
                </div>

                <ChartList style={7} />
                <div className="flex flex-wrap gap40 justify-center">
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
                                <div className="text-tiny">Profit</div>
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
            </div>
        </>
    )
}
