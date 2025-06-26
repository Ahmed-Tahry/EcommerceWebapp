'use client'
import { Menu } from '@headlessui/react'
export default function DotDropdown() {
    return (
        <>
            <Menu as="div" className="dropdown default">
                <Menu.Button className="btn btn-secondary dropdown-toggle">
                    <span className="icon-more"><i className="icon-more-horizontal" /></span>
                </Menu.Button>
                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end d-block end-0">
                    <li>
                        <a>This Week</a>
                    </li>
                    <li>
                        <a>Last Week</a>
                    </li>
                </Menu.Items>
            </Menu>
        </>
    )
}
