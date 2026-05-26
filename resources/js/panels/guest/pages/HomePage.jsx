import { useEffect, useRef } from "react";
import {
    ArrowRight,
    BrainCircuit,
    Check,
    Clock3,
    Sparkles,
    Users,
} from "lucide-react";

const featureCards = [
    {
        title: "Staggered Break Times",
        copy: "Dynamically align lunch periods, courtyard access, and student transitions across multiple grades without overlapping zones.",
        icon: Clock3,
    },
    {
        title: "Complex Availability",
        copy: "Manage part-time specialists, visiting therapists, and job-sharing teachers with precision. No more manual cross-referencing.",
        icon: Users,
    },
    {
        title: "Human Exhaustion Rules",
        copy: "Protect your staff. Our AI ensures fair distribution of planning periods and limits back-to-back heavy instruction hours.",
        icon: BrainCircuit,
    },
];

const dashboardImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ve2Gz-XrZpQEXhJfxBBcUVLKbsP83XWzaKpMA2rX9KuLcomCP_OiyDJhE4NXy2D4Lpa7PvMR6vspq08RSX6Au6P7hosf15w3TOyGSvpDtWv0OYcNAPuhA2x7QKinartWujdb833ppzv1N3kyrZqEfXTF60Y8JXWTnwK75cMYsyFWplf3jguKaxT1NLPA8pCZiG4GtyiujHoMyP8fv-Vl-_TcpG-w_D0dHIDIXob3G2D-GHbdKska92dqX-XTLvnRg22TyjnWq-o";

const copilotImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCF5Zp_zgQ2yJPTKBPGwjXA9U9jFc4kpBFeyKgtRJe92R9Yfp_6wE36FhwyE0fS_mikyFZLJMJe2REjKudFPSSYIvpYY9nRzPZli0EqbvObDEMy1vg3Fvvs1py43QXnfhuZGdk5s2sW4pZXqGX5f9GcqEp3ItDxTUix-bWS_MN821W6OrVrMDrHx6178sgvuczPD5jq7UVmL_hAvprf_Pcgp2SPU881emXoYxqdRmaRBj4AG8wC-W28tg-bAKw3PDmsBjj1LbqH-Z0";

const HomePage = () => {
    const heroVisualRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const handleMouseMove = (event) => {
            const moveX = (event.clientX - window.innerWidth / 2) / 50;
            const moveY = (event.clientY - window.innerHeight / 2) / 50;

            if (heroVisualRef.current) {
                heroVisualRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            <section className="relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-background to-primary/5 px-4 pb-32 pt-32 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-16">
                        <div className="z-10 flex w-full flex-col items-center space-y-8 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 font-label text-xs font-bold uppercase tracking-wider text-on-secondary-container">
                                <Sparkles className="h-4 w-4 fill-current" aria-hidden="true" />
                                AI-powered academic logistics
                            </div>

                            <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-[1.1] tracking-normal text-on-surface md:text-6xl">
                                Solving the School <br />
                                <span className="text-primary-container">Scheduling Puzzle</span> <br />
                                with AI.
                            </h1>

                            <p className="mx-auto max-w-xl text-lg text-on-surface-variant">
                                Automate complex constraints, staggered break times, and human-first availability.
                                Deploy a year&apos;s worth of logic in minutes, not months.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    className="hover-lift inline-flex items-center gap-2 rounded-xl bg-primary-container px-8 py-4 font-label text-lg text-on-primary transition-all hover:opacity-90"
                                    href="#demo"
                                >
                                    Request Demo
                                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </a>
                                <a
                                    className="rounded-xl border border-outline-variant/50 bg-white px-8 py-4 font-label text-lg text-primary transition-all hover:bg-surface-container-lowest"
                                    href="#how-it-works"
                                >
                                    See How it Works
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="overflow-hidden bg-surface-container-lowest px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="reveal active mx-auto mb-16 max-w-2xl space-y-4 text-center">
                            <h2 className="font-display text-4xl font-semibold text-on-surface">The Nightmares We Solve</h2>
                            <p className="text-on-surface-variant">
                                Administration shouldn&apos;t feel like a high-stakes puzzle. Our AI understands the nuance
                                of modern school life.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {featureCards.map(({ title, copy, icon: Icon }, index) => (
                                <article
                                    key={title}
                                    className="reveal group rounded-xl border border-outline-variant/30 bg-white p-8 transition-all hover:border-primary/50"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-primary transition-transform group-hover:scale-110">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="mb-4 font-display text-2xl font-semibold text-on-surface">{title}</h3>
                                    <p className="text-sm leading-6 text-on-surface-variant">{copy}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl space-y-32">
                        <div className="flex flex-col items-center gap-16 lg:flex-row">
                            <div className="reveal flex-1 space-y-6">
                                <div className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                                    The One-Shot Generation
                                </div>
                                <h2 className="font-display text-4xl font-semibold text-on-surface">Experience Autopilot</h2>
                                <p className="text-lg leading-8 text-on-surface-variant">
                                    Import your teacher roster and room requirements. Click generate. Our proprietary
                                    genetic algorithm creates millions of permutations to find the mathematically perfect
                                    schedule in under 60 seconds.
                                </p>
                                <ul className="space-y-3">
                                    {["Zero Conflict Guarantee", "Optimized Room Utilization"].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-on-surface">
                                            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div ref={heroVisualRef} className="reveal flex-1 transition-transform duration-200">
                                <div className="rounded-2xl border border-outline-variant/30 bg-primary/5 p-8">
                                    <img
                                        className="aspect-[4/3] w-full rounded-xl border border-outline-variant/20 object-cover shadow-lg"
                                        src={dashboardImage}
                                        alt="Clean academic scheduling dashboard with color-coded course blocks and optimization indicators"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-16 lg:flex-row-reverse">
                            <div className="reveal flex-1 space-y-6">
                                <div className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                                    The Smart Assistant
                                </div>
                                <h2 className="font-display text-4xl font-semibold text-on-surface">Deploy Your Copilot</h2>
                                <p className="text-lg leading-8 text-on-surface-variant">
                                    Manual adjustments are inevitable. When you move a session, Copilot provides a live,
                                    AI-ranked list of available teachers and rooms based on 15+ impact factors.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border border-outline-variant/40 bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container font-bold">
                                                JD
                                            </div>
                                            <div>
                                                <div className="font-label font-bold text-on-surface">Dr. James Doe</div>
                                                <div className="text-xs text-on-surface-variant">98% Match Score</div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="rounded bg-primary/5 px-3 py-1 font-label text-xs font-bold text-primary"
                                        >
                                            Assign
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-white/50 p-4 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container font-bold">
                                                SR
                                            </div>
                                            <div>
                                                <div className="font-label font-bold text-on-surface">Sarah Reed</div>
                                                <div className="text-xs text-error">Conflict: Dept. Meeting</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="reveal flex-1" style={{ transitionDelay: "200ms" }}>
                                <div className="rounded-3xl bg-primary-container p-1">
                                    <img
                                        className="aspect-[4/3] w-full rounded-[22px] object-cover"
                                        src={copilotImage}
                                        alt="Tablet interface showing AI-ranked personnel matches with status indicators"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="reveal mx-auto max-w-7xl">
                        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-inverse-surface p-8 md:flex-row md:p-12">
                            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                            <div className="relative z-10 max-w-xl">
                                <h2 className="mb-4 font-display text-4xl font-semibold text-inverse-on-surface">
                                    Manage Multiple Campuses Seamlessly
                                </h2>
                                <p className="text-inverse-on-surface/70">
                                    Centralized Super-Admin architecture allows district leaders to view and sync
                                    schedules across dozens of schools from a single dashboard.
                                </p>
                            </div>
                            <div className="relative z-10">
                                <a
                                    className="hover-lift inline-flex rounded-xl bg-primary-fixed px-8 py-4 font-label text-on-primary-fixed transition-all hover:bg-white"
                                    href="#enterprise"
                                >
                                    Enterprise Architecture
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
        </>
    );
};

export default HomePage;
