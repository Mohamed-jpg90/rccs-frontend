"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { VolunteerFormModal, DeleteVolunteerModal, VolunteersGrid } from "@/components/volunteers";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/volunteers");
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const openCreateModal = () => {
    setEditingVolunteer(null);
    setFormModalOpen(true);
  };

  const openEditModal = (volunteer) => {
    setEditingVolunteer(volunteer);
    setFormModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingVolunteer) {
        const res = await apiClient.put(`/volunteers/${editingVolunteer._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVolunteers((prev) =>
          prev.map((v) => (v._id === editingVolunteer._id ? res.data.volunteer : v))
        );
        toast.success("Volunteer updated successfully");
      } else {
        const res = await apiClient.post("/volunteers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVolunteers((prev) => [res.data.volunteer, ...prev]);
        toast.success("Volunteer added successfully");
      }
      setFormModalOpen(false);
      setEditingVolunteer(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/volunteers/${deleteTarget._id}`);
      setVolunteers((prev) => prev.filter((v) => v._id !== deleteTarget._id));
      toast.success("Volunteer deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete volunteer");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            Volunteers
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage the people who volunteered their time and effort.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-5 py-2.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
        >
          <FaPlus className="text-sm" />
          Add Volunteer
        </button>
      </div>

      <VolunteersGrid
        volunteers={volunteers}
        loading={loading}
        onEdit={openEditModal}
        onDelete={(volunteer) => setDeleteTarget(volunteer)}
      />

      <VolunteerFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingVolunteer(null);
        }}
        onSubmit={handleSubmit}
        volunteer={editingVolunteer}
        submitting={submitting}
      />

      <DeleteVolunteerModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        volunteer={deleteTarget}
        deleting={deleting}
      />
    </div>
  );
}