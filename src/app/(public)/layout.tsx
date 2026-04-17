import { FloatingNavbar } from "@/components/home/floating-navbar";
import { FooterSection } from "@/components/home/footer-section";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingNavbar />
      {children}
      <FooterSection />
    </>
  );
}
