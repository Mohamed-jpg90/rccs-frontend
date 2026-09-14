import React from "react";
import { FaUsers, FaUserTie, FaMedal } from "react-icons/fa";
import { MdGroups, MdEvent, MdEventAvailable, MdFactCheck } from "react-icons/md";
import DataCard from "./DataCard";

/**
 * DashboardStats — renders the top-level metric cards from the
 * dashboard summary endpoint.
 *
 * Expects the raw API response shape, e.g.:
 * {
 *   totalUsers, totalTeamLeaders, totalClubs, totalEvents,
 *   upcomingEvents, attendanceRate, totalBadgesAwarded, ...
 * }
 */
export default function DashboardStats({ data }) {
  if (!data) return null;

  const stats = [
    {
      icon: FaUsers,
      label: "Total Users",
      value: data.totalUsers,
    },
    {
      icon: FaUserTie,
      label: "Team Leaders",
      value: data.totalTeamLeaders,
    },
    {
      icon: MdGroups,
      label: "Total Clubs",
      value: data.totalClubs,
    },
    {
      icon: MdEvent,
      label: "Total Events",
      value: data.totalEvents,
    },
    {
      icon: MdEventAvailable,
      label: "Upcoming Events",
      value: data.upcomingEvents,
    },
    {
      icon: MdFactCheck,
      label: "Attendance Rate",
      value: `${data.attendanceRate ?? 0}%`,
    },
    {
      icon: FaMedal,
      label: "Badges Awarded",
      value: data.totalBadgesAwarded,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DataCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value ?? 0}
        />
      ))}
    </div>
  );
}