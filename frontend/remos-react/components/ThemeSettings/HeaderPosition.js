'use client'
import { useEffect } from 'react';

const HeaderPosition = () => {
    useEffect(() => {
        const headerPosition = () => {
            const headerFixed = document.querySelector(".header-position .header-fixed");
            const headerScrollable = document.querySelector(".header-position .header-scrollable");
            const layoutWrap = document.querySelector(".layout-wrap");

            if (headerFixed && headerScrollable && layoutWrap) {
                headerFixed.addEventListener("click", function () {
                    layoutWrap.classList.remove("header-position-scrollable");
                });

                if (!layoutWrap.classList.contains("header-position-scrollable")) {
                    headerFixed.checked = true;
                }

                headerScrollable.addEventListener("click", function () {
                    layoutWrap.classList.add("header-position-scrollable");
                });

                if (layoutWrap.classList.contains("header-position-scrollable")) {
                    headerScrollable.checked = true;
                }
            }
        };

        headerPosition();

        // Clean up event listeners when component unmounts
        return () => {
            const headerFixed = document.querySelector(".header-position .header-fixed");
            const headerScrollable = document.querySelector(".header-position .header-scrollable");

            if (headerFixed && headerScrollable) {
                headerFixed.removeEventListener("click", function () {
                    layoutWrap.classList.remove("header-position-scrollable");
                });

                headerScrollable.removeEventListener("click", function () {
                    layoutWrap.classList.add("header-position-scrollable");
                });
            }
        };
    }, []);

    return null; // Next.js requires a single root element, but this component doesn't render anything
};

export default HeaderPosition;
