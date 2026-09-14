import { FaPlus, FaMinus } from "react-icons/fa";

export default function PointsHistory({ history = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Ledger
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        Points History
      </h2>

      {history.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No point transactions yet.
        </p>
      ) : (
        <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] divide-y divide-[var(--border-light)]">
          {history.map((tx) => {
            const isEarn = tx.type === "Earn";
            return (
              <div
                key={tx._id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs"
                    style={{
                      background: isEarn ? "var(--success-bg)" : "var(--danger-bg)",
                      color: isEarn ? "var(--success)" : "var(--danger)",
                    }}
                  >
                    {isEarn ? <FaPlus /> : <FaMinus />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {tx.reason}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: isEarn ? "var(--success)" : "var(--danger)" }}
                >
                  {isEarn ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}