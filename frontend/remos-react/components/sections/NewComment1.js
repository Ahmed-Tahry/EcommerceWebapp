
import Link from "next/link"
import DotDropdown from "../elements/DotDropdown"

export default function NewComment1() {
    return (
        <>

            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>New Comments</h5>
                        <DotDropdown />
                </div>
                <ul className="flex flex-column gap20 overflow-h">
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-2.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Kathryn Murphy</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Cras nec dolor vel est interdum</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-3.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Leslie
                                    Alexander</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Cras nec viverra justo, a mattis lacus.
                                Vestibulum eleifend, leo sit amet aliquam laoreet, turpis leo
                                vulputate orci</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-4.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Devon Lane</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Morbi eget commodo diam. Praesent dignissim
                                purus ac turpis porta</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-5.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Eleanor Pena</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Phasellus et eros ullamcorper, efficitur eros
                                eget, pharetra ante. Sed blandit risus vitae dolor feugiat, eu
                                vulputate elit rhoncus</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-2.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Kathryn Murphy</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Cras nec dolor vel est interdum</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-3.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Leslie
                                    Alexander</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Cras nec viverra justo, a mattis lacus.
                                Vestibulum eleifend, leo sit amet aliquam laoreet, turpis leo
                                vulputate orci</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-4.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Devon Lane</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Morbi eget commodo diam. Praesent dignissim
                                purus ac turpis porta</div>
                        </div>
                    </li>
                    <li className="comment-item">
                        <div className="image">
                            <img src="/images/avatar/user-5.png" alt="" />
                        </div>
                        <div className>
                            <div className="mb-4 name">
                                <Link href="/all-user" className="body-title-2">Eleanor Pena</Link>
                            </div>
                            <div className="ratings mb-10">
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1 active" />
                                <i className="icon-star1" />
                            </div>
                            <div className="text-tiny">Phasellus et eros ullamcorper, efficitur eros
                                eget, pharetra ante. Sed blandit risus vitae dolor feugiat, eu
                                vulputate elit rhoncus</div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}
