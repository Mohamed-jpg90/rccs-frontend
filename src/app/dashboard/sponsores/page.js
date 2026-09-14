"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { SponsorFormModal, DeleteSponsorModal, SponsorsGrid } from "@/components/sponsors";

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/sponsors");
      setSponsors(res.data.sponsors || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const openCreateModal = () => {
    setEditingSponsor(null);
    setFormModalOpen(true);
  };

  const openEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingSponsor) {
        const res = await apiClient.put(`/sponsors/${editingSponsor._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSponsors((prev) =>
          prev.map((s) => (s._id === editingSponsor._id ? res.data.sponsor : s))
        );
        toast.success("Sponsor updated successfully");
      } else {
        const res = await apiClient.post("/sponsors", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSponsors((prev) => [res.data.sponsor, ...prev]);
        toast.success("Sponsor added successfully");
      }
      setFormModalOpen(false);
      setEditingSponsor(null);
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
      await apiClient.delete(`/sponsors/${deleteTarget._id}`);
      setSponsors((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Sponsor deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sponsor");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            Sponsors
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage the companies and sectors sponsoring the center.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-5 py-2.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
        >
          <FaPlus className="text-sm" />
          Add Sponsor
        </button>
      </div>

      <SponsorsGrid
        sponsors={sponsors}
        loading={loading}
        onEdit={openEditModal}
        onDelete={(sponsor) => setDeleteTarget(sponsor)}
      />

      <SponsorFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingSponsor(null);
        }}
        onSubmit={handleSubmit}
        sponsor={editingSponsor}
        submitting={submitting}
      />

      <DeleteSponsorModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        sponsor={deleteTarget}
        deleting={deleting}
      />
    </div>
  );
}