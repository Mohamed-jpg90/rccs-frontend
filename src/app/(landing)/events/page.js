"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import EventsHero from "@/components/event/EventsHero";
import QRSection from "@/components/home/QRSection";
import EventsGrid from "@/components/event/EventsGrid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const LIMIT = 9;

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchEvents = useCallback((pageNum) => {
    setLoading(true);
    apiClient
      .get("/events", { params: { page: pageNum, limit: LIMIT } })
      .then((res) => {
        setEvents(res.data.events || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchRegistrations = useCallback(() => {
    if (!isAuthenticated()) return;
    apiClient
      .get("/me/registrations")
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch((err) => console.error("Error fetching registrations:", err));
  }, []);

  useEffect(() => {
    fetchEvents(page);
  }, [page, fetchEvents]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const registrationMap = useMemo(() => {
    const map = {};
    registrations.forEach((reg) => {
      const eventId = reg.event?._id || reg.event;
      if (eventId) map[eventId] = reg;
    });
    return map;
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = events.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const clubs = new Set(events.filter((e) => e.club).map((e) => e.club._id)).size;
    return { total, thisMonth, clubs };
  }, [events, total]);

  return (
    <main>
      <EventsHero
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
  <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <EventsGrid
          events={filteredEvents}
          loading={loading}
          registrationMap={registrationMap}
          onCancelled={fetchRegistrations}
          page={page}
          totalPages={Math.ceil(total / LIMIT)}
          onPageChange={setPage}
        />
      </section>
      <QRSection />

    

      <Footer />
    </main>
  );
}