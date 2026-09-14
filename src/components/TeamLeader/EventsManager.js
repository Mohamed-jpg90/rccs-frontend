"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { getFileUrl } from "@/lib/files";
import EntityCard from "@/components/UI/EntityCard";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import EventFormModal from "./EventFormModal";

export default function EventsManager({ clubId, events: initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const openCreate = () => { setEditingEvent(null); setFormOpen(true); };
  const openEdit = (event) => { setEditingEvent(event); setFormOpen(true); };
  const closeForm = () => setFormOpen(false);

  const handleSaved = (savedEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e._id === savedEvent._id);
      return exists ? prev.map((e) => (e._id === savedEvent._id ? savedEvent : e)) : [...prev, savedEvent];
    });
    toast.success(editingEvent ? "Event updated" : "Event created");
  };

  // ConfirmDeleteDialog awaits this itself, manages the loading state,
  // and catches whatever it throws to show inline — so this just needs
  // to do the request and update local state, no try/catch/toast here.
  const handleDelete = async () => {
    await apiClient.delete(`/events/${deletingEvent._id}`);
    setEvents((prev) => prev.filter((e) => e._id !== deletingEvent._id));
    toast.success("Event deleted");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Events</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
          <FaPlus className="text-xs" /> Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No events yet — create your first one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
       {events.map((event) => {
  const eventDate = new Date(event.date);
  return (
    <EntityCard
      key={event._id}
      href={`/team-leader/dashboard/events/${event._id}`}
      image={getFileUrl(event.coverImage)}
      imageAlt={event.title}
      title={event.title}
      description={event.description}
      dateBadge={{ day: eventDate.getDate(), month: eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase() }}
      meta={[{ icon: FaClock, text: event.time }, { icon: FaMapMarkerAlt, text: event.location }]}
      actions={[
        { icon: FaEdit, onClick: () => openEdit(event), label: "Edit" },
        { icon: FaTrash, onClick: () => setDeletingEvent(event), label: "Delete", variant: "danger" },
      ]}
    />
  );
})}
        </div>
      )}

      <EventFormModal
        isOpen={formOpen}
        onClose={closeForm}
        clubId={clubId}
        event={editingEvent}
        onSaved={handleSaved}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDelete}
        itemName={deletingEvent?.title}
      />
    </section>
  );
}