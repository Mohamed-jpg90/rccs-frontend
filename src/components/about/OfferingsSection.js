import { FaBookOpen, FaTheaterMasks, FaCalendarAlt, FaCertificate } from "react-icons/fa";

const OFFERINGS = [
  {
    icon: FaBookOpen,
    title: "Language Programs",
    text: "Structured Russian classes for every level, taught by native and fluent speakers from the community.",
  },
  {
    icon: FaTheaterMasks,
    title: "Arts & Clubs",
    text: "Music, dance, theater, and craft clubs where members practice a skill and perform for each other.",
  },
  {
    icon: FaCalendarAlt,
    title: "Cultural Events",
    text: "Seasonal celebrations, workshops, and gatherings that bring the whole center together throughout the year.",
  },
  {
    icon: FaCertificate,
    title: "Recognition",
    text: "Points, badges, and certificates that track real participation — not just attendance.",
  },
];

export default function OfferingsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
          What We Offer
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
          Four pillars, one community
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OFFERINGS.map((item) => (
          <div
            key={item.title}
            className="group rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-md-value)] hover:border-[var(--primary)]/40"
          >
            <div className="h-11 w-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-5 transition-colors group-hover:bg-[var(--primary)]">
              <item.icon className="text-[var(--primary)] text-lg transition-colors group-hover:text-[var(--text-white)]" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}