// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
// import AuthLayout from '@/components/auth/AuthLayout'
// import { apiClient } from '@/lib/api'
// import { saveAuth } from '@/lib/auth'

// const inputClass =
//   'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

// function Field({ label, error, children }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
//       {children}
//       {error && <span className="text-xs text-[var(--danger)]">{error.message}</span>}
//     </div>
//   )
// }

// export default function RegisterPage() {
//   const router = useRouter()
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: { fullName: '', email: '', password: '', phoneNumber: '' },
//   })

//   const [showPassword, setShowPassword] = useState(false)
//   const [submitError, setSubmitError] = useState(null)
//   const password = watch('password')

//   const onSubmit = async (data) => {
//     setSubmitError(null)
//     try {
//       const res = await apiClient.post('/auth/register', data)
//       // ⚠️ Same assumption as login: { token, user } shape.
//       // If register doesn't log the user in automatically, drop saveAuth
//       // and router.push('/login') instead.
//       if (res.data?.token) {
//         saveAuth({ token: res.data.token, user: res.data.user })
//         router.push('/dashboard')
//       } else {
//         router.push('/login')
//       }
//     } catch (err) {
//       console.error(err)
//       setSubmitError(err.response?.data?.message ?? 'Could not create your account. Please try again.')
//     }
//   }

//   return (
//     <AuthLayout title="Create an account" subtitle="Get access to the RCCS dashboard">
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//         <Field label="Full Name" error={errors.fullName}>
//           <input
//             {...register('fullName', { required: 'Full name is required' })}
//             className={inputClass}
//             placeholder="Test User"
//           />
//         </Field>

//         <Field label="Email" error={errors.email}>
//           <input
//             type="email"
//             {...register('email', {
//               required: 'Email is required',
//               pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
//             })}
//             className={inputClass}
//             placeholder="user1@rccs.com"
//           />
//         </Field>

//         <Field label="Phone Number" error={errors.phoneNumber}>
//           <input
//             type="tel"
//             {...register('phoneNumber', { required: 'Phone number is required' })}
//             className={inputClass}
//             placeholder="01000000000"
//           />
//         </Field>

//         <Field label="Password" error={errors.password}>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: { value: 8, message: 'Must be at least 8 characters' },
//               })}
//               className={`${inputClass} pr-10`}
//               placeholder="••••••••"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
//             </button>
//           </div>
//         </Field>

//         {submitError && <p className="text-sm text-[var(--danger)]">{submitError}</p>}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="mt-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
//         >
//           {isSubmitting ? 'Creating account...' : 'Create Account'}
//         </button>

//         <p className="text-center text-sm text-muted-foreground">
//           Already have an account?{' '}
//           <Link href="/login" className="font-medium text-[var(--primary)] hover:underline">
//             Sign in
//           </Link>
//         </p>
//       </form>
//     </AuthLayout>
//   )
// }

// app/register/page.js
import AuthLayout from "@/components/layout/AuthLayout";
import AuthLayoutGuard from "@/components/layout/AuthLayoutGuard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayoutGuard>
      <AuthLayout title="Create your account" subtitle="Join the RCCS community in a minute.">
        <RegisterForm />
      </AuthLayout>
    </AuthLayoutGuard>
  );
}