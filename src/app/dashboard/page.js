// import React from "react";
// import DashboardLayout from "@/components/layout/SideBar";
// import WelcomeBanner from "@/components/home/WelcomeBanner";
// import Calendar from "@/components/home/Calendar";
// const STATS = [
//   { label: "Total Members", value: "1,284" },
//   { label: "Active Events", value: "12" },
//   { label: "Attendance Rate", value: "92%" },
//   { label: "New Notifications", value: "6" },
// ];

// export default function App() {
//   return (
//     <DashboardLayout title="Dashboard">
//       {/* <div className="mb-6">
//         <h2 className="text-xl font-semibold text-[var(--text-primary)]">
//           Welcome back, Sarah
//         </h2>
//         <p className="mt-1 text-sm text-[var(--text-muted)]">
//           Here's what's happening today.
//         </p>
//       </div> */}

//       {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {STATS.map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-[var(--radius-lg-value)] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm-value)] transition-shadow duration-200 hover:shadow-[var(--shadow-md-value)]"
//           >
//             <p className="text-xs font-medium text-[var(--text-muted)]">
//               {stat.label}
//             </p>
//             <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
//               {stat.value}
//             </p>
//           </div>
//         ))}
//       </div> */}
// <div className=" grid grid-cols-2  " >

// <WelcomeBanner/>

// </div>


//     </DashboardLayout>
//   );
// }
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/SideBar";
import HiringNeedsCard from "@/components/home/HiringNeedsCard";
import UsersList from "@/components/home/UsersList";
import UserKpiList from "@/components/home/UserKpiList";
import Calendar from "@/components/home/Calendar";
import WelcomeBanner from "@/components/home/WelcomeBanner";

// Replace with data from your API (fetch/route handler, server action, etc.)
const INITIAL_HIRING_ROLES = [
  { title: "Content Designers", count: 3, candidates: 5, percent: 75, color: "var(--danger)" },
  { title: "Node.js Developers", count: 9, candidates: 12, percent: 25, color: "var(--warning)" },
  { title: "Senior UI Designer", count: 1, candidates: 0, percent: 0, color: "var(--border)" },
  { title: "Marketing Managers", count: 2, candidates: 10, percent: 45, color: "var(--info)" },
];

const INITIAL_USERS = [
  {
    id: 1,
    name: "Katie Morgan",
    email: "katie@company.com",
    avatar: null,
    role: "Admin",
    blocked: false,
    attendance: 96,
    kpi: 92,
  },
  {
    id: 2,
    name: "Omar Said",
    email: "omar@company.com",
    avatar: null,
    role: "Team Lead",
    blocked: false,
    attendance: 88,
    kpi: 84,
  },
  {
    id: 3,
    name: "Lina Fahmy",
    email: "lina@company.com",
    avatar: null,
    role: "User",
    blocked: true,
    attendance: 61,
    kpi: 58,
  },
];

export default function DashboardPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleRoleChange = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    // TODO: persist to your API, e.g. fetch(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify({ role }) })
  };

  const handleStatusChange = (id, blocked) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked } : u)));
    // TODO: persist to your API
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    // TODO: DELETE request to your API
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WelcomeBanner/>
        </div>

        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />



        <div className="lg:col-span-2  grid gap-1.5 ">
          <div>
          <HiringNeedsCard  roles={INITIAL_HIRING_ROLES} seeAllHref="/analysis" />
            
          </div>

       
        </div>

        <div className="lg:col-span-1">
          <UserKpiList users={users} />
        </div>

      </div>
      
   <UsersList
            users={users}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteUser}
          />
    </>
  );
}

