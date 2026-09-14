import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  VolunteersHeroSection,
  WhyVolunteerSection,
  VolunteersShowcase,
} from "@/components/volunteers";

export default function VolunteersPage() {
  return (
    <main>
      {/* <Navbar /> */}
      <VolunteersHeroSection />
      <WhyVolunteerSection />
      <VolunteersShowcase />
      <Footer />
    </main>
  );
}