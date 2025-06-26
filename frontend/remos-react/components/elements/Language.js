'use client'
import { useState } from 'react'

const CustomSelect = () => {
    const [selectedOption, setSelectedOption] = useState('ENG')

    const options = [
        { label: 'ENG', thumbnail: '/images/country/1.png' },
        { label: 'VIE', thumbnail: '/images/country/9.png' },
        // Add more options as needed
    ]

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value)
    }

    return (
        <select className="image-select no-text" onChange={handleSelectChange} value={selectedOption}>
            {options.map((option, index) => (
                <option key={index} value={option.label} data-thumbnail={option.thumbnail}>{option.label}</option>
            ))}
        </select>
    )
}

export default CustomSelect;






