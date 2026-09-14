"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import SponsorsSection from "./SponsorsSection";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function HeroSection({ events = [], onRegister }) {
  const [current, setCurrent] = useState(0);
  const visible = events.slice(0, 5);

  useEffect(() => {
    if (visible.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % visible.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [visible.length]);

  const activeEvent = visible[current];

  return (
    <section className="relative overflow-hidden bg-[var(--bg-main)]">
      {/* Ambient background circles — uses your design tokens */}
      <div
        className="absolute -top-24 -left-24 h-[400px] w-[420px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-1)",
          opacity: "var(--Background-Circle-opacity-1)",
          animation: "float-slow 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-2)",
          opacity: "var(--Background-Circle-opacity-2)",
          animation: "float-slow 18s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-3)",
          opacity: "var(--Background-Circle-opacity-3)",
          animation: "float-slow 16s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-14 items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
            Upcoming at the Center
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-[var(--text-primary)] mb-6">
            Where culture <br /> becomes community.
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            Language nights, music, art, and gatherings across every club at
            the Russian Cultural Center — join the ones that speak to you.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-6 py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
            >
              Explore Events
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-secondary)] px-6 py-3.5 rounded-full font-medium transition-colors"
            >
              Browse Clubs
            </Link>
          </div>
        </div>

        {/* Right: stacked event photo deck */}
        <div className="relative h-[420px] md:h-[460px] flex items-center justify-center">
          {visible.length === 0 && (
            <div className="text-[var(--text-muted)] text-sm">
              No upcoming events right now — check back soon.
            </div>
          )}

          {visible.map((event, index) => {
            const offset =
              (index - current + visible.length) % visible.length;
            const isFront = offset === 0;
            const isSecond = offset === 1;
            const isThird = offset === 2;
            const hidden = offset > 2;

            return (
              <div
                key={event._id}
                onClick={() => setCurrent(index)}
                className={`absolute w-[280px] md:w-[320px] rounded-[var(--radius-xl-value)] overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-lg-value)] transition-all duration-500 ease-out cursor-pointer ${
                  hidden ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                style={{
                  transform: isFront
                    ? "translateY(0) rotate(0deg) scale(1)"
                    : isSecond
                    ? "translateY(18px) rotate(-6deg) scale(0.94) translateX(-24px)"
                    : isThird
                    ? "translateY(32px) rotate(6deg) scale(0.88) translateX(24px)"
                    : "translateY(40px) scale(0.8)",
                  zIndex: isFront ? 30 : isSecond ? 20 : isThird ? 10 : 0,
                }}
              >
                <div className="relative h-44 md:h-48 w-full">
                  <img
                    src={`${FILE_BASE_URL}${event.coverImage}`}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  {event.club && (
                    <span className="absolute top-3 left-3 bg-[var(--bg-surface)]/90 backdrop-blur-sm text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full">
                      {event.club.clubName}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-1.5 truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      {event.location}
                    </span>
                  </div>

                  {isFront && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegister(event._id);
                      }}
                      className="w-full text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-white)] py-2.5 rounded-full transition-colors"
                    >
                      {event.requiresApproval ? "Request to Join" : "Register"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* dots */}
      {visible.length > 1 && (
        <div className="relative z-10 flex justify-center gap-2 pb-10">
          {visible.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6 bg-[var(--primary)]"
                  : "w-1.5 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      )}

  <SponsorsSection/>

    </section>
  );
}