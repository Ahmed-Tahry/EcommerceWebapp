import ChatList from "../chart/ChartList"
import DotDropdown from "../elements/DotDropdown"


export default function RecentOrder1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Recent Order</h5>
                    <DotDropdown />
                </div>
                <div id="line-chart-5" />
                <ChatList style={3} />
            </div>
        </>
    )
}
