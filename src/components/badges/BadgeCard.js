import { FaEdit, FaTrash, FaStar, FaUserPlus } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";

export default function BadgeCard({
  badge,
  baseUrl,
  onEdit,
  onDelete,
  onAssign,
  onClick,
}) {
  if (!badge) return null;

  const imageSrc = badge.badgeImage
    ? badge.badgeImage.startsWith("http")
      ? badge.badgeImage
      : `${baseUrl}${badge.badgeImage}`
    : undefined;

  const actions = [];

  if (onEdit) {
    actions.push({
      icon: FaEdit,
      label: "Edit",
      onClick: () => onEdit(badge),
    });
  }

  if (onDelete) {
    actions.push({
      icon: FaTrash,
      label: "Delete",
      variant: "danger",
      onClick: () => onDelete(badge),
    });
  }

  return (
    <EntityCard
      image={imageSrc}
      imageAlt={badge.badgeName}
      title={badge.badgeName}
      description={badge.description}
      onClick={() => onClick?.(badge)}
      actions={actions}
      meta={[
        {
          icon: FaStar,
          text: `${badge.points} pts`,
        },
        {
          icon: FaStar,
          text: `Requires ${badge.pointsRequired} pts`,
        },
      ]}
      footer={
        onAssign && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(badge);
            }}
            className="w-full rounded-full bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            <span className="flex items-center justify-center gap-2">
              <FaUserPlus />
              Assign
            </span>
          </button>
        )
      }
    />
  );
}