"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import SocialLinksInput from "@/components/shared/SocialLinksInput";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

const EMPTY_FORM = { name: "", title: "", description: "", sector: "" };
const EMPTY_SOCIAL = { instagram: "", tiktok: "", linkedin: "", facebook: "", twitter: "", website: "" };

export default function SponsorFormModal({ open, onClose, onSubmit, sponsor, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [socialLinks, setSocialLinks] = useState(EMPTY_SOCIAL);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEditMode = Boolean(sponsor);

  useEffect(() => {
    if (!open) return;
    if (sponsor) {
      setForm({
        name: sponsor.name || "",
        title: sponsor.title || "",
        description: sponsor.description || "",
        sector: sponsor.sector || "",
      });
      setSocialLinks({ ...EMPTY_SOCIAL, ...(sponsor.socialLinks || {}) });
      setPreview(sponsor.image ? `${FILE_BASE_URL}${sponsor.image}` : null);
    } else {
      setForm(EMPTY_FORM);
      setSocialLinks(EMPTY_SOCIAL);
      setPreview(null);
    }
    setImageFile(null);
  }, [open, sponsor]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditMode && !imageFile) return;

    const data = new FormData();
    data.append("name", form.name);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("sector", form.sector);
    data.append("socialLinks", JSON.stringify(socialLinks));
    if (imageFile) data.append("image", imageFile);

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-lg-value)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {isEditMode ? "Edit Sponsor" : "Add Sponsor"}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Company Logo {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <label
              htmlFor="sponsor-image"
              className="flex flex-col items-center justify-center gap-2 h-36 rounded-[var(--radius-xl-value)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-colors overflow-hidden bg-[var(--bg-surface)]"
            >
              {preview ? (
                <img src={preview} alt="preview" className="h-full w-full object-contain p-3" />
              ) : (
                <>
                  <FaUpload className="text-[var(--text-muted)] text-xl" />
                  <span className="text-xs text-[var(--text-muted)]">Click to upload image</span>
                </>
              )}
            </label>
            <input
              id="sponsor-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Sector
            </label>
            <input
              type="text"
              name="sector"
              value={form.sector}
              onChange={handleChange}
              placeholder="e.g. Technology, Food & Beverage"
              className="w-full px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Short tagline shown on the details page"
              className="w-full px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell people about this sponsor..."
              className="w-full px-4 py-3 rounded-[var(--radius-xl-value)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
            />
          </div>

          <SocialLinksInput value={socialLinks} onChange={setSocialLinks} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Sponsor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}