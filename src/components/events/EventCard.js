// import React from "react";
// import { MdLocationOn, MdOutlinePeople, MdEdit, MdDeleteOutline } from "react-icons/md";
// import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
// import Card from "../shared/CardEvent";

// const STATUS_STYLES = {
//   Upcoming: "bg-[var(--primary)] text-white",
//   Ongoing: "bg-[var(--success)] text-white",
//   Finished: "bg-white/20 text-white",
//   Cancelled: "bg-[var(--danger)] text-white",
// };

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// }

// function formatTime(time24) {
//   if (!time24) return null;
//   const [h, m] = time24.split(":").map(Number);
//   const period = h >= 12 ? "PM" : "AM";
//   const hour12 = h % 12 || 12;
//   return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
// }

// export default function EventCard({ event, baseUrl = "", registeredCount, onClick, onEdit, onDelete }) {
//   if (!event) return null;

//   const { title, description, coverImage, club, location, date, time, capacity, status } = event;
//   const registered = registeredCount ?? event.registeredCount ?? 0;
//   const available = Math.max(capacity - registered, 0);
//   const percentFilled = capacity > 0 ? Math.min((registered / capacity) * 100, 100) : 0;
//   const isFull = available === 0;
//   const imageSrc = coverImage ? `${baseUrl}${coverImage}` : null;

//   return (
//     <Card
//       image={imageSrc}
//       onClick={onClick}
//       topSlot={
//         <div className="flex w-full items-center justify-between gap-2">
//           {status ? (
//             <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm ${STATUS_STYLES[status] ?? "bg-white/20 text-white"}`}>
//               {status}
//             </span>
//           ) : <span />}
//           {(onEdit || onDelete) && (
//             <div className="flex gap-2">
//               {onEdit && (
//                 <button
//                   type="button"
//                   onClick={(e) => { e.stopPropagation(); onEdit(event) }}
//                   aria-label="Edit event"
//                   className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
//                 >
//                   <MdEdit className="text-sm" />
//                 </button>
//               )}
//               {onDelete && (
//                 <button
//                   type="button"
//                   onClick={(e) => { e.stopPropagation(); onDelete(event) }}
//                   aria-label="Delete event"
//                   className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--danger)]/80 text-white backdrop-blur-sm transition-colors hover:bg-[var(--danger)]"
//                 >
//                   <MdDeleteOutline className="text-sm" />
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       }
//       footer={
//         <div className="flex flex-col gap-3 text-white">
//           {club?.clubName && (
//             <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white/90">{club.clubName}</span>
//           )}
//           <div className="flex flex-col gap-1">
//             <h3 className="text-lg font-bold leading-tight">{title}</h3>
//             {description && <p className="line-clamp-2 text-sm text-white/70">{description}</p>}
//           </div>
//           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
//             <span className="flex items-center gap-1.5"><HiOutlineCalendar className="text-sm" />{formatDate(date)}</span>
//             {time && <span className="flex items-center gap-1.5"><HiOutlineClock className="text-sm" />{formatTime(time)}</span>}
//             {location && <span className="flex items-center gap-1.5"><MdLocationOn className="text-sm" />{location}</span>}
//           </div>
//           <div className="flex flex-col gap-1.5 pt-1">
//             <div className="flex items-center justify-between text-xs">
//               <span className="flex items-center gap-1.5 text-white/80"><MdOutlinePeople className="text-sm" />{registered}/{capacity} registered</span>
//               <span className={`font-semibold ${isFull ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
//                 {isFull ? "Full" : `${available} spots left`}
//               </span>
//             </div>
//             <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
//               <div className={`h-full rounded-full ${isFull ? "bg-[var(--danger)]" : "bg-[var(--success)]"}`} style={{ width: `${percentFilled}%` }} />
//             </div>
//           </div>
//         </div>
//       }
//     />
//   );
// }

'use client'

import { useState } from 'react'
import { FaEdit, FaTrash, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import EntityCard from '@/components/UI/EntityCard'
import EventFormModal from '@/components/events/EventFormModal'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'
import { apiClient } from '@/lib/api'
import { getFileUrl } from '@/lib/files'
import { isAdmin, isTeamLeader } from '@/lib/auth'

export default function EventCard({ event, registeredCount, onClick, onUpdated }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const canManage = isAdmin() || isTeamLeader()

  if (!event) return null

  const eventDate = new Date(event.date)
  const registered = registeredCount ?? event.registeredCount ?? 0
  const capacity = event.capacity ?? 0
  const isFull = capacity > 0 && registered >= capacity

  const handleSaved = () => {
    setEditOpen(false)
    onUpdated?.()
  }

  const handleDelete = async () => {
    await apiClient.delete(`/events/${event._id}`)
    toast.success('Event deleted')
    setDeleteOpen(false)
    onUpdated?.()
  }

  return (
    <>
      <EntityCard
        onClick={() => onClick?.(event)}
        image={getFileUrl(event.coverImage)}
        imageAlt={event.title}
        title={event.title}
        description={event.description}
        dateBadge={{
          day: eventDate.getDate(),
          month: eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        }}
        meta={[
          { icon: FaClock, text: event.time },
          { icon: FaMapMarkerAlt, text: event.location },
        ]}
        progress={
          capacity > 0
            ? {
                value: registered,
                max: capacity,
                label: isFull ? 'Full' : 'Registered',
              }
            : undefined
        }
        actions={
          canManage
            ? [
                { icon: FaEdit, onClick: () => setEditOpen(true), label: 'Edit' },
                { icon: FaTrash, onClick: () => setDeleteOpen(true), label: 'Delete', variant: 'danger' },
              ]
            : []
        }
      />

      <EventFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        event={event}
        onSaved={handleSaved}
      />

      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={event.title}
      />
    </>
  )
}