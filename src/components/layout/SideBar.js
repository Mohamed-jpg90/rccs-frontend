'use client'

import React, { useEffect, useState } from "react";
import {
  MdDashboard,
  MdAnalytics,
  MdFactCheck,
  MdEvent,
  MdGroups,
  MdNotifications,
  MdLogout,
  MdVideoFile,
  MdOutlineVolunteerActivism,
  
} from "react-icons/md";
import { GoSponsorTiers } from "react-icons/go";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearAuth } from "@/lib/auth";

/* -------------------------------------------------------------------------
   Nav config
------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: MdDashboard, to: "/dashboard" },
  { id: "analysis", label: "Analysis", icon: MdAnalytics, to: "/dashboard/analysis" },
  { id: "clubs", label: "Clubs", icon: MdFactCheck, to: "/dashboard/clubs" },
  { id: "events", label: "Events", icon: MdEvent, to: "/dashboard/events" },
  { id: "members", label: "Members", icon: MdGroups, to: "/dashboard/members" },
  { id: "content", label: "content", icon: MdVideoFile, to: "/dashboard/content" },
  { id: "removal-requests", label: "removal-requests", icon: MdNotifications, to: "/dashboard/removal-requests" },
  { id: "volunteers", label: "volunteers", icon: MdOutlineVolunteerActivism , to: "/dashboard/volunteers" },
  { id: "sponsores", label: "sponsors", icon: GoSponsorTiers , to: "/dashboard/sponsores" },
];

/* -------------------------------------------------------------------------
   MenuItem
------------------------------------------------------------------------- */

export function MenuItem({ item, isActive, onClick }) {
  const router = useRouter();
  const Icon = item.icon;

  const handleClick = () => {
    onClick?.();
    router.push(item.to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative flex w-full items-center gap-3 rounded-[var(--radius-md-value)] px-3.5 py-2.5 text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-[var(--primary-light)] text-[var(--primary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[var(--primary)]" />
      )}
      <Icon
        className={`shrink-0 text-[19px] transition-colors duration-200 ${
          isActive
            ? "text-[var(--primary)]"
            : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
        }`}
      />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------
   Sidebar
------------------------------------------------------------------------- */

export function Sidebar({ isOpen, onClose, activeItem, onSelect }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--border)] bg-[var(--bg-sidebar)] transition-transform duration-300 ease-in-out
          lg:static lg:z-0 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md-value)] bg-[var(--primary)] text-[15px] font-bold text-[var(--text-white)] shadow-[var(--shadow-primary-value)]">
            N
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            Nexus
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded-[var(--radius-sm-value)] p-1.5 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--bg-hover)] lg:hidden"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3.5">
          {NAV_ITEMS.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </nav>

        <div className="border-t border-[var(--border)] px-5 py-4">
          <p className="text-xs text-[var(--text-muted)]">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------
   Navbar
------------------------------------------------------------------------- */

export function Navbar({ title, onMenuClick }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Read auth state on mount, client-side only — avoids the SSR crash
  // and the "never updates" problem of a top-level localStorage read.
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleProfileClick = () => {
    setMenuOpen(false);
    router.push("/dashboard/profile"); // route not built yet, per your instruction
  };

  const handleLogout = () => {
    clearAuth();
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-navbar)]/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-[var(--radius-sm-value)] p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--bg-hover)] lg:hidden"
      >
        <HiMenu className="text-xl" />
      </button>

      <h1 className="hidden text-lg font-semibold text-[var(--text-primary)] sm:block">
        {title}
      </h1>

      <div className="relative ml-2 hidden max-w-xs flex-1 md:block">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-[var(--radius-md-value)] border border-[var(--border)] bg-[var(--bg-main)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-placeholder)] outline-none transition-colors duration-200 focus:border-[var(--border-focus)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Search"
          className="rounded-[var(--radius-sm-value)] p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--bg-hover)] md:hidden"
        >
          <FiSearch className="text-lg" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-[var(--radius-sm-value)] p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--bg-navbar)]" />
        </button>

        <div className="h-6 w-px bg-[var(--border)]" />

        {/* Profile menu — this layout only renders for authenticated
            routes (guarded in app/(dashboard)/layout.jsx), so `user`
            should always be present here once mounted. */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-[var(--radius-md-value)] py-1 pl-1 pr-2 transition-colors duration-200 hover:bg-[var(--bg-hover)]"
          >
            <FaUserCircle className="text-[30px] text-[var(--text-muted)]" />
            <span className="hidden text-sm font-medium text-[var(--text-primary)] sm:block">
              {user?.fullName ?? "Account"}
            </span>
            <FiChevronDown className="hidden text-[14px] text-[var(--text-muted)] sm:block" />
          </button>

          {menuOpen && (
            <>
              <div
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                >
                  <FaUserCircle className="text-base" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10"
                >
                  <MdLogout className="text-base" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   DashboardLayout
------------------------------------------------------------------------- */

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Derives the active sidebar item from the real URL instead of a
  // hardcoded default, so refreshing on /events correctly highlights Events.
  const activeItem =
    NAV_ITEMS.find((item) => item.to === pathname)?.id ??
    NAV_ITEMS.find((item) => item.to !== "/" && pathname?.startsWith(item.to))?.id ??
    "dashboard";

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onSelect={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}