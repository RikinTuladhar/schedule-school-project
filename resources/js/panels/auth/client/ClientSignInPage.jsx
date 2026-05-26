import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, School } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getApiErrorMessage, signInClient } from "@/apis/auth/client.api";

const ClientSignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const signInMutation = useMutation({
        mutationFn: signInClient,
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        signInMutation.mutate({
            email: formData.get("email"),
            password: formData.get("password"),
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F0F5F9] px-4 py-12 font-auth text-on-surface antialiased md:px-8">
            <div className="w-full max-w-[440px]">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-sm">
                        <School className="h-9 w-9" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-normal text-primary">EduSched AI</h1>
                    <p className="mt-1 font-label text-sm uppercase tracking-wider text-outline">Admin Terminal Access</p>
                </div>

                <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-[0px_4px_20px_rgba(82,97,107,0.06)]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {signInMutation.isError ? (
                            <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container">
                                {getApiErrorMessage(signInMutation.error, "Unable to sign in with those credentials.")}
                            </div>
                        ) : null}

                        {signInMutation.isSuccess ? (
                            <div className="rounded-lg border border-primary/20 bg-primary-fixed px-4 py-3 text-sm text-on-primary-fixed">
                                Signed in successfully.
                            </div>
                        ) : null}

                        <div
                            className={`space-y-2 transition-transform ${
                                focusedField === "email" ? "scale-[1.01]" : ""
                            }`}
                        >
                            <label className="block font-label text-sm text-on-surface-variant" htmlFor="email">
                                Email Address
                            </label>
                            <div className="group relative">
                                <Mail
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary"
                                    aria-hidden="true"
                                />
                                <input
                                    className="w-full rounded-lg border border-outline-variant bg-white py-3 pl-10 pr-4 text-base text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    id="email"
                                    name="email"
                                    placeholder="name@school.edu"
                                    required
                                    type="email"
                                    autoComplete="email"
                                    onBlur={() => setFocusedField(null)}
                                    onFocus={() => setFocusedField("email")}
                                />
                            </div>
                        </div>

                        <div
                            className={`space-y-2 transition-transform ${
                                focusedField === "password" ? "scale-[1.01]" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <label className="block font-label text-sm text-on-surface-variant" htmlFor="password">
                                    Password
                                </label>
                                <Link
                                    className="font-label text-xs text-primary transition-all hover:underline"
                                    to="/client/forgot-password"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="group relative">
                                <LockKeyhole
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary"
                                    aria-hidden="true"
                                />
                                <input
                                    className="w-full rounded-lg border border-outline-variant bg-white py-3 pl-10 pr-12 text-base text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    onBlur={() => setFocusedField(null)}
                                    onFocus={() => setFocusedField("password")}
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((current) => !current)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                                id="remember"
                                name="remember"
                                type="checkbox"
                            />
                            <label
                                className="cursor-pointer select-none text-sm text-on-surface-variant"
                                htmlFor="remember"
                            >
                                Keep me signed in for 30 days
                            </label>
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-base font-medium text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                            type="submit"
                            disabled={signInMutation.isPending}
                        >
                            <span>{signInMutation.isPending ? "Signing In..." : "Sign In"}</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/30" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-surface-container-lowest px-2 font-label text-outline">
                                Authorized Personnel Only
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-on-surface-variant">
                        Need technical assistance?{" "}
                        <a className="font-bold text-primary hover:underline" href="mailto:support@edusched.ai">
                            Contact Support
                        </a>
                    </p>
                </section>

                <footer className="mt-8 space-y-4 text-center">
                    <div className="flex items-center justify-center">
                        <School className="h-6 w-6 text-outline/50" aria-hidden="true" />
                    </div>
                    <p className="font-label text-xs text-outline/60">
                        © 2026 EduSched AI. Precision Academic Systems.
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default ClientSignInPage;
