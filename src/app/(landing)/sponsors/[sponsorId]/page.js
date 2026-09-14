"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaBuilding } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocialLinksDisplay from "@/components/shared/SocialLinksDisplay";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function SponsorDetailsPage() {
  const { sponsorId } = useParams();
  const router = useRouter();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!sponsorId) return;
    apiClient
      .get(`/sponsors/${sponsorId}`)
      .then((res) => setSponsor(res.data.sponsor))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [sponsorId]);

  return (
    <main>
      {/* <Navbar /> */}

      <section className="relative overflow-hidden bg-[var(--bg-main)] min-h-[70vh]">
        <div
          className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "var(--Background-Circle-color-1)",
            opacity: "var(--Background-Circle-opacity-1)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "var(--Background-Circle-color-3)",
            opacity: "var(--Background-Circle-opacity-3)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-10"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

          {loading && (
            <div className="grid md:grid-cols-2 gap-12 items-center animate-pulse">
              <div className="h-80 md:h-[420px] rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)]" />
              <div className="space-y-4">
                <div className="h-4 w-24 bg-[var(--bg-card)] rounded-full" />
                <div className="h-10 w-3/4 bg-[var(--bg-card)] rounded-lg" />
                <div className="h-4 w-full bg-[var(--bg-card)] rounded-lg" />
                <div className="h-4 w-5/6 bg-[var(--bg-card)] rounded-lg" />
                <div className="h-4 w-2/3 bg-[var(--bg-card)] rounded-lg" />
              </div>
            </div>
          )}

          {!loading && notFound && (
            <div className="text-center py-20">
              <p className="text-[var(--text-secondary)] text-lg mb-2">
                Sponsor not found.
              </p>
              <p className="text-[var(--text-muted)] text-sm">
                It may have been removed.
              </p>
            </div>
          )}

          {!loading && sponsor && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: image */}
              <div className="relative h-80 md:h-[420px] rounded-[var(--radius-xl-value)] overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-lg-value)] flex items-center justify-center p-10">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]">
                    <div className="h-10 w-10 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                  </div>
                )}

                {imageError ? (
                  <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                    <FaBuilding className="text-4xl" />
                    <span className="text-sm">{sponsor.name}</span>
                  </div>
                ) : (
                  <img
                    src={`${FILE_BASE_URL}${sponsor.image}`}
                    alt={sponsor.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={`max-h-full max-w-full object-contain transition-opacity duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Right: info */}
              <div>
                {sponsor.sector && (
                  <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
                    {sponsor.sector}
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-[var(--text-primary)] mb-3">
                  {sponsor.name}
                </h1>
                {sponsor.title && (
                  <h2 className="text-lg md:text-xl text-[var(--text-secondary)] font-medium mb-6">
                    {sponsor.title}
                  </h2>
                )}
                <p className="text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {sponsor.description || "No description available yet."}
                </p>

                <SocialLinksDisplay socialLinks={sponsor.socialLinks} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}