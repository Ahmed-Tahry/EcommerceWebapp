'use client'
import { useEffect } from 'react'

const LayoutWidth = () => {
    useEffect(() => {
        const handleBoxedClick = () => {
            console.log('1')
            const layoutWrap = document.querySelector(".layout-wrap")
            if (layoutWrap) {
                layoutWrap.classList.add("layout-width-boxed")
            }
        }

        const handleFullClick = () => {
            const layoutWrap = document.querySelector(".layout-wrap")
            if (layoutWrap) {
                layoutWrap.classList.remove("layout-width-boxed")
            }
        }

        const boxedElement = document.querySelector(".layout-width .boxed")
        const fullElement = document.querySelector(".layout-width .full")
        if (boxedElement && fullElement) {
            boxedElement.addEventListener("click", handleBoxedClick)
            fullElement.addEventListener("click", handleFullClick)
        }

        return () => {
            if (boxedElement && fullElement) {
                boxedElement.removeEventListener("click", handleBoxedClick)
                fullElement.removeEventListener("click", handleFullClick)
            }
        }
    }, [])

    useEffect(() => {
        const layoutWrap = document.querySelector(".layout-wrap")
        if (layoutWrap) {
            const boxedChecked = layoutWrap.classList.contains("layout-width-boxed")
            const boxedElement = document.querySelector(".layout-width .boxed")
            const fullElement = document.querySelector(".layout-width .full")
            if (boxedElement && fullElement) {
                boxedElement.checked = boxedChecked
                fullElement.checked = !boxedChecked
            }
        }
    }, [])

    return (
        <div className="layout-width">
            {/* Your JSX for layout width */}
        </div>
    )
}

export default LayoutWidth

