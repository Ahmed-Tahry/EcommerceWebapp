"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Menu() {
    const router = usePathname()
    const { authenticated, login } = useAuth()
    const isActive = (path) => router === path

    return (
        <div className="center">
            <div className="center-item">
                <div className="center-heading">Navigation</div>
                <ul className="menu-list">
                    <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                        <Link href="/" className={isActive('/') ? 'active' : ''}>
                            <div className="icon"><i className="icon-grid" /></div>
                            <div className="text">Home</div>
                        </Link>
                    </li>
                    {authenticated ? (
                        <>
                            <li className={`menu-item ${isActive('/onboarding') ? 'active' : ''}`}>
                                <Link href="/onboarding" className={isActive('/onboarding') ? 'active' : ''}>
                                    <div className="icon"><i className="icon-user-plus" /></div>
                                    <div className="text">Onboarding</div>
                                </Link>
                            </li>
                            <li className={`menu-item ${isActive('/setting') ? 'active' : ''}`}>
                                <Link href="/setting" className={isActive('/setting') ? 'active' : ''}>
                                    <div className="icon"><i className="icon-settings" /></div>
                                    <div className="text">Settings</div>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="menu-item">
                            <button onClick={login} className="w-full text-left">
                                <div className="icon"><i className="icon-log-in" /></div>
                                <div className="text">Login</div>
                            </button>
                            </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
