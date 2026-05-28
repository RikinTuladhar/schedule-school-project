import { useClient } from "@/context/ClientContext";
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    Clock3,
    DoorOpen,
    Download,
    Sparkles,
    SmilePlus,
    X,
} from "lucide-react";

const summaryImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFqIY0Pg3Ss0eKCeRciK3TRUtjYzLklSVXjTUAduztKirhbBCHge17Nz8gFBSUCnQq-6Yp19vYe9cP2-fs6Vf0ga4z_G_jqfqFFhhZ_9QXy1CubxSv93z9Mta_REsZK2ib43qYhtXWUlgMjgBrNG7Hr1tihpadWqCW58VEYCCMXwM7zzwKZopc6YN8G807NEZUGXDtC3RdKO8ecH2ThbopB1XMhbFs_w1lC3oG7hh4PfyiFtkhodyKnrVmZXcmArFgowEZTcTciSo";

const kpis = [
    {
        label: "Conflict-Free Score",
        value: "94%",
        icon: CheckCircle2,
        tone: "primary",
        action: "View Conflicts",
        progress: 94,
    },
    {
        label: "Teacher Satisfaction",
        value: "88%",
        icon: SmilePlus,
        tone: "tertiary",
        badge: "+2.4%",
        caption: "Based on soft constraints",
    },
    {
        label: "Room Utilization",
        value: "72%",
        icon: DoorOpen,
        tone: "secondary",
        blocks: [1, 1, 1, 0.5],
    },
];

const progressItems = [
    { grade: "Grade 12 (Seniors)", percent: 100, status: "100% Complete", shade: "bg-primary-container" },
    { grade: "Grade 11 (Juniors)", percent: 82, status: "82% Complete", shade: "bg-primary-container/80" },
    { grade: "Grade 10 (Sophomores)", percent: 45, status: "45% Complete", shade: "bg-primary-container/40" },
];

const alerts = [
    {
        title: "Time Conflict",
        copy: "Mr. Smith has overlapping lunch breaks in Version 4.2.",
        tone: "error",
    },
    {
        title: "Slot Shortage",
        copy: "Grade 11B requires an extra Physics slot to meet curriculum goals.",
        tone: "tertiary",
    },
    {
        title: "Room Warning",
        copy: "Lab 302 exceeds occupancy limit during Period 4.",
        tone: "secondary",
    },
];

const resources = [
    ["Teachers", "142/142"],
    ["Classrooms", "64/64"],
    ["Labs", "12/12"],
];

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good Morning";
    }

    if (hour < 18) {
        return "Good Afternoon";
    }

    return "Good Evening";
};

const getFirstName = (client) => {
    const name = client?.full_name || client?.name || client?.username || "Admin";
    return name.split(" ")[0] || "Admin";
};

const cardClassName =
    "rounded-xl border border-primary-container/10 bg-surface-container-lowest p-6 shadow-sm transition-colors hover:border-primary-container/30";

const getToneClasses = (tone) => {
    const tones = {
        primary: {
            iconWrap: "bg-primary-container/10 text-primary",
            value: "text-primary",
            bar: "bg-primary-container",
            alert: "border-error bg-error-container/20 text-error",
        },
        tertiary: {
            iconWrap: "bg-tertiary-container/10 text-tertiary",
            value: "text-tertiary",
            bar: "bg-tertiary",
            badge: "bg-tertiary-fixed text-tertiary",
            alert: "border-tertiary bg-tertiary-container/10 text-tertiary",
        },
        secondary: {
            iconWrap: "bg-secondary-container/30 text-secondary",
            value: "text-secondary",
            bar: "bg-secondary",
            alert: "border-secondary bg-secondary-container/20 text-secondary",
        },
        error: {
            iconWrap: "bg-error-container text-error",
            value: "text-error",
            bar: "bg-error",
            alert: "border-error bg-error-container/20 text-error",
        },
    };

    return tones[tone] ?? tones.primary;
};

const ClientDashboardPage = () => {
    const { client } = useClient();
    const clientName = getFirstName(client);

    return (
        <div className="mx-auto max-w-[1440px]">
            <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-3xl font-semibold text-primary md:text-4xl">
                        {getGreeting()}, {clientName}
                    </h2>
                    <p className="mt-2 text-base text-on-surface-variant">
                        The AI has analyzed 482 potential scheduling conflicts today.
                    </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-xl border border-outline/10 bg-surface-container-lowest px-4 py-2 shadow-sm">
                    <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="font-label text-xs text-on-surface">v4.2 Active</span>
                </div>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    const tone = getToneClasses(kpi.tone);

                    return (
                        <article key={kpi.label} className={`${cardClassName} relative overflow-hidden`}>
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <span className={`rounded-lg p-2 ${tone.iconWrap}`}>
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>

                                {kpi.action ? (
                                    <button
                                        type="button"
                                        className="font-label text-xs text-primary transition hover:underline"
                                    >
                                        {kpi.action}
                                    </button>
                                ) : null}

                                {kpi.badge ? (
                                    <span className={`rounded px-2 py-1 font-label text-xs ${tone.badge}`}>
                                        {kpi.badge}
                                    </span>
                                ) : null}
                            </div>

                            <div className={`text-5xl font-bold leading-tight ${tone.value}`}>{kpi.value}</div>
                            <div className="font-label text-sm text-on-surface-variant">{kpi.label}</div>

                            {kpi.progress ? (
                                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary-container">
                                    <div
                                        className="h-full rounded-full bg-primary-container"
                                        style={{ width: `${kpi.progress}%` }}
                                    />
                                </div>
                            ) : null}

                            {kpi.caption ? (
                                <p className="mt-2 text-sm italic text-on-surface-variant/60">{kpi.caption}</p>
                            ) : null}

                            {kpi.blocks ? (
                                <div className="mt-4 flex gap-1">
                                    {kpi.blocks.map((width, index) => (
                                        <div
                                            key={`${kpi.label}-${index}`}
                                            className="h-2 basis-0 rounded-sm bg-primary-container"
                                            style={{ flexGrow: width }}
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </article>
                    );
                })}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className={`${cardClassName} lg:col-span-2`}>
                    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <h3 className="text-2xl font-semibold text-on-surface">Scheduling Progress</h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded bg-surface-container-high px-3 py-1 font-label text-xs text-on-surface-variant transition hover:bg-surface-variant"
                            >
                                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                Export
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded bg-primary-container px-3 py-1 font-label text-xs text-on-primary"
                            >
                                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                                Optimizing...
                            </button>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {progressItems.map((item) => (
                            <div key={item.grade}>
                                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                    <span className="font-label text-sm text-on-surface">{item.grade}</span>
                                    <span className="font-label text-sm text-primary">{item.status}</span>
                                </div>
                                <div className="flex h-8 w-full overflow-hidden rounded-lg bg-surface-container-low">
                                    <div
                                        className={`relative h-full ${item.shade}`}
                                        style={{ width: `${item.percent}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                                    </div>
                                </div>

                                {item.percent === 82 ? (
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        <div className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant/70">
                                            <Circle className="h-2 w-2 fill-primary-container text-primary-container" />
                                            Allocated
                                        </div>
                                        <div className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant/70">
                                            <Circle className="h-2 w-2 fill-surface-container-highest text-surface-container-highest" />
                                            Pending
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 border-t border-outline/10 pt-8">
                        <h4 className="mb-4 font-label text-sm text-on-surface-variant">Recent System Logs</h4>
                        <div className="flex flex-col justify-between gap-4 rounded-lg bg-surface-container-low p-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4">
                                <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-base text-on-surface">Master Schedule v4.2 generated by AI</p>
                                    <p className="font-label text-xs text-on-surface-variant/60">
                                        Success - All core constraints met
                                    </p>
                                </div>
                            </div>
                            <span className="font-label text-xs text-on-surface-variant/60">10 mins ago</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <aside className={cardClassName}>
                        <div className="mb-6 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 fill-error text-error" aria-hidden="true" />
                            <h3 className="text-2xl font-semibold text-on-surface">Urgent Alerts</h3>
                        </div>

                        <div className="space-y-4">
                            {alerts.map((alert) => {
                                const tone = getToneClasses(alert.tone);

                                return (
                                    <div
                                        key={alert.title}
                                        className={`rounded-r-lg border-l-4 p-4 ${tone.alert}`}
                                    >
                                        <div className="mb-1 flex items-start justify-between gap-3">
                                            <span className="font-label text-sm">{alert.title}</span>
                                            {alert.tone === "error" ? (
                                                <button
                                                    type="button"
                                                    className="rounded text-error transition hover:bg-error/10"
                                                    aria-label="Dismiss alert"
                                                >
                                                    <X className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                            ) : null}
                                        </div>
                                        <p className="text-sm leading-5 text-on-surface">{alert.copy}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className="mt-6 w-full rounded-lg border border-outline/20 py-2 font-label text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
                        >
                            Resolve All
                        </button>
                    </aside>

                    <aside className="rounded-xl border border-primary-container/10 bg-primary-container p-6 text-on-primary-container shadow-sm">
                        <h3 className="mb-4 font-label text-sm opacity-80">Strategic Summary</h3>
                        <div className="space-y-4">
                            {resources.map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-4 text-sm">
                                    <span>{label}</span>
                                    <span className="font-bold">{value}</span>
                                </div>
                            ))}
                        </div>
                        <img
                            className="mt-6 h-32 w-full rounded-lg object-cover opacity-50 mix-blend-overlay"
                            src={summaryImage}
                            alt="Data visualization with interconnected nodes representing school schedule analysis"
                            loading="lazy"
                        />
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default ClientDashboardPage;
