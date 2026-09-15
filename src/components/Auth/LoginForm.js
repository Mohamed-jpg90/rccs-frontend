"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { getRedirectPath } from "@/lib/redirectByRole";
import FormField from "./FormField";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await apiClient.post("/auth/login", data);
      const { token, user } = res.data;

      // Backend returns user.id — normalize to _id since every other
      // endpoint in the app (registrations, profile, etc.) expects _id.
      const normalizedUser = { ...user, _id: user.id };
      saveAuth({ token, user: normalizedUser });

      toast.success(`Welcome back, ${user.fullName?.split(" ")[0] || ""}!`);
      router.push(redirectTarget || getRedirectPath(user.role));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField
        label="Email"
        type="email"
        icon={FaEnvelope}
        placeholder="you@example.com"
        error={errors.email}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
        })}
      />

      <FormField
        label="Password"
        type={showPassword ? "text" : "password"}
        icon={FaLock}
        placeholder="••••••••"
        error={errors.password}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-[var(--text-muted)] hover:text-[var(--primary)]"
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        }
        {...register("password", { required: "Password is required" })}
      />

      <div className="flex justify-end -mt-2">
        <Link
          href="/forgot-password"
          className="text-xs text-[var(--primary)] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Don't have an account?{" "}
        <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}