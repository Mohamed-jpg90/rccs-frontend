"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";
import { getRedirectPath } from "@/lib/redirectByRole";

/**
 * Blocks logged-in users from reaching /login or /register — including via
 * the browser back button, since this re-checks on every mount.
 */
export default function AuthLayoutGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      router.replace(getRedirectPath(user?.role));
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-main)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}