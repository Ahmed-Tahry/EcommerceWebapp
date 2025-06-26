'use client'
import { Menu } from '@headlessui/react'
export default function WeeklyDropdown() {
    return (
        <>

            <Menu as="div" className="dropdown default style-box">
                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                    <span className="view-all">Week<i className="icon-chevron-down" /></span>
                </Menu.Button>
                <Menu.Items as="ul" className="dropdown-menu  d-block end-0">
                    <li>
                        <a>Month</a>
                    </li>
                    <li>
                        <a>Year</a>
                    </li>
                </Menu.Items>
            </Menu>
        </>
    )
}
