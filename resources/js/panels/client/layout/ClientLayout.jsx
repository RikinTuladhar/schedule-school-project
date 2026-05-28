import {
    Bell,
    BookOpen,
    DraftingCompass,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    School,
    Search,
    Settings,
    Sparkles,
    UserSearch,
    X,
} from "lucide-react";
import { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClient } from "@/context/ClientContext";

const navItems = [
    { label: "Dashboard", to: "/client/dashboard", icon: LayoutDashboard },
    { label: "Template Builder", to: "/client/assignment-grid", icon: DraftingCompass },
    { label: "Grades", to: "/client/grades", icon: GraduationCap },
    { label: "Subjects", to: "/client/subjects", icon: BookOpen },
    { label: "Teacher Profiles", to: "/client/teachers", icon: UserSearch },
];

const navLinkClassName = ({ isActive }) =>
    [
        "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors active:scale-[0.98]",
        isActive
            ? "border-l-4 border-primary bg-primary text-on-primary"
            : "text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface",
    ].join(" ");

const getDisplayName = (client) =>
    client?.full_name || client?.name || client?.username || client?.email || "Administrator";

const getInitials = (name) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "AD";

const ClientLayout = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { client, isClientLoading, logout } = useClient();
    const displayName = getDisplayName(client);
    const initials = getInitials(displayName);

    const handleLogout = async () => {
        await logout();
        setIsMobileNavOpen(false);
        navigate("/client/sign-in", { replace: true });
    };

    if (isClientLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
                <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-6 py-5 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-primary">Loading Client Area</p>
                    <p className="mt-2 text-sm text-on-surface-variant">Checking your active client session.</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return <Navigate to="/client/sign-in" replace state={{ from: location }} />;
    }

    return (
        <div className="min-h-screen bg-surface font-auth text-on-surface antialiased">
            <header className="fixed right-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/50 bg-surface-container-lowest/80 px-4 backdrop-blur-md md:w-[calc(100%-280px)] md:px-8">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant md:hidden"
                        aria-label="Open navigation"
                        aria-expanded={isMobileNavOpen}
                        onClick={() => setIsMobileNavOpen(true)}
                    >
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="hidden text-2xl font-bold text-primary md:block">EduSched AI</div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="relative hidden sm:block">
                        <Search
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                            aria-hidden="true"
                        />
                        <input
                            className="input-focus-glow w-56 rounded-full border border-outline-variant/50 bg-surface py-2 pl-10 pr-4 text-sm text-on-surface transition-all placeholder:text-on-surface-variant lg:w-64"
                            placeholder="Search templates..."
                            type="search"
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                            aria-label="Settings"
                            title="Settings"
                        >
                            <Settings className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="hidden min-w-0 text-right lg:block">
                            <div className="truncate text-sm font-medium text-on-surface">{displayName}</div>
                            <div className="truncate font-label text-xs text-on-surface-variant">Client Admin</div>
                        </div>
                        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/30 bg-primary-container text-xs font-semibold text-on-primary-container">
                            {initials}
                        </div>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                            aria-label="Sign out"
                            title="Sign out"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col border-r border-outline-variant/10 bg-surface py-8 md:flex">
                <div className="mb-8 flex items-center gap-4 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                        <School className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold leading-tight text-primary">EduSched AI</h1>
                        <p className="font-label text-xs uppercase text-on-surface-variant">Admin Terminal</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 px-4" aria-label="Client navigation">
                    {navItems.map(({ label, to, icon: Icon }) => (
                        <NavLink key={label} to={to} className={navLinkClassName}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span className="text-base">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="px-6">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 font-label text-sm text-on-surface transition-colors hover:bg-outline-variant/30 active:scale-[0.98]"
                    >
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Generate Master Schedule
                    </button>
                </div>
            </aside>

            {isMobileNavOpen ? (
                <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-inverse-surface/35"
                        aria-label="Close navigation"
                        onClick={() => setIsMobileNavOpen(false)}
                    />
                    <aside className="relative flex h-full w-[min(300px,85vw)] flex-col border-r border-outline-variant/20 bg-surface py-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between px-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                                    <School className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold leading-tight text-primary">EduSched AI</h2>
                                    <p className="font-label text-xs uppercase text-on-surface-variant">
                                        Admin Terminal
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-variant"
                                aria-label="Close navigation"
                                onClick={() => setIsMobileNavOpen(false)}
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2 px-4" aria-label="Mobile client navigation">
                            {navItems.map(({ label, to, icon: Icon }) => (
                                <NavLink
                                    key={label}
                                    to={to}
                                    className={navLinkClassName}
                                    onClick={() => setIsMobileNavOpen(false)}
                                >
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-base">{label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <div className="px-5">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 font-label text-sm text-on-surface transition-colors hover:bg-outline-variant/30"
                            >
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                                Generate Master Schedule
                            </button>
                            <button
                                type="button"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-error/20 px-4 py-3 font-label text-sm text-error transition-colors hover:bg-error/10"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                Sign Out
                            </button>
                        </div>
                    </aside>
                </div>
            ) : null}

            <main className="min-h-screen px-4 pb-8 pt-24 md:ml-[280px] md:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout
