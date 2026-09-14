import { FaBookOpen, FaTheaterMasks, FaUsers } from "react-icons/fa";

const INFO_CARDS = [
  {
    icon: FaBookOpen,
    title: "Language & Heritage",
    text: "From beginner Russian classes to literature circles, our programs keep centuries of storytelling alive for every generation.",
  },
  {
    icon: FaTheaterMasks,
    title: "Arts & Performance",
    text: "Music, dance, and theater clubs give members a stage to practice, perform, and pass on craft that took a lifetime to learn.",
  },
  {
    icon: FaUsers,
    title: "A Home Away From Home",
    text: "Hundreds of members meet weekly across our clubs — building friendships that outlast any single event.",
  },
];

export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
          About the Center
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
          More than a building — a community
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Featured quote card */}
        <div className="md:col-span-2 rounded-[var(--radius-xl-value)] bg-[var(--primary)] p-8 md:p-10 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "var(--Background-Circle-color-2)", opacity: 0.3 }}
          />
          <p className="relative font-display text-xl md:text-2xl leading-snug text-[var(--text-white)] max-w-2xl">
            "The Russian Cultural Center exists so that language, art, and
            tradition remain living things — carried forward by the people
            who gather here each week."
          </p>
          <span className="relative block mt-4 text-sm text-[var(--text-white)]/70">
            — RCS Community
          </span>
        </div>

        {/* Info cards */}
        {INFO_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-md-value)] hover:-translate-y-1"
          >
            <div className="h-11 w-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4">
              <card.icon className="text-[var(--primary)] text-lg" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}