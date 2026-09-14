export default function StorySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
        <div>
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
            Our Story
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            Where it began
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            The Russian Cultural Center was founded by a small group of
            volunteers who wanted a place where language and tradition could
            be shared, not just remembered. What started as informal weekend
            meetups grew into a full community with dedicated clubs, regular
            events, and a home of its own.
          </p>
          <p>
            Today, the center runs entirely on the people who show up for
            it — members who teach, organize, perform, and welcome newcomers
            every week. Every club, badge, and event on this platform exists
            because someone in this community decided it should.
          </p>
        </div>
      </div>
    </section>
  );
}