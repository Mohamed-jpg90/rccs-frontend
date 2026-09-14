const VALUES = [
  {
    title: "Open to everyone",
    text: "No background or fluency required to join — every club welcomes newcomers year-round.",
  },
  {
    title: "Led by members",
    text: "Team leaders come from within the community, not outside it — they know what members actually need.",
  },
  {
    title: "Built to last",
    text: "Every event, badge, and point exists to build habits that keep people coming back, not just once.",
  },
];

export default function ValuesSection() {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div
        className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "var(--Background-Circle-color-3)",
          opacity: "var(--Background-Circle-opacity-3)",
        }}
      />

      <div className="relative">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
            What We Stand For
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            Our values
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VALUES.map((value, i) => (
            <div
              key={value.title}
              className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-7"
            >
              <span className="font-display text-4xl font-semibold text-[var(--primary)]/30 mb-4 block">
                0{i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}