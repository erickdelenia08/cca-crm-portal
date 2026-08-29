"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";

// Email & password akun dummy / demo untuk masing-masing role


export function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [quickLoginLoading, setQuickLoginLoading] = useState<string | null>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginInput) => {
        setServerError(null);
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            setServerError("Email atau password salah.");
        } else {
            router.push("/");
            router.refresh();
        }
    };

    // Handler untuk Quick Login berdasarkan role yang dipilih
    const handleQuickLogin = async (account: typeof DEMO_ACCOUNTS[number]) => {
        setQuickLoginLoading(account.role);
        setServerError(null);

        // Mengisi form (opsional, untuk UX visual)
        setValue("email", account.email);
        setValue("password", account.password);

        // Eksekusi Login
        const res = await signIn("credentials", {
            email: account.email,
            password: account.password,
            redirect: false,
        });

        if (res?.error) {
            setServerError(`Gagal masuk sebagai ${account.label}.`);
            setQuickLoginLoading(null);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    const isLoading = isSubmitting || !!quickLoginLoading;

    return (
        <div className="space-y-6">
            {/* Form Login Regular */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        disabled={isLoading}
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                        placeholder="nama@email.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        disabled={isLoading}
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {serverError && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{serverError}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors shadow-xs"
                >
                    {isSubmitting ? "Memproses..." : "Masuk"}
                </button>
            </form>

            {/* Divider / Pembatas */}
            <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200"></div>
                <span className="absolute bg-white px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Atau Quick Login Demo
                </span>
            </div>

            {/* Quick Login Role Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    const isSelectedLoading = quickLoginLoading === acc.role;

                    return (
                        <button
                            key={acc.role}
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleQuickLogin(acc)}
                            className={`flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white transition-all shadow-2xs ${acc.color} disabled:opacity-50`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                                {isSelectedLoading ? "Masuk..." : acc.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}