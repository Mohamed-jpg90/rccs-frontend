// import React from 'react'
// import { MdOutlinePeople, MdEdit, MdDeleteOutline } from 'react-icons/md'
// import Card from '../shared/CardEvent'

// /**
//  * ClubCard — same visual language as EventCard (image bg + glass footer),
//  * with edit/delete actions in the top slot.
//  */
// export default function ClubCard({ club, baseUrl = '', onEdit, onDelete, onClick }) {
//   if (!club) return null

//   const { clubName, description, coverImage, maxMembers, currentMembersCount } = club

//   const imageSrc = `${baseUrl}${coverImage}`
//   const percentFilled = maxMembers > 0 ? Math.min((currentMembersCount / maxMembers) * 100, 100) : 0
//   const isFull = currentMembersCount >= maxMembers
//   const available = Math.max(maxMembers - currentMembersCount, 0)

//   return (
//     <Card
//       image={imageSrc}
//       onClick={onClick}
//       topSlot={
//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation()
//               onEdit?.(club)
//             }}
//             aria-label="Edit club"
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
//           >
//             <MdEdit className="text-sm" />
//           </button>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation()
//               onDelete?.(club)
//             }}
//             aria-label="Delete club"
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--danger)]/80 text-white backdrop-blur-sm transition-colors hover:bg-[var(--danger)]"
//           >
//             <MdDeleteOutline className="text-sm" />
//           </button>
//         </div>
//       }
//       footer={
//         <div className="flex flex-col gap-3 text-white">
//           <h3 className="text-lg font-bold leading-tight">{clubName}</h3>
//           {description && <p className="line-clamp-2 text-sm text-white/70">{description}</p>}

//           <div className="flex flex-col gap-1.5 pt-1">
//             <div className="flex items-center justify-between text-xs">
//               <span className="flex items-center gap-1.5 text-white/80">
//                 <MdOutlinePeople className="text-sm" />
//                 {currentMembersCount}/{maxMembers} members
//               </span>
//               <span className={`font-semibold ${isFull ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
//                 {isFull ? 'Full' : `${available} spots left`}
//               </span>
//             </div>
//             <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
//               <div
//                 className={`h-full rounded-full ${isFull ? 'bg-[var(--danger)]' : 'bg-[var(--success)]'}`}
//                 style={{ width: `${percentFilled}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       }
//     />
//   )
// }


import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";

export default function ClubCard({ club, baseUrl, onClick, onEdit, onDelete }) {
  const imageSrc = club.coverImage
    ? club.coverImage.startsWith("http")
      ? club.coverImage
      : `${baseUrl}${club.coverImage}`
    : undefined;

  const spotsLeft = (club.maxMembers ?? 0) - (club.currentMembersCount ?? 0);

  const actions = [];
  if (onEdit) actions.push({ icon: FaEdit, onClick: () => onEdit(club), label: "Edit" });
  if (onDelete) actions.push({ icon: FaTrash, onClick: () => onDelete(club), label: "Delete", variant: "danger" });

  return (
    <EntityCard
      image={imageSrc}
      imageAlt={club.clubName}
      title={club.clubName}
      description={club.description}
      onClick={() => onClick?.(club)}
      actions={actions}
      progress={{
        value: club.currentMembersCount ?? 0,
        max: club.maxMembers ?? 0,
        label: "Members",
      }}
      meta={[
        {
          icon: FaUsers,
          text: spotsLeft > 0 ? `${spotsLeft} spots left` : "Full",
        },
      ]}
    />
  );
}