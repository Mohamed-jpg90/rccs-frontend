import Link from "next/link";
import { FaFacebook, FaInstagram, FaTelegram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const LINK_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Clubs", href: "/clubs" },
    ],
  },
  {
    title: "Members",
    links: [
      { label: "My Profile", href: "/profile" },
      { label: "Volunteers", href: "/volunteers" },
      { label: "Certificates", href: "/profile#certificates" },
    ],
  },
];
const social = [
  {
    key:1,
    icon:FaInstagram,
    link : 'https://www.instagram.com/youth_club_at_the_russian_home?stkn=cXZkenc3ZTZwYXVq'
  },
    {
      key:2,
    icon:FaFacebook,
    link : 'https://www.facebook.com/share/1JW53Z3PHK/?mibextid=wwXIfr'
  },
    {
      key:3,
    icon:FaTelegram,
    link : 'https://t.me/youth_club_2022'
  },

]

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
      <div
        className="absolute -bottom-24 right-10 h-72 w-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--Background-Circle-color-1)", opacity: 0.12 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--text-white)] font-display font-semibold text-sm">
                Y
              </span>
              <span className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Youth Club
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mb-5">
              A home for Russian language, arts, and community — open to
              members of every background.
            </p>
            <div className="flex items-center gap-3">
              {/* {[FaFacebook, FaInstagram, FaTelegram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                >
                  <Icon className="text-sm" />
                </a>
              ))} */}
              {
                social.map((icon)=>(
                     <a
                  key={icon.key}
                  href={icon.link}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                >
                  <icon.icon className="text-sm" />
                </a>
                ))
              }
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Visit Us
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 text-[var(--primary)]" />
                Cairo, Egypt
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[var(--primary)]" />
                youthclub.russianhouseincairo@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Russian Cultural Center. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--primary)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--primary)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}