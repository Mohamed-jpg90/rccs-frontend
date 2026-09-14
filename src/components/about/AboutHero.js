import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import img from '../../images/Summer in Moscow.jpg'
export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-main)]">
      {/* Ambient circles — same signature as the rest of the site */}
      <div
        className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-1)",
          opacity: "var(--Background-Circle-opacity-1)",
        }}
      />
      <div
        className="absolute top-1/4 -right-32 h-[380px] w-[380px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-2)",
          opacity: "var(--Background-Circle-opacity-2)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-14 items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
            About the Center
          </span>

          {/* Split-color headline + gradient underline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.08] mb-3">
            <span className="text-[var(--text-primary)]">A space where </span>
            <span className="text-[var(--primary)]">heritage lives on.</span>
          </h1>

          <span
            className="block h-[5px] w-24 rounded-full mb-6"
            style={{
              background:
                "linear-gradient(90deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 80%, black) 100%)",
            }}
          />

          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            The Russian Cultural Center brings together language, art, and
            tradition under one roof — a home built by its members, for its
            members, since day one.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-6 py-3.5 rounded-full font-medium shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5"
            >
              Explore Clubs
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-secondary)] px-6 py-3.5 rounded-full font-medium transition-colors"
            >
              See Events
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="relative rounded-[var(--radius-xl-value)] overflow-hidden shadow-[var(--shadow-lg-value)] border border-[var(--border)]">
            <Image
              src={img}
              alt="Members gathered at the Russian Cultural Center"
              className="w-full h-[420px] md:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Floating stat chip */}
          <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg-value)] px-5 py-4 shadow-[var(--shadow-md-value)]">
            <span className="font-display text-2xl font-semibold text-[var(--primary)]">
              10+
            </span>
            <span className="text-xs text-[var(--text-muted)] leading-tight max-w-[90px]">
              years of building community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}