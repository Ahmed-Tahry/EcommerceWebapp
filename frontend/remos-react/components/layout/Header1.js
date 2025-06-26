'use client'
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from "next/link"
import FullScreenButton from '../elements/FullScreenButton'
import Language from '../elements/Language'
import { useAuth } from '@/contexts/AuthContext' // Import useAuth

const ThemeSwitch = dynamic(() => import('../elements/ThemeSwitch'), {
    ssr: false,
})

export default function Header1({ scroll, isMobileMenu, handleSidebar, handleOffcanvas }) {
    const { authenticated, userProfile, login, logout, isLoading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const handleLogin = () => {
        login();
    }

    return (
        <>

            <div className="header-dashboard">
                <div className="wrap">
                    <div className="header-left">
                        <Link href="/">
                            <img id="logo_header_mobile" alt="" src="/images/logo/logo.png" data-light="images/logo/logo.png" data-dark="images/logo/logo-dark.png" data-width="154px" data-height="52px" data-retina="images/logo/logo@2x.png" />
                        </Link>
                        <div className="button-show-hide" onClick={handleSidebar}>
                            <i className="icon-menu-left" />
                        </div>
                        <form className="form-search flex-grow">
                            <fieldset className="name">
                                <input type="text" placeholder="Search here..." className="show-search" name="name" tabIndex={2} // Removed aria-required and required for simplicity as it's a demo search
                                />
                            </fieldset>
                            <div className="button-submit">
                                <button type="submit" onClick={(e) => e.preventDefault()}><i className="icon-search" /></button> {/* Prevent actual form submission for demo */}
                            </div>
                            {/* Simplified search box content for brevity during auth integration */}
                            <div className="box-content-search" id="box-content-search" style={{display: 'none'}}> {/* Hidden for now */}
                                Search results...
                            </div>
                        </form>
                    </div>
                    <div className="header-grid">
                        <div className="header-item country">
                            <Language />
                        </div>
                        <ThemeSwitch />
                        {/* Notifications and Messages popups are kept as is for brevity */}
                        <div className="popup-wrap noti type-header">
                             <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <span className="text-tiny">1</span>
                                        <i className="icon-bell" />
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0">
                                    <li><h6>Message (Demo)</h6></li>
                                    {/* Simplified content */}
                                </Menu.Items>
                            </Menu>
                        </div>
                        <div className="popup-wrap message type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <span className="text-tiny">1</span>
                                        <i className="icon-message-square" />
                                    </span>
                                </Menu.Button
                                >
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0">
                                    <li><h6>Notifications (Demo)</h6></li>
                                    {/* Simplified content */}
                                </Menu.Items>
                            </Menu>
                        </div>
                        <FullScreenButton />
                        {/* Apps popup kept as is */}
                        <div className="popup-wrap apps type-header">
                            <Menu as="div" className="dropdown">
                                <Menu.Button className="btn btn-secondary dropdown-toggle" type="button">
                                    <span className="header-item">
                                        <i className="icon-grid" />
                                    </span>
                                </Menu.Button>
                                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0">
                                    <li><h6>Related apps (Demo)</h6></li>
                                     {/* Simplified content */}
                                </Menu.Items>
                            </Menu>
                        </div>

                        {/* Auth Section */}
                        {isLoading ? (
                            <div className="header-user wg-user">
                                <span className="body-title mb-2">Loading...</span>
                            </div>
                        ) : authenticated && userProfile ? (
                            <div className="popup-wrap user type-header">
                                <Menu as="div" className="dropdown">
                                    <Menu.Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton3">
                                        <span className="header-user wg-user">
                                            <span className="image">
                                                {/* Future: userProfile.avatar or a default icon */}
                                                <img src="/images/avatar/user-1.png" alt="User" />
                                            </span>
                                            <span className="flex flex-column">
                                                <span className="body-title mb-2">{userProfile.preferred_username || userProfile.username || 'User'}</span>
                                                {/* Future: userProfile.roles or other info */}
                                                <span className="text-tiny">Online</span>
                                            </span>
                                        </span>
                                    </Menu.Button>
                                    <Menu.Items as="ul" className="dropdown-menu dropdown-menu-end has-content show d-flex end-0" aria-labelledby="dropdownMenuButton3">
                                        <li>
                                            <Link href="/setting" className="user-item"> {/* Assuming /setting is a profile/settings page */}
                                                <div className="icon"><i className="icon-user" /></div>
                                                <div className="body-title-2">Account</div>
                                            </Link>
                                        </li>
                                        {/* Add other relevant links here */}
                                        <li>
                                            <button onClick={handleLogout} className="user-item w-full text-left">
                                                <div className="icon"><i className="icon-log-out" /></div>
                                                <div className="body-title-2">Log out</div>
                                            </button>
                                        </li>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        ) : (
                            <div className="header-item">
                                <button onClick={handleLogin} className="tf-button style-1">
                                    <i className="icon-log-in mr-2" />Login
                                </button>
                            </div>
                        )}
                        <div className="divider" />
                        <div className="setting cursor-pointer" onClick={handleOffcanvas}><i className="icon-settings" /></div>

                    </div>
                </div>
            </div>

        </>
    )
}
