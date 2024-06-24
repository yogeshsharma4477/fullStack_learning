import React from 'react'
import Image from "next/image";
import styles from "../app/page.module.css";
import { useSelector, useDispatch } from 'react-redux'

function Header() {
    const list = useSelector((state) => state.landing.list)
    return (
        <main className={styles.main}>
            {
                list && list.map((data,i) => {
                    return (
                        <div className={styles.description} key={i} data-testid={`header_list_${i+1}`}>
                            <p>
                                Get started by editing&nbsp;
                                <code className={styles.code}>app/page.js</code>
                            </p>
                            <div>
                                <a
                                    href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    By{" "}
                                    <Image
                                        src="/vercel.svg"
                                        alt="Vercel Logo"
                                        className={styles.vercelLogo}
                                        width={100}
                                        height={24}
                                        priority
                                    />
                                </a>
                            </div>
                        </div>
                    )
                })
            }

        </main>
    )
}

export default Header