import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function ClubEventsSection({ events = [] }) {
  if (events.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Upcoming
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-8">
        Events from this club
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventDate = new Date(event.date);
          return (
            <EntityCard
              key={event._id}
              href={`/events/${event._id}/register`}
              image={getFileUrl(event.coverImage)}
              imageAlt={event.title}
              title={event.title}
              description={event.description}
              dateBadge={{
                day: eventDate.getDate(),
                month: eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
              }}
              meta={[
                { icon: FaClock, text: event.time },
                { icon: FaMapMarkerAlt, text: event.location },
              ]}
            />
          );
        })}
      </div>
    </section>
  );
}