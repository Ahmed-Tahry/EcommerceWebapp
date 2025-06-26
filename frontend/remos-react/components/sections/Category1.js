
import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"
import WeeklyDropdown from "../elements/WeeklyDropdown"

export default function Category1() {
    return (
        <>

            <div className="wg-box w-half">
                <div className="flex items-center justify-between">
                    <h5>Sale by category</h5>
                    <DotDropdown />
                </div>
                <div className="flex gap10 justify-between flex-wrap">
                    <div>
                        <div className="text-tiny mb-2">Total Mar 20, 2023</div>
                        <div className="flex items-center gap10">
                            <h4>$37,802</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up" />
                                <div className="body-title number">0.56%</div>
                            </div>
                        </div>
                    </div>
                    <WeeklyDropdown />
                </div>
                {/* <div id="morris-donut-1" className="text-center" /> */}
                <ChartList style={15} />
                <div className="flex gap20">
                    <div className="block-legend style-1 w-full">
                        <div className="dot t1" />
                        <div className="text-tiny">Men Fashion</div>
                    </div>
                    <div className="block-legend style-1 w-full">
                        <div className="dot t2" />
                        <div className="text-tiny">Men Fashion</div>
                    </div>
                    <div className="block-legend style-1 w-full">
                        <div className="dot t3" />
                        <div className="text-tiny">Men Fashion</div>
                    </div>
                </div>
                <div className="flex gap20">
                    <div className="block-legend style-1 w-full">
                        <div className="dot t4" />
                        <div className="text-tiny">Accessory</div>
                    </div>
                    <div className="block-legend style-1 w-full">
                        <div className="dot t5" />
                        <div className="text-tiny">Sport shoes</div>
                    </div>
                    <div className="block-legend style-1 w-full">
                        <div className="dot t6" />
                        <div className="text-tiny">Underwear</div>
                    </div>
                </div>
            </div>
        </>
    )
}
