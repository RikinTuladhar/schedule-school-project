import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { BadgeCheck, DraftingCompass, Menu } from "lucide-react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#demo" },
];

const footerColumns = [
    {
        title: "Product",
        links: ["Features", "Integrations", "Enterprise", "Roadmap"],
    },
    {
        title: "Company",
        links: ["About Us", "Careers", "Security", "Legal"],
    },
    {
        title: "Support",
        links: ["Documentation", "Help Center", "Community", "Contact"],
    },
];

const GuestLayout = () => {
    const pageRef = useRef(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const updateHeader = () => setHasScrolled(window.scrollY > 20);

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        return () => window.removeEventListener("scroll", updateHeader);
    }, []);

    useEffect(() => {
        const page = pageRef.current;

        if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const revealElements = page.querySelectorAll(".reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            },
        );

        revealElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={pageRef} className="min-h-screen bg-background font-sans text-on-surface antialiased">
            <header
                className={`fixed inset-x-0 top-0 z-50 h-16 border-b border-outline-variant/30 bg-background/80 backdrop-blur-md transition-shadow ${
                    hasScrolled ? "shadow-sm" : ""
                }`}
            >
                <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="/" className="flex items-center gap-2 text-primary" aria-label="EduSched AI home">
                        <DraftingCompass className="h-8 w-8" aria-hidden="true" />
                        <span className="font-display text-xl font-bold">EduSched AI</span>
                    </a>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((item) => (
                            <a
                                key={item.label}
                                className="font-label text-sm text-on-surface-variant transition-colors hover:text-primary"
                                href={item.href}
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            className="rounded-lg border border-outline-variant px-4 py-2 font-label text-sm transition-all hover:bg-surface-container"
                            href="/client/sign-in"
                        >
                            Client Login
                        </a>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition hover:bg-surface-container md:hidden"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                        onClick={() => setIsMobileMenuOpen((current) => !current)}
                    >
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </nav>

                {isMobileMenuOpen && (
                    <div className="border-b border-outline-variant/30 bg-background px-4 py-4 shadow-sm md:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-3">
                            {navLinks.map((item) => (
                                <a
                                    key={item.label}
                                    className="rounded-lg px-3 py-2 font-label text-sm text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <a
                                className="rounded-lg border border-outline-variant px-3 py-2 text-center font-label text-sm transition hover:bg-surface-container"
                                href="/client/sign-in"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Client Login
                            </a>
                        </div>
                    </div>
                )}
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="border-t border-outline-variant/20 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div id="demo" className="reveal mb-20 flex flex-col items-center text-center">
                        <BadgeCheck className="mb-5 h-10 w-10 text-primary" aria-hidden="true" />
                        <h2 className="mb-6 font-display text-4xl font-semibold text-on-surface">
                            Ready to put your schedule on Autopilot?
                        </h2>
                        <a
                            className="hover-lift rounded-full bg-primary px-10 py-5 font-label text-xl text-white transition-transform hover:scale-105"
                            href="/client/sign-up"
                        >
                            Start Your Trial Today
                        </a>
                    </div>

                    <div className="mb-20 grid grid-cols-2 gap-12 md:grid-cols-4">
                        <div className="col-span-2 space-y-4 md:col-span-1">
                            <div className="flex items-center gap-2 text-primary">
                                <DraftingCompass className="h-6 w-6" aria-hidden="true" />
                                <span className="font-display text-xl font-bold">EduSched AI</span>
                            </div>
                            <p className="text-sm text-on-surface-variant">
                                The intelligent standard for modern academic logistics.
                            </p>
                        </div>

                        {footerColumns.map((column) => (
                            <div key={column.title} className="space-y-4">
                                <h4 className="font-label font-bold text-on-surface">{column.title}</h4>
                                <ul className="space-y-2 text-sm text-on-surface-variant">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a className="transition-colors hover:text-primary" href="#">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-between border-t border-outline-variant/10 pt-8 font-label text-xs text-on-surface-variant md:flex-row">
                        <div>© 2026 EduSchedule AI. All rights reserved.</div>
                        <div className="mt-4 flex gap-6 md:mt-0">
                            <a className="transition-colors hover:text-primary" href="#">
                                Privacy Policy
                            </a>
                            <a className="transition-colors hover:text-primary" href="#">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GuestLayout;
