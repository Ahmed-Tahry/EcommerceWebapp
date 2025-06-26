'use client'
import { Menu } from '@headlessui/react'
export default function ViewAllDropdown() {
    return (
        <>
            <Menu as="div" className="dropdown default">
                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                    <span className="view-all">View all<i className="icon-chevron-down" /></span>
                </Menu.Button>
                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end d-block end-0">
                    <li>
                        <a>3 days</a>
                    </li>
                    <li>
                        <a>7 days</a>
                    </li>
                </Menu.Items>
            </Menu>


        </>
    )
}
