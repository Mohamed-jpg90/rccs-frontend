"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaUserCircle, FaHandsHelping } from "react-icons/fa";
import { isAuthenticated, getUser, clearAuth } from "@/lib/auth";

const BASE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Clubs", href: "/clubs" },
  { label: "Volunteers", href: "/volunteers" },
];

const TEAM_LEADER_LINKS = [
  ...BASE_LINKS,
  { label: "Dashboard", href: "/team-leader/dashboard" },
];

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // controls mobile drawer transform-in
  const [hoverStyle, setHoverStyle] = useState({ opacity: 0 });
  const linkRefs = useRef({});
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setUser(getUser());
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open, and drive the slide-in transition
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    } else {
      document.body.style.overflow = "";
      setMounted(false);
    }
  }, [menuOpen]);

  const isTeamLeader = user?.role === "Team Leader";
  const navLinks = isTeamLeader ? TEAM_LEADER_LINKS : BASE_LINKS;

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const moveIndicator = (href) => {
    const el = linkRefs.current[href];
    if (!el) return;
    setHoverStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  };

  const resetIndicator = () => setHoverStyle((s) => ({ ...s, opacity: 0 }));

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-[1100] bg-[var(--bg-navbar)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--text-white)] font-display font-semibold text-sm shadow-[var(--shadow-primary-value)] transition-transform duration-300 group-hover:rotate-12">
                P
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Pokrovsky Center
              </span>
            </Link>

            {/* Glassy liquid-glass pill wrapping the nav links */}
            <div
              className="hidden md:flex items-center gap-1 relative px-1.5 py-1.5 rounded-full glass-pill"
              onMouseLeave={resetIndicator}
            >
              <span
                className="absolute bottom-1.5 h-[calc(100%-12px)] rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 transition-all duration-300 ease-out"
                style={hoverStyle}
              />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  ref={(el) => (linkRefs.current[link.href] = el)}
                  href={link.href}
                  onMouseEnter={() => moveIndicator(link.href)}
                  className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {loggedIn && (
                <Link
                  href="/profile"
                  ref={(el) => (linkRefs.current["/profile"] = el)}
                  onMouseEnter={() => moveIndicator("/profile")}
                  className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    pathname === "/profile"
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {loggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-hover)]">
                    <FaUserCircle className="text-[var(--primary)] text-lg" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {user?.fullName || "Member"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors px-3 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors px-3 py-2">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-[var(--text-white)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-5 py-2.5 rounded-full shadow-[var(--shadow-primary-value)] transition-all hover:-translate-y-0.5">
                    Join Us
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — morphs into an X */}
            <button
              className="md:hidden relative z-[1210] h-9 w-9 flex items-center justify-center text-[var(--text-primary)]"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <FaBars className={`absolute text-xl transition-all duration-300 ${menuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
              <FaTimes className={`absolute text-xl transition-all duration-300 ${menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer: backdrop + panel sliding in from the right */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[1200]">
          <div
            onClick={closeMenu}
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute top-0 right-0 h-full w-[78%] max-w-xs bg-[var(--bg-card)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-transform duration-350 ease-out ${
              mounted ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between h-[68px] px-5 border-b border-[var(--border)]">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--text-white)] font-display font-semibold text-sm">
                  P
                </span>
                <span className="font-display text-base font-semibold text-[var(--text-primary)]">
                  Menu
                </span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  style={{ transitionDelay: mounted ? `${index * 45 + 60}ms` : "0ms" }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out ${
                    mounted ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  } ${
                    pathname === link.href
                      ? "text-[var(--primary)] bg-[var(--primary-light)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {loggedIn && (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  style={{ transitionDelay: mounted ? `${navLinks.length * 45 + 60}ms` : "0ms" }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out ${
                    mounted ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  } ${
                    pathname === "/profile"
                      ? "text-[var(--primary)] bg-[var(--primary-light)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>

            <div className="px-4 py-5 border-t border-[var(--border)] flex flex-col gap-2.5">
              {loggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]">
                    <FaUserCircle className="text-[var(--primary)] text-lg" />
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user?.fullName || "Member"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-[var(--danger)] px-4 py-2.5 text-left rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="text-sm font-medium text-[var(--text-secondary)] px-4 py-2.5 rounded-xl border border-[var(--border)] text-center hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="text-sm font-medium text-[var(--text-white)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-4 py-2.5 rounded-xl text-center shadow-[var(--shadow-primary-value)] transition-colors"
                  >
                    Join Us
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-pill {
          background: color-mix(in srgb, var(--bg-card) 55%, transparent);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
          box-shadow:
            inset 0 1px 0 color-mix(in srgb, white 25%, transparent),
            0 4px 16px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </>
  );
}