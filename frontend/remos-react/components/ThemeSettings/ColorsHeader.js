
'use client'

import { useEffect } from 'react'

const ColorsHeader = () => {
    useEffect(() => {
        const handleColorClick = (color, element) => {
            // Remove active class from all color elements
            colorsHeaderElements.forEach(el => {
                el.classList.remove('active')
            })

            // Add active class to clicked element
            element.classList.add('active')

            document.querySelector('.layout-wrap').setAttribute('data-colors-header', `colors-header-${color}`)
        }

        const colorsHeaderElements = document.querySelectorAll('.colors-header .color-fff, .colors-header .color-1E293B, .colors-header .color-1B1B1C, .colors-header .color-3A3043')

        colorsHeaderElements.forEach(element => {
            element.addEventListener('click', () => {
                const color = element.classList[1].replace('color-', '')
                handleColorClick(color, element)
            })
        })

        return () => {
            colorsHeaderElements.forEach(element => {
                element.removeEventListener('click', handleColorClick)
            })
        }
    }, [])

    return null // As this component does not render anything visible
}

export default ColorsHeader
