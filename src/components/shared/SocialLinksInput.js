"use client";

import { FaInstagram, FaTiktok, FaLinkedin, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";

const FIELDS = [
  { key: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/..." },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://tiktok.com/@..." },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/..." },
  { key: "facebook", label: "Facebook", icon: FaFacebook, placeholder: "https://facebook.com/..." },
  { key: "twitter", label: "Twitter / X", icon: FaTwitter, placeholder: "https://x.com/..." },
  { key: "website", label: "Website", icon: FaGlobe, placeholder: "https://..." },
];

export default function SocialLinksInput({ value, onChange }) {
  const handleFieldChange = (key, fieldValue) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        Social Media <span className="text-[var(--text-muted)] font-normal">(all optional)</span>
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center">
              <Icon className="text-[var(--text-muted)] text-sm" />
            </div>
            <input
              type="url"
              value={value[key] || ""}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 px-3.5 py-2 text-sm rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}