  import Link from "next/link";
  import { memo } from "react";

  /**
   * Reusable card for Clubs, Events, and Badges.
   *
   * dateBadge: { day: "01", month: "SEP" } -> floating ticket-stub, top-right (events)
   * progress: { value, max, label } -> capacity bar under description (clubs)
   * tag: floating chip, top-left, over the image
   */
  function EntityCard({
    href,
    image,
    imageAlt = "",
    tag,
    dateBadge,
    title,
    description,
    meta = [], // [{ icon: IconComponent, text: string }]
    progress,
    actionLabel,
    onAction,
    footer,
    onClick,
    actions = [],
  }) {
    const CardInner = (
      <div className="group relative flex flex-col h-full rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg-value)] hover:border-[var(--primary)]/50">
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-[var(--bg-hover)]">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--bg-hover)]" />
          )}

          {/* Gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {tag && (
            <span className="absolute top-3 left-3 bg-[var(--bg-surface)]/95 backdrop-blur-sm text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {tag}
            </span>
          )}

          {dateBadge && (
            <div className="absolute top-3 right-3 w-12 rounded-lg overflow-hidden shadow-md text-center">
              <div className="bg-[var(--primary)] text-[var(--text-white)] text-[9px] font-semibold uppercase tracking-wide py-1">
                {dateBadge.month}
              </div>
              <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] font-display font-bold text-lg leading-none py-1.5">
                {dateBadge.day}
              </div>
            </div>
          )}
  {actions && actions.length > 0 && (
    <div className="absolute top-3 right-3 flex gap-2 z-10">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // stops the card's own <Link> from firing
            action.onClick();
          }}
          className="h-8 w-8 rounded-full bg-[var(--bg-surface)]/95 backdrop-blur-sm flex items-center justify-center text-sm shadow-sm hover:scale-105 transition-transform"
          style={{ color: action.variant === "danger" ? "var(--danger)" : "var(--primary)" }}
          title={action.label}
        >
          <action.icon />
        </button>
      ))}
    </div>
  )}
          {/* Title floats over the image bottom */}
          <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-semibold text-white drop-shadow-sm truncate">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {description && (
            <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {meta.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4 flex-wrap">
              {meta.map((m, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {m.icon && <m.icon className="text-[var(--primary)]" />}
                  {m.text}
                </span>
              ))}
            </div>
          )}

          {progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                <span>{progress.label}</span>
                <span className="font-medium text-[var(--text-secondary)]">
                  {progress.value}/{progress.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (progress.value / progress.max) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-auto">
            {footer ? (
              footer
            ) : actionLabel ? (
              <button
                onClick={onAction}
                className="w-full text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-white)] py-2.5 rounded-full transition-colors"
              >
                {actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {CardInner}
      </Link>
    );
  }

 if (onClick) {
  return (
    <div
      onClick={() => {
        console.log("EntityCard clicked");
        onClick();
      }}
      className="block h-full cursor-pointer"
    >
      {CardInner}
    </div>
  );
}

  return CardInner;
  }

  export default memo(EntityCard);