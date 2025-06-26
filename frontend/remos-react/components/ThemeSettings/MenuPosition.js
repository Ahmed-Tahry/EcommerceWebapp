'use client'
import { useEffect } from 'react'

const MenuPosition = () => {
    useEffect(() => {
        const menuPosition = () => {
            const menuFixed = document.querySelector(".menu-position .menu-fixed")
            const menuScrollable = document.querySelector(".menu-position .menu-scrollable")
            const layoutWrap = document.querySelector(".layout-wrap")

            if (menuFixed && menuScrollable && layoutWrap) {
                menuFixed.addEventListener("click", function () {
                    layoutWrap.classList.remove("menu-position-scrollable")
                })

                if (!layoutWrap.classList.contains("menu-position-scrollable")) {
                    menuFixed.checked = true
                }

                menuScrollable.addEventListener("click", function () {
                    layoutWrap.classList.add("menu-position-scrollable")
                })

                if (layoutWrap.classList.contains("menu-position-scrollable")) {
                    menuScrollable.checked = true
                }
            }
        }

        menuPosition()

        // Clean up event listeners when component unmounts
        return () => {
            const menuFixed = document.querySelector(".menu-position .menu-fixed")
            const menuScrollable = document.querySelector(".menu-position .menu-scrollable")

            if (menuFixed && menuScrollable) {
                menuFixed.removeEventListener("click", function () {
                    layoutWrap.classList.remove("menu-position-scrollable")
                })

                menuScrollable.removeEventListener("click", function () {
                    layoutWrap.classList.add("menu-position-scrollable")
                })
            }
        }
    }, [])

    return null // Next.js requires a single root element, but this component doesn't render anything
}

export default MenuPosition
