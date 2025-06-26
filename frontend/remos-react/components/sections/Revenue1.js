import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"


export default function Revenue1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Revenue</h5>
                    <DotDropdown />
                </div>
                <div className="flex flex-wrap gap40">
                    <div>
                        <div className="mb-3">
                            <div className="block-legend">
                                <div className="dot t1" />
                                <div className="text-tiny">Website</div>
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
                        <div className="mb-3">
                            <div className="block-legend">
                                <div className="dot t3" />
                                <div className="text-tiny">E-commerce</div>
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
                    <div>
                        <div className="mb-3">
                            <div className="block-legend">
                                <div className="dot t4" />
                                <div className="text-tiny">Store</div>
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
                <ChartList style={5} />
            </div>
        </>
    )
}
