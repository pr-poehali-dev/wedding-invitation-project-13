import { useEffect, useState } from "react";
import HeroSection from "@/components/wedding/HeroSection";
import InfoGallerySection from "@/components/wedding/InfoGallerySection";
import DressCodeSection from "@/components/wedding/DressCodeSection";
import RsvpSection from "@/components/wedding/RsvpSection";

export default function Index() {
  const [veilAnimated, setVeilAnimated] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 7,
      size: 6 + Math.random() * 10,
    }));
    setPetals(p);

    const t1 = setTimeout(() => setVeilAnimated(true), 600);
    const t2 = setTimeout(() => setContentVisible(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ background: "var(--milk)", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <HeroSection petals={petals} veilAnimated={veilAnimated} contentVisible={contentVisible} />
      <InfoGallerySection />
      <DressCodeSection />
      <RsvpSection />

      {/* FOOTER */}
      <footer style={{ padding: "5rem 2rem", background: "var(--milk)", textAlign: "center", borderTop: "1px solid rgba(201,163,110,0.15)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--text-dark)", fontStyle: "italic", margin: "0 0 1.5rem" }}>
          Анна &amp; Никита
        </p>
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", width: "140px", margin: "0 auto 1.5rem" }} />
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-light)", margin: "0 0 2rem" }}>
          19 июня 2026 · База отдыха «Сосновый бор»
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--blush)", margin: 0, fontWeight: 300 }}>
          С любовью ждём вас 🤍
        </p>
      </footer>
    </div>
  );
}