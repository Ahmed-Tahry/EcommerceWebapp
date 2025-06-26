
'use client'
import { useEffect } from 'react'

const ColorsMenu = () => {
    useEffect(() => {
        const handleColorClick = (color, src, element) => {
            // Remove active class from all color elements
            colorsMenuElements.forEach(el => {
                el.classList.remove('active')
            })

            // Add active class to clicked element
            element.classList.add('active')

            document.querySelector('.layout-wrap').setAttribute('data-colors-menu', `colors-menu-${color}`)
            document.getElementById('logo_header').setAttribute('src', src)
        }

        const tflight = document.getElementById('logo_header').dataset.light
        const tfdark = document.getElementById('logo_header').dataset.dark

        const colorsMenuElements = document.querySelectorAll('.colors-menu .color-fff, .colors-menu .color-1E293B, .colors-menu .color-1B1B1C, .colors-menu .color-3A3043')

        colorsMenuElements.forEach(element => {
            element.addEventListener('click', () => {
                if (element.classList.contains('color-fff')) {
                    handleColorClick('fff', tflight, element)
                } else if (element.classList.contains('color-1E293B')) {
                    handleColorClick('1E293B', tfdark, element)
                } else if (element.classList.contains('color-1B1B1C')) {
                    handleColorClick('1B1B1C', tfdark, element)
                } else if (element.classList.contains('color-3A3043')) {
                    handleColorClick('3A3043', tfdark, element)
                }
            })
        })

        return () => {
            colorsMenuElements.forEach(element => {
                element.removeEventListener('click', handleColorClick)
            })
        }
    }, [])

    return null // As this component does not render anything visible
}

export default ColorsMenu;

