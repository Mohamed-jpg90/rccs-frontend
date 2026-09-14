"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaUsers } from "react-icons/fa";
import { apiClient } from "@/lib/api";

const STATUS_STYLES = {
  Pending: { bg: "var(--warning-bg)", color: "var(--warning)" },
  Approved: { bg: "var(--success-bg)", color: "var(--success)" },
  Rejected: { bg: "var(--danger-bg)", color: "var(--danger)" },
  Cancelled: { bg: "var(--bg-hover)", color: "var(--text-muted)" },
};

export default function MyClubRequestsSection() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRequests = () => {
    apiClient
      .get("/me/club-requests")
      .then((res) => setRequests(res.data.requests || []))
      .catch((err) => console.error("Error fetching club requests:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (request) => {
    const clubId = request.club?._id || request.club;
    setCancellingId(request._id);
    try {
      await apiClient.delete(`/clubs/${clubId}/join`);
      toast.success("Request cancelled");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel request");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading || requests.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Membership
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        My Club Requests
      </h2>

      <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] divide-y divide-[var(--border-light)]">
        {requests.map((req) => {
          const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
          const clubId = req.club?._id || req.club;
          return (
            <div key={req._id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
              <Link
                href={`/clubs/${clubId}`}
                className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
              >
                <FaUsers className="text-[var(--primary)]" />
                {req.club?.clubName || "Club"}
              </Link>

              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: style.bg, color: style.color }}
                >
                  {req.status}
                </span>
                {req.status === "Pending" && (
                  <button
                    onClick={() => handleCancel(req)}
                    disabled={cancellingId === req._id}
                    className="text-xs font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
                  >
                    {cancellingId === req._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}