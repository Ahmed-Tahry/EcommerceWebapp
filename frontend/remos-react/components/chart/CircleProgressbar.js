'use client'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
const percentage = 67

export default function CircleProgress() {
    return (
        <>
            <div style={{ maxWidth: "120px", maxHeight: "120px", width:"90px", margin: "0 auto" }} className="my-3">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth={8}
                    background
                    backgroundPadding={0}
                    styles={buildStyles({
                        backgroundColor: "#2377FC",
                        textColor: "#fff",
                        pathColor: "#fff",
                        trailColor: "#003A95",
                        strokeLinecap: "butt"
                    })}
                />
            </div>
        </>
    )
}