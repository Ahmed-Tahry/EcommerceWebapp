'use client'
import React, { useEffect } from 'react';

const MenuStyle = () => {
    useEffect(() => {
        const handleIconClick = () => {
            const layoutWrap = document.querySelector(".layout-wrap");
            if (layoutWrap) {
                layoutWrap.classList.add("menu-style-icon");
                layoutWrap.classList.remove("menu-style-icon-default");
            }
        };

        const handleDefaultClick = () => {
            const layoutWrap = document.querySelector(".layout-wrap");
            if (layoutWrap) {
                layoutWrap.classList.add("menu-style-icon-default");
                layoutWrap.classList.remove("menu-style-icon");
            }
        };

        const handleMenuClick = () => {
            const layoutWrap = document.querySelector(".layout-wrap");
            if (layoutWrap) {
                layoutWrap.classList.remove("menu-style-icon");
                layoutWrap.classList.remove("menu-style-icon-default");
            }
        };

        const iconHover = document.querySelector(".menu-style .icon-hover");
        const iconDefault = document.querySelector(".menu-style .icon-default");
        const menuClick = document.querySelector(".menu-style .menu-click");

        if (iconHover) iconHover.addEventListener("click", handleIconClick);
        if (iconDefault) iconDefault.addEventListener("click", handleDefaultClick);
        if (menuClick) menuClick.addEventListener("click", handleMenuClick);

        return () => {
            if (iconHover) iconHover.removeEventListener("click", handleIconClick);
            if (iconDefault) iconDefault.removeEventListener("click", handleDefaultClick);
            if (menuClick) menuClick.removeEventListener("click", handleMenuClick);
        };
    }, []);

    useEffect(() => {
        const layoutWrap = document.querySelector(".layout-wrap");
        if (layoutWrap) {
            if (layoutWrap.classList.contains("menu-style-icon")) {
                const iconHover = document.querySelector(".menu-style .icon-hover");
                if (iconHover) iconHover.checked = true;
            } else if (layoutWrap.classList.contains("menu-style-icon-default")) {
                const iconDefault = document.querySelector(".menu-style .icon-default");
                if (iconDefault) iconDefault.checked = true;
            } else {
                const menuClick = document.querySelector(".menu-style .menu-click");
                if (menuClick) menuClick.checked = true;
            }
        }
    }, []);

    return (
        <div className="menu-style">
            {/* Your JSX for the menu style */}
        </div>
    );
};

export default MenuStyle;

