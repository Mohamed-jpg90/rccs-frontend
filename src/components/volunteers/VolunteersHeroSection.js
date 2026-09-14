"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaHandsHelping } from "react-icons/fa";
import img1 from '../../images/download.jpg'
import img2 from '../../images/download2.jpg'
import img3 from '../../images/download3.jpg'

// Replace these with your real photos — drop them in /public/volunteers-hero/
// and swap the paths below. `highlight` is the word/phrase from the title
// that gets the primary-color gradient treatment.
const DEFAULT_SLIDES = [
  {
    image: img1,
    title: "Hands that build",
    highlight: "community.",
    subtitle: "Every event you see here was made possible by people who showed up.",
  },
  {
    image: img2,
    title: "Giving time,",
    highlight: "leaving impact.",
    subtitle: "Our volunteers turn ideas into moments people remember.",
  },
  {
    image: img3,
    title: "Small hands,",
    highlight: "big change.",
    subtitle: "From setup to sunset, they're the ones who make it happen.",
  },
];

export default function VolunteersHeroSection({ slides = DEFAULT_SLIDES }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[current];

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-[var(--bg-main)]">
      {/* Crossfading background photos */}
      {slides.map((slide, index) => (
        <div
         key={index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
  src={slide.image.src}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          {/* Gradient scrim for text legibility — dark at bottom-left, fading out */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-20 md:pb-28">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/80 mb-5">
          <FaHandsHelping className="text-[var(--primary)]" />
          Our Volunteers
        </span>

        <div key={current} className="volunteer-hero-fade max-w-2xl">
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.08] text-white mb-5">
            {activeSlide.title}{" "}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]"
            >
              {activeSlide.highlight}
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/85 max-w-lg leading-relaxed mb-8">
            {activeSlide.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="#volunteers-list"
            className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-6 py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
          >
            Meet the Volunteers
            <FaArrowRight className="text-sm" />
          </Link>

          {/* dots */}
          {slides.length > 1 && (
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current ? "w-6 bg-[var(--primary)]" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .volunteer-hero-fade {
          animation: hero-fade-up 0.7s ease-out;
        }
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}