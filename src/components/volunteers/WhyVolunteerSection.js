import { FaHeart, FaUsers, FaSeedling, FaMedal } from "react-icons/fa";

const REASONS = [
  {
    icon: FaHeart,
    title: "Make a real impact",
    description: "Your time directly shapes events, clubs, and experiences that bring the community together.",
  },
  {
    icon: FaUsers,
    title: "Build connections",
    description: "Meet people who care about the same things you do, and grow a network that lasts beyond one event.",
  },
  {
    icon: FaSeedling,
    title: "Grow new skills",
    description: "Organizing, leading, and problem-solving on the ground teaches things no classroom can.",
  },
  {
    icon: FaMedal,
    title: "Get recognized",
    description: "Every contribution is seen — volunteers are celebrated here, not forgotten after the event ends.",
  },
];

export default function WhyVolunteerSection() {
  return (
    <section className="relative bg-[var(--bg-main)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-4">
            Why It Matters
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4">
            Volunteering isn't just giving time —
            <br className="hidden md:block" /> it's building something bigger.
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Behind every club meeting, every event, every celebration at the center,
            there's a volunteer who made it possible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] p-6 shadow-[var(--shadow-sm-value)] hover:shadow-[var(--shadow-lg-value)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-5 group-hover:bg-[var(--primary)] transition-colors">
                <reason.icon className="text-[var(--primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}