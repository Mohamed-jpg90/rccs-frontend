"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { getRedirectPath } from "@/lib/redirectByRole";
import FormField from "./FormField";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await apiClient.post("/auth/register", payload);
      const { token, user } = res.data;

      const normalizedUser = { ...user, _id: user.id };
      saveAuth({ token, user: normalizedUser });

      toast.success("Account created — welcome to RCCS!");
      router.push(getRedirectPath(user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField
        label="Full Name"
        icon={FaUser}
        placeholder="Jane Doe"
        error={errors.fullName}
        {...register("fullName", { required: "Full name is required" })}
      />

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
        label="Phone Number"
        type="tel"
        icon={FaPhone}
        placeholder="01000000000"
        error={errors.phoneNumber}
        {...register("phoneNumber", { required: "Phone number is required" })}
      />

      <FormField
        label="Password"
        type={showPassword ? "text" : "password"}
        icon={FaLock}
        placeholder="At least 8 characters"
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
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "At least 8 characters" },
        })}
      />

      <FormField
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        icon={FaLock}
        placeholder="Re-enter your password"
        error={errors.confirmPassword}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}