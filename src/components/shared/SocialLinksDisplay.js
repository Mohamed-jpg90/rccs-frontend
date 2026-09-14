import { FaInstagram, FaTiktok, FaLinkedin, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";

const ICON_MAP = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  twitter: FaTwitter,
  website: FaGlobe,
};

// Normalizes a link so users can type "instagram.com/x" without "https://"
const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
};

export default function SocialLinksDisplay({ socialLinks }) {
  if (!socialLinks) return null;

  const activeLinks = Object.entries(socialLinks).filter(([, url]) => url && url.trim());

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 mt-5">
      {activeLinks.map(([platform, url]) => {
        const Icon = ICON_MAP[platform];
        if (!Icon) return null;

        return (
          <a
            key={platform}
            href={normalizeUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:-translate-y-0.5 shadow-[var(--shadow-sm-value)] transition-all duration-200"
          >
            <Icon className="text-base" />
          </a>
        );
      })}
    </div>
  );
}