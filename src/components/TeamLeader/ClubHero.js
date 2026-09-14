"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { getFileUrl } from "@/lib/files";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/Auth/FormField";

export default function ClubHero({ club, onUpdated }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <section className="relative h-[320px] md:h-[380px] w-full overflow-hidden">
      <img src={getFileUrl(club.coverImage)} alt={club.clubName} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-10 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold mb-2">{club.clubName}</h1>
            <p className="text-white/80 max-w-xl leading-relaxed">{club.description}</p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            <FaEdit /> Edit Club
          </button>
        </div>
      </div>

      <EditClubModal club={club} open={editOpen} onClose={() => setEditOpen(false)} onUpdated={onUpdated} />
    </section>
  );
}

function EditClubModal({ club, open, onClose, onUpdated }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clubName: club.clubName,
      description: club.description,
      maxMembers: club.maxMembers,
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clubName", data.clubName);
      formData.append("description", data.description);
      formData.append("maxMembers", data.maxMembers);
      if (data.coverImage?.[0]) formData.append("coverImage", data.coverImage[0]);

      const res = await apiClient.put(`/clubs/${club._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Club updated");
      onUpdated(res.data.club);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update club");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Club">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Club Name" error={errors.clubName} {...register("clubName", { required: "Required" })} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Description</label>
          <textarea
            rows={3}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
            {...register("description", { required: "Required" })}
          />
          {errors.description && <span className="text-xs text-[var(--danger)]">{errors.description.message}</span>}
        </div>
        <FormField
          label="Max Members"
          type="number"
          error={errors.maxMembers}
          {...register("maxMembers", { required: "Required", min: 1 })}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Cover Image</label>
          <input type="file" accept="image/*" {...register("coverImage")} className="text-sm text-[var(--text-secondary)]" />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-full font-medium disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}