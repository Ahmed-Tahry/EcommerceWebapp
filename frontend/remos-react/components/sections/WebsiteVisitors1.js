import ChartList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"


export default function WebsiteVisitors1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Website visitors</h5>
                    <DotDropdown />
                </div>
                <ChartList style={8} />
            </div>
        </>
    )
}
