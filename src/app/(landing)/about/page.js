import AboutHero from "@/components/about/AboutHero";
import StorySection from "@/components/about/StorySection";
import OfferingsSection from "@/components/about/OfferingsSection";
import ValuesSection from "@/components/about/ValuesSection";
import QRSection from "@/components/home/QRSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StorySection />
      <OfferingsSection />
      <ValuesSection />
      <QRSection />
      <Footer />
    </main>
  );
}