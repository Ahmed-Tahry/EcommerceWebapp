
'use client'

import { useEffect } from 'react'

const PrimaryTheme = () => {
    useEffect(() => {
        const handleColorClick = (color, element) => {
            // Remove active class from all color elements
            primaryThemeElements.forEach(el => {
                el.classList.remove('active')
            })

            // Add active class to clicked element
            element.classList.add('active')

            document.querySelector('.layout-wrap').setAttribute('data-theme-primary', `theme-primary-${color}`)
        }

        const primaryThemeElements = document.querySelectorAll('.colors-theme-primary .color-2377FC, .colors-theme-primary .color-DE6E49, .colors-theme-primary .color-35988D, .colors-theme-primary .color-7047D6, .colors-theme-primary .color-189D72')

        primaryThemeElements.forEach(element => {
            element.addEventListener('click', () => {
                const color = element.classList[1].replace('color-', '')
                handleColorClick(color, element)
            })
        })

        return () => {
            primaryThemeElements.forEach(element => {
                element.removeEventListener('click', handleColorClick)
            })
        }
    }, [])

    return null // As this component does not render anything visible
}

export default PrimaryTheme;

