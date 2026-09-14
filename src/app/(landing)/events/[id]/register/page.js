"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaArrowLeft } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";
import { getFileUrl } from "@/lib/files";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import FeedbackSection from "@/components/events/FeedbackSection";

export default function EventRegisterPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = getUser();
  const currentUserId = user?._id || user?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [attended, setAttended] = useState(false);

  const showButton = useHideOnScroll(80);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`/login?redirect=/events/${id}/register`);
      return;
    }

    const load = async () => {
      try {
        const [eventRes, regsRes, attRes, feedbackRes] = await Promise.all([
          apiClient.get(`/events/${id}`),
          apiClient.get("/me/registrations"),
          apiClient.get("/me/attendance"),
          apiClient.get(`/events/${id}/feedback`),
        ]);
        setEvent(eventRes.data.event);

        const existing = (regsRes.data.registrations || []).find(
          (r) => (r.event?._id || r.event) === id && r.status !== "Cancelled" && r.status !== "Rejected"
        );
        if (existing) setAlreadyRegistered(true);

        const myAttendance = (attRes.data.history || []).find(
          (a) => (a.event?._id || a.event) === id
        );
        if (myAttendance?.attendanceStatus === "Present") setAttended(true);

        setFeedback(feedbackRes.data.feedback || []);
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Could not load this event");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await apiClient.post(`/events/${id}/registrations`, {
        event: id,
        user: currentUserId,
      });
      toast.success(
        event.requiresApproval ? "Request sent — awaiting admin approval" : "You're registered!"
      );
      setAlreadyRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackAdded = (newFeedback) => {
    setFeedback((prev) => [newFeedback, ...prev]);
  };

  const handleFeedbackDeleted = (feedbackId) => {
    setFeedback((prev) => prev.filter((f) => f._id !== feedbackId));
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-muted)]">Loading event...</div>
      </div>
    );
  }

  if (!event) return null;

  const infoItems = [
    {
      icon: FaCalendarAlt,
      label: "Date",
      value: new Date(event.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    { icon: FaClock, label: "Time", value: event.time },
    { icon: FaMapMarkerAlt, label: "Location", value: event.location },
    { icon: FaUsers, label: "Capacity", value: `${event.capacity} attendees` },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-16 pb-32">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] mb-8 transition-colors"
      >
        <FaArrowLeft className="text-xs" />
        Back to Events
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left: image */}
        <div className="md:sticky md:top-24">
          <div className="relative h-64 md:h-[420px] w-full rounded-[var(--radius-xl-value)] overflow-hidden border border-[var(--border)]">
            <img
              src={getFileUrl(event.coverImage)}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {event.club && (
              <span className="absolute top-4 left-4 bg-[var(--bg-surface)]/95 text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full">
                {event.club.clubName}
              </span>
            )}
          </div>
        </div>

        {/* Right: description + info */}
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-4">
            {event.title}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-full bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                  <item.icon className="text-[var(--primary)] text-sm" />
                </span>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">{item.label}</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {alreadyRegistered && (
            <div className="text-center py-4 rounded-full bg-[var(--info-bg)] text-[var(--info)] text-sm font-medium">
              You're already registered for this event
            </div>
          )}

          {event.requiresApproval && !alreadyRegistered && (
            <p className="text-xs text-[var(--text-muted)] text-center mt-1">
              This event requires admin approval before you're confirmed.
            </p>
          )}
        </div>
      </div>

      {/* Feedback section — full width */}
      <FeedbackSection
        eventId={id}
        feedback={feedback}
        currentUserId={currentUserId}
        canLeaveFeedback={attended}
        onFeedbackAdded={handleFeedbackAdded}
        onFeedbackDeleted={handleFeedbackDeleted}
      />

      {/* Floating registration button — hides on scroll down, reappears on scroll up */}
      {!alreadyRegistered && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 w-[calc(100%-3rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
            showButton
              ? "translate-y-0 opacity-100"
              : "translate-y-24 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting
              ? "Submitting..."
              : event.requiresApproval
              ? "Request to Join"
              : "Confirm Registration"}
          </button>
        </div>
      )}
    </main>
  );
}