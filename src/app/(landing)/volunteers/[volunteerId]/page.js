"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaUser, FaEnvelope, FaLink } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocialLinksDisplay from "@/components/shared/SocialLinksDisplay";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://rccs-backend-production.up.railway.app";

export default function VolunteerDetailsPage() {
  const { volunteerId } = useParams();
  const router = useRouter();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!volunteerId) return;
    apiClient
      .get(`/volunteers/${volunteerId}`)
      .then((res) => setVolunteer(res.data.volunteer))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [volunteerId]);

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
                Volunteer not found.
              </p>
              <p className="text-[var(--text-muted)] text-sm">
                They may have been removed.
              </p>
            </div>
          )}

          {!loading && volunteer && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: photo */}
              <div className="relative h-80 md:h-[420px] rounded-[var(--radius-xl-value)] overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-lg-value)]">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]">
                    <div className="h-10 w-10 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                  </div>
                )}

                {imageError ? (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
                    <FaUser className="text-4xl" />
                    <span className="text-sm">{volunteer.name}</span>
                  </div>
                ) : (
                  <img
                    src={`${FILE_BASE_URL}${volunteer.image}`}
                    alt={volunteer.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Right: info */}
              <div>
                <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
                  Volunteer
                </span>
                <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-[var(--text-primary)] mb-4">
                  {volunteer.name}
                </h1>

                {volunteer.email && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                    <FaEnvelope className="text-[var(--primary)] text-xs" />
                    {volunteer.email}
                  </div>
                )}

                {volunteer.linkedUser && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
                    <FaLink className="text-[var(--primary)] text-xs" />
                    Has an account on the platform
                  </div>
                )}

                <p className="text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line mt-4">
                  {volunteer.description || "No description available yet."}
                </p>

                <SocialLinksDisplay socialLinks={volunteer.socialLinks} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}