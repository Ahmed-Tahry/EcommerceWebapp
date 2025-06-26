
'use client'

import { useEffect } from 'react'

const ThemeBackground = () => {
    useEffect(() => {
        const handleColorClick = (color, element) => {
            // Remove active class from all color elements
            themeBackgroundElements.forEach(el => {
                el.classList.remove('active')
            })

            // Add active class to clicked element
            element.classList.add('active')

            document.body.setAttribute('data-theme-background', `theme-background-${color}`)
        }

        const themeBackgroundElements = document.querySelectorAll('.colors-theme-background .color-F2F7FB, .colors-theme-background .color-252E3A, .colors-theme-background .color-1E1D2A, .colors-theme-background .color-1B2627, .colors-theme-background .color-1F2027')

        themeBackgroundElements.forEach(element => {
            element.addEventListener('click', () => {
                const color = element.classList[1].replace('color-', '')
                handleColorClick(color, element)
            })
        })

        return () => {
            themeBackgroundElements.forEach(element => {
                element.removeEventListener('click', handleColorClick)
            })
        }
    }, [])

    return null // As this component does not render anything visible
}

export default ThemeBackground;

