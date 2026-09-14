"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaUserPlus, FaClock, FaCheckCircle } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

// STATUS: "loading" | "none" | "Pending" | "Approved" | "Rejected" | "Cancelled"
export default function JoinClubButton({ clubId }) {
  const [status, setStatus] = useState("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setStatus("none");
      return;
    }

    const resolveStatus = async () => {
      try {
        // 1) العضوية الحقيقية دلوقتي — الـ source of truth
        const profileRes = await apiClient.get("/me/profile");
        const currentClubId = profileRes.data?.user?.club?._id ?? profileRes.data?.user?.club;

        if (currentClubId && String(currentClubId) === String(clubId)) {
          setStatus("Approved");
          return; // عضو فعلي دلوقتي — مفيش داعي نشوف الـ requests
        }

        // 2) مش عضو حاليًا (سواء ماطلبش أصلًا، أو اتشال) — نشوف آخر طلب انضمام
        const requestsRes = await apiClient.get("/me/club-requests");
        const requests = requestsRes.data.requests || [];

        const mine = requests
          .filter((r) => (r.club?._id || r.club) === clubId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        // لو آخر طلب كان "Approved" بس هو مش عضو فعلي دلوقتي (اتشال بعد كده)،
        // نتجاهل الـ status القديم ده ونسمحله يطلب الانضمام تاني
        if (mine && mine.status === "Approved") {
          setStatus("none");
        } else {
          setStatus(mine ? mine.status : "none");
        }
      } catch (err) {
        console.error("Error fetching join status:", err);
        setStatus("none");
      }
    };

    resolveStatus();
  }, [clubId]);

  const handleJoin = async () => {
    setSubmitting(true);
    try {
      await apiClient.post(`/clubs/${clubId}/join`);
      setStatus("Pending");
      toast.success("Join request sent — waiting for approval");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send join request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await apiClient.delete(`/clubs/${clubId}/join`);
      setStatus("Cancelled");
      toast.success("Request cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel request");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="h-12 w-40 rounded-full bg-[var(--bg-hover)] animate-pulse" />;
  }

  if (!isAuthenticated()) {
    return (
      <Link
        href="/login?redirect=/clubs"
        className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
      >
        <FaUserPlus />
        Login to Join
      </Link>
    );
  }

  if (status === "Pending") {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-[var(--warning-bg)] text-[var(--warning)] px-5 py-3 rounded-full text-sm font-medium">
          <FaClock />
          Request Pending
        </span>
        <button
          onClick={handleCancel}
          disabled={submitting}
          className="text-sm font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
        >
          {submitting ? "Cancelling..." : "Cancel"}
        </button>
      </div>
    );
  }

  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-2 bg-[var(--success-bg)] text-[var(--success)] px-5 py-3 rounded-full text-sm font-medium">
        <FaCheckCircle />
        You're a Member
      </span>
    );
  }

  // "none", "Rejected", or "Cancelled" — all allow requesting again
  return (
    <button
      onClick={handleJoin}
      disabled={submitting}
      className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
    >
      <FaUserPlus />
      {submitting ? "Sending..." : status === "Rejected" ? "Request Again" : "Request to Join"}
    </button>
  );
}