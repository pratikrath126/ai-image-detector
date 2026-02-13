"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <a className="navbar-logo" href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <div className="navbar-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="navbar-logo-text">DETECTAI</span>
            </a>

            <ul className="navbar-nav">
                <li><a onClick={() => scrollTo("detector")} role="button" tabIndex={0}>Detect</a></li>
                <li><a onClick={() => scrollTo("features")} role="button" tabIndex={0}>Features</a></li>
                <li><a onClick={() => scrollTo("how-it-works")} role="button" tabIndex={0}>How It Works</a></li>
            </ul>

            <button
                className="navbar-cta"
                onClick={() => scrollTo("detector")}
            >
                Try Now
            </button>

            <button className="navbar-menu-btn" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>
        </nav>
    );
}
