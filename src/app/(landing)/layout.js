import Navbar from "@/components/layout/Navbar";

export default function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}