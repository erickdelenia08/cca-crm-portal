"use server";

import { signIn } from "@/auth";

export async function authenticateCredentials(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "CredentialsSignin":
                    return "Email atau password salah.";
                default:
                    return "Terjadi kesalahan pada sistem. Silakan coba lagi.";
            }
        }
        // Wajib throw error kembali agar Next.js bisa memproses redirect bawaan NextAuth
        throw error;
    }
}