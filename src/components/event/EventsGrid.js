"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaUsers, FaClock } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

const REG_STATUS_STYLES = {
  Registered: { bg: "var(--info-bg)", color: "var(--info)", label: "Registered" },
  Pending: { bg: "var(--warning-bg)", color: "var(--warning)", label: "Waiting for approval" },
  Approved: { bg: "var(--success-bg)", color: "var(--success)", label: "Approved" },
  Rejected: { bg: "var(--danger-bg)", color: "var(--danger)", label: "Rejected" },
};

export default function EventsGrid({
  events = [],
  loading,
  registrationMap = {},
  onCancelled,
  page,
  totalPages,
  onPageChange,
}) {
  const [cancellingId, setCancellingId] = useState(null);
  const router = useRouter();

  const handleCancel = async (e, eventId) => {
    // Card itself is now a Link — stop the click from also navigating
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push("/login?redirect=/events");
      return;
    }
    setCancellingId(eventId);
    try {
      const { apiClient } = await import("@/lib/api");
      await apiClient.delete(`/events/${eventId}/registrations`);
      toast.success("Registration cancelled");
      onCancelled?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel registration");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-96 rounded-[var(--radius-xl-value)] bg-[var(--bg-hover)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">
          No events match your search — try a different filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventDate = new Date(event.date);
          const registration = registrationMap[event._id];
          const style = registration ? REG_STATUS_STYLES[registration.status] : null;
          const deadlinePassed = new Date(event.registrationDeadline) < new Date();
          const isActiveRegistration =
            registration && registration.status !== "Cancelled" && registration.status !== "Rejected";

          return (
            // Whole card navigates to the event detail/register page —
            // any user can view an event's info + feedback regardless of registration state.
            <Link
              key={event._id}
              href={`/events/${event._id}/register`}
              className="block transition-transform hover:-translate-y-1"
            >
              <EntityCard
                image={getFileUrl(event.coverImage)}
                imageAlt={event.title}
                title={event.title}
                description={event.description}
                dateBadge={{
                  day: eventDate.getDate(),
                  month: eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
                }}
                tag={event.club?.clubName}
                meta={[
                  { icon: FaClock, text: event.time },
                  { icon: FaMapMarkerAlt, text: event.location },
                  { icon: FaUsers, text: `${event.capacity} spots` },
                ]}
                footer={
                  isActiveRegistration ? (
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {style.label}
                      </span>
                      <button
                        onClick={(e) => handleCancel(e, event._id)}
                        disabled={cancellingId === event._id}
                        className="text-xs font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
                      >
                        {cancellingId === event._id ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  ) : deadlinePassed ? (
                    <span className="block text-center text-xs font-medium text-[var(--text-disabled)] py-2.5">
                      Registration closed
                    </span>
                  ) : (
                    <span className="block text-center w-full text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)] py-2.5 rounded-full transition-colors">
                      {event.requiresApproval ? "Request to Join" : "Register"}
                    </span>
                  )
                }
              />
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                page === i + 1
                  ? "bg-[var(--primary)] text-[var(--text-white)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}