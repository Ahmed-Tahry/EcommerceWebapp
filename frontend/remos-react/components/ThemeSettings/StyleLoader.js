'use client'
import { useEffect } from 'react'

const StyleLoader = () => {
    useEffect(() => {
        const styleLoader = () => {
            const styleLoaderOn = document.querySelector(".style-loader .style-loader-on")
            const styleLoaderOff = document.querySelector(".style-loader .style-loader-off")
            const layoutWrap = document.querySelector(".layout-wrap")

            if (styleLoaderOn && styleLoaderOff && layoutWrap) {
                styleLoaderOn.addEventListener("click", function () {
                    layoutWrap.classList.remove("loader-off")
                })

                if (!layoutWrap.classList.contains("loader-off")) {
                    styleLoaderOn.checked = true
                }

                styleLoaderOff.addEventListener("click", function () {
                    layoutWrap.classList.add("loader-off")
                })

                if (layoutWrap.classList.contains("loader-off")) {
                    styleLoaderOff.checked = true
                }
            }
        }

        styleLoader()

        // Clean up event listeners when component unmounts
        return () => {
            const styleLoaderOn = document.querySelector(".style-loader .style-loader-on")
            const styleLoaderOff = document.querySelector(".style-loader .style-loader-off")

            if (styleLoaderOn && styleLoaderOff) {
                styleLoaderOn.removeEventListener("click", function () {
                    layoutWrap.classList.remove("loader-off")
                })

                styleLoaderOff.removeEventListener("click", function () {
                    layoutWrap.classList.add("loader-off")
                })
            }
        }
    }, [])

    return null // Next.js requires a single root element, but this component doesn't render anything
}

export default StyleLoader
