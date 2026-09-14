"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import QRSection from "@/components/home/QRSection";
import ClubsSection from "@/components/home/ClubsSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SponsorsSection from "@/components/home/SponsorsSection";

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get("/events", { params: { status: "Upcoming", limit: 5 } })
      .then((res) => setUpcomingEvents(res.data.events || []))
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setLoadingEvents(false));

    apiClient
      .get("/clubs", { params: { limit: 4 } })
      .then((res) => setClubs(res.data.clubs || []))
      .catch((err) => console.error("Error fetching clubs:", err))
      .finally(() => setLoadingClubs(false));
  }, []);

  const handleRegister = async (eventId) => {
    if (!isAuthenticated()) {
      toast.error("Please log in to register for this event");
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    try {
     router.push(`/events/${eventId}/register`)
      // await apiClient.post(`/events/${eventId}/register`);
      // toast.success("Registered successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main>
      <Navbar/>
      <HeroSection events={upcomingEvents} onRegister={handleRegister} loading={loadingEvents} />
    {/* <SponsorsSection /> */}

      <AboutSection />
      <ClubsSection clubs={clubs} loading={loadingClubs} />

      <QRSection />
      <Footer />
    </main>
  );
}