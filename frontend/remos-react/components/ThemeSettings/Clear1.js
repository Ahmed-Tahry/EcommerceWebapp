'use client'
import { useEffect } from 'react'

const ClearButton1 = () => {

    const clearLocalStorage = () => {
        localStorage.removeItem('toggled')
    }

    useEffect(() => {
        const clear = () => {
            document.body.classList.remove('dark-theme')
            document.querySelector('.theme-dark-light .light input').checked = true
            document.querySelector('.layout-wrap').classList.remove('menu-style-icon', 'menu-style-icon-default')
            document.querySelector('.menu-style .menu-click').checked = true
            document.querySelector('.layout-wrap').classList.remove('layout-width-boxed')
            document.querySelector('.layout-width .full').checked = true
            document.querySelector('.layout-wrap').classList.remove('menu-position-scrollable')
            document.querySelector('.menu-position .menu-fixed').checked = true
            document.querySelector('.layout-wrap').classList.remove('header-position-scrollable')
            document.querySelector('.header-position .header-fixed').checked = true
            document.querySelector('.layout-wrap').classList.remove('loader-off')
            document.querySelector('.style-loader .style-loader-on').checked = true
            clearLocalStorage()
        }

        const clearButton = document.querySelector('.form-theme-style .button-clear-select')
        clearButton.addEventListener('click', clear)

        return () => {
            clearButton.removeEventListener('click', clear)
        }
    }, [])

    return null // As this component does not render anything visible
}

export default ClearButton1
