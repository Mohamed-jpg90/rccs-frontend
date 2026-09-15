"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://rccs-backend-production.up.railway.app";

// How many times to repeat the sponsor list so the track is always
// comfortably wider than the screen — otherwise the loop looks like it
// "stops" with a gap when there are only a few sponsors.
const MIN_TRACK_ITEMS = 16;

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroredIds, setErroredIds] = useState({});
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get("/sponsors/images", { params: { limit: 30 } })
      .then((res) => setSponsors(res.data.sponsors || []))
      .catch((err) => console.error("Error fetching sponsors:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && sponsors.length === 0) return null;

  // Repeat the list until it's long enough, then duplicate that whole
  // stretch once more (track scrolls exactly -50%, so it must contain
  // two identical, sufficiently-wide halves to loop seamlessly).
  const repeatCount = sponsors.length
    ? Math.max(1, Math.ceil(MIN_TRACK_ITEMS / sponsors.length))
    : 1;
  const half = Array.from({ length: repeatCount }, () => sponsors).flat();
  const track = [...half, ...half];

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div
        className="absolute -bottom-32 right-1/4 h-[320px] w-[320px] rounded-full blur-3xl pointer-events-none"
        style={{
        //   background: "var(--Background-Circle-color-1)",
        //   opacity: "var(--Background-Circle-opacity-2)",
        }}
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-[var(--bg-surface)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-[var(--bg-surface)] to-transparent" />

        {loading ? (
          <div className="flex gap-6 px-6 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="sponsor-marquee-wrapper">
            <div
              className="sponsor-marquee-track"
              style={{ "--sponsor-count": track.length }}
            >
              {track.map((sponsor, index) => (
                <button
                  key={`${sponsor._id}-${index}`}
                  onClick={() => router.push(`/sponsors/${sponsor._id}`)}
                  title={sponsor.name}
                  className="shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm-value)] flex items-center justify-center p-3 transition-all duration-300  hover:shadow-[var(--shadow-lg-value)] hover:border-[var(--primary)]"
                >
                  {erroredIds[`${sponsor._id}-${index}`] ? (
                    <span className="text-xs text-[var(--text-muted)] text-center leading-tight">
                      {sponsor.name}
                    </span>
                  ) : (
                    <img
                      src={`${FILE_BASE_URL}${sponsor.image}`}
                      alt={sponsor.name}
                      loading="lazy"
                      onError={() =>
                        setErroredIds((prev) => ({ ...prev, [`${sponsor._id}-${index}`]: true }))
                      }
                      className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sponsor-marquee-wrapper {
          overflow: hidden;
          width: 100%;
        }
        .sponsor-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          padding: 0 1.5rem;
          animation: sponsor-scroll 40s linear infinite;
        }
        .sponsor-marquee-wrapper:hover .sponsor-marquee-track {
          animation-play-state: paused;
        }
        @keyframes sponsor-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}