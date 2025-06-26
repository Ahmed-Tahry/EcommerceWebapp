
'use client'

import { useEffect } from 'react';

const MenuBackground = () => {
    useEffect(() => {
        const handleImageClick = (image) => {
            document.querySelector('.layout-wrap').setAttribute('data-image-menu-background', `image-menu-background-${image}`);
        };

        const handleClick = (image) => {
            handleImageClick(image);
        };

        // Attach event listeners
        document.querySelectorAll('.image-menu-background .img-1').forEach(element => {
            element.addEventListener('click', () => handleClick(1));
        });

        document.querySelectorAll('.image-menu-background .img-2').forEach(element => {
            element.addEventListener('click', () => handleClick(2));
        });

        document.querySelectorAll('.image-menu-background .img-3').forEach(element => {
            element.addEventListener('click', () => handleClick(3));
        });

        document.querySelectorAll('.image-menu-background .img-4').forEach(element => {
            element.addEventListener('click', () => handleClick(4));
        });

        document.querySelectorAll('.image-menu-background .img-5').forEach(element => {
            element.addEventListener('click', () => handleClick(5));
        });

        // Cleanup event listeners
        return () => {
            document.querySelectorAll('.image-menu-background .img-1').forEach(element => {
                element.removeEventListener('click', () => handleClick(1));
            });

            document.querySelectorAll('.image-menu-background .img-2').forEach(element => {
                element.removeEventListener('click', () => handleClick(2));
            });

            document.querySelectorAll('.image-menu-background .img-3').forEach(element => {
                element.removeEventListener('click', () => handleClick(3));
            });

            document.querySelectorAll('.image-menu-background .img-4').forEach(element => {
                element.removeEventListener('click', () => handleClick(4));
            });

            document.querySelectorAll('.image-menu-background .img-5').forEach(element => {
                element.removeEventListener('click', () => handleClick(5));
            });
        };
    }, []);

    return null; // As this component does not render anything visible
};

export default MenuBackground;
