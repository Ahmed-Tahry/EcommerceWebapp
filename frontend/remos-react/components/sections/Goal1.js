
import Link from "next/link"
import CircleProgress from "../chart/CircleProgressbar"

export default function Goal1() {
    return (
        <>

            <div className="wg-goal">
                <div className="image">
                    <img src="/images/images-section/goal.jpg" alt="" />
                </div>
                <div className="left">
                    <h5 className="mb-14">Great! Your goal is almost complete</h5>
                    <div className="body-text mb-14">You have completed <span className="body-title">61%</span> <br /> of your target. You can <br /> view
                        the work details.</div>
                    <Link href="#"><span className="body-title">View detail</span><i className="icon-arrow-right" /></Link>
                </div>
                <div className="right">
                    <CircleProgress />
                </div>
            </div>
        </>
    )
}
