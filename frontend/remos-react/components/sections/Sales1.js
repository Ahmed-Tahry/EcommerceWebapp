import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"
import WeeklyDropdown from "../elements/WeeklyDropdown"


export default function Sales1() {
    return (
        <>

            <div className="wg-box">
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
                <ChartList style={9} />
                <div className="flex gap20">
                    <div className="block-legend justify-center w-full">
                        <div className="dot-1 t1" />
                        <div className="text-tiny">Mens</div>
                    </div>
                    <div className="block-legend justify-center w-full">
                        <div className="dot-1 t2" />
                        <div className="text-tiny">Women’s</div>
                    </div>
                </div>
            </div>
        </>
    )
}
