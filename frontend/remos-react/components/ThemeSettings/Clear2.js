
'use client'

import { useEffect } from 'react'

const Clearbtn2 = () => {
    useEffect(() => {
        const handleClearButtonClick = () => {
            const tflight = document.getElementById('logo_header').getAttribute('data-light')

            // Clear all data attributes
            document.querySelector('.layout-wrap').setAttribute('data-colors-header', '')
            document.querySelector('.layout-wrap').setAttribute('data-colors-menu', '')
            document.querySelector('.layout-wrap').setAttribute('data-theme-primary', '')
            document.querySelector('.layout-wrap').setAttribute('data-theme-background', '')
            document.querySelector('.layout-wrap').setAttribute('data-image-menu-background', '')

            // Remove 'active' class from all color elements except the default
            document.querySelectorAll('.select-colors-theme .active').forEach(element => {
                if (!element.classList.contains('default')) {
                    element.classList.remove('active')
                }
            })

            // Add 'active' class to the default select-colors-theme element
            const defaultElement = document.querySelector('.select-colors-theme .default')
            if (defaultElement) {
                defaultElement.classList.add('active')
            }

            // Remove 'active' class from image-menu-background elements
            document.querySelectorAll('.image-menu-background .active').forEach(element => {
                element.classList.remove('active')
            })

            // Set the src attribute of logo_header to tflight
            document.getElementById('logo_header').setAttribute('src', tflight)
        }

        const clearButton = document.querySelector('.form-theme-color .button-clear-select')
        if (clearButton) {
            clearButton.addEventListener('click', handleClearButtonClick)
        }

        return () => {
            if (clearButton) {
                clearButton.removeEventListener('click', handleClearButtonClick)
            }
        }
    }, [])

    return null // This component does not render anything visible
}

export default Clearbtn2;


