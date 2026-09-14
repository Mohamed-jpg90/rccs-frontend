"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaUserClock } from "react-icons/fa";
import { apiClient } from "@/lib/api";

const STATUS_STYLES = {
  Pending: { bg: "var(--warning-bg)", color: "var(--warning)" },
  Approved: { bg: "var(--success-bg)", color: "var(--success)" },
  Rejected: { bg: "var(--danger-bg)", color: "var(--danger)" },
  Cancelled: { bg: "var(--bg-hover)", color: "var(--text-muted)" },
};

export default function JoinRequestsSection({ clubId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    apiClient
      .get(`/clubs/${clubId}/join-requests`)
      .then((res) => setRequests(res.data.requests || []))
      .catch((err) => console.error("Error fetching join requests:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [clubId]);

  const handleDecision = async (requestId, action) => {
    setActingId(requestId);
    try {
      await apiClient.put(`/clubs/${clubId}/join-requests/${requestId}/${action}`);
      toast.success(action === "approve" ? "Request approved" : "Request rejected");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update request");
    } finally {
      setActingId(null);
    }
  };

  const pending = requests.filter((r) => r.status === "Pending");

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="h-32 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse" />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Membership
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-8">
        Join Requests {pending.length > 0 && `(${pending.length} pending)`}
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-10 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
          <FaUserClock className="text-2xl text-[var(--text-disabled)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-muted)]">No join requests yet.</p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] divide-y divide-[var(--border-light)]">
          {requests.map((req) => {
            const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
            return (
              <div key={req._id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {req.user?.fullName || "Unknown user"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {req.user?.email || "—"} ·{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {req.status}
                  </span>

                  {req.status === "Pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecision(req._id, "approve")}
                        disabled={actingId === req._id}
                        className="h-8 w-8 rounded-full bg-[var(--success-bg)] text-[var(--success)] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                        title="Approve"
                      >
                        <FaCheck className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDecision(req._id, "reject")}
                        disabled={actingId === req._id}
                        className="h-8 w-8 rounded-full bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                        title="Reject"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}