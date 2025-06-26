'use client'
import { useState } from 'react'

export default function FullScreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            enterFullscreen()
        } else {
            exitFullscreen()
        }
        setIsFullscreen(!isFullscreen)
    }

    const enterFullscreen = () => {
        const elem = document.documentElement
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen()
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen()
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    }

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
    return (
        <>
            <div className="header-item button-zoom-maximize">
                <div onClick={toggleFullscreen}>
                    <i className="icon-maximize" />
                </div>
            </div>
        </>
    )
}
