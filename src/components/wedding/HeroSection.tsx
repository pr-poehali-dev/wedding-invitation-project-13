import Icon from "@/components/ui/icon";

type Petal = { id: number; left: number; delay: number; duration: number; size: number };

type HeroSectionProps = {
  petals: Petal[];
  veilAnimated: boolean;
  contentVisible: boolean;
};

export default function HeroSection({ petals, veilAnimated, contentVisible }: HeroSectionProps) {
  return (
    <>
      {/* Floating petals */}
      {petals.map(p => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50% 0 50% 50%",
            background: `radial-gradient(circle, #f2c4be, #e8c4b0)`,
            animationName: "floatPetal",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 40%, #f5ede0 0%, #fdfaf6 60%, #f5ede0 100%)",
        }} />
        {/* Decor rings */}
        <div style={{
          position: "absolute", top: "8%", right: "5%",
          width: "350px", height: "350px", borderRadius: "50%",
          border: "1px solid rgba(201,163,110,0.2)", zIndex: 1,
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "4%",
          width: "220px", height: "220px", borderRadius: "50%",
          border: "1px solid rgba(201,163,110,0.15)", zIndex: 1,
        }} />

        {/* VEIL LEFT */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "53%", height: "100%",
          transformOrigin: "left center",
          zIndex: 10,
          transform: veilAnimated ? "translateX(-120%) scaleX(0.3)" : "translateX(0)",
          opacity: veilAnimated ? 0 : 1,
          transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 2s ease",
          background: "linear-gradient(135deg, rgba(253,250,246,0.99) 0%, rgba(245,237,224,0.97) 50%, rgba(232,196,176,0.5) 100%)",
        }} />

        {/* VEIL RIGHT */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "53%", height: "100%",
          transformOrigin: "right center",
          zIndex: 10,
          transform: veilAnimated ? "translateX(120%) scaleX(0.3)" : "translateX(0)",
          opacity: veilAnimated ? 0 : 1,
          transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 2s ease",
          background: "linear-gradient(225deg, rgba(253,250,246,0.99) 0%, rgba(245,237,224,0.97) 50%, rgba(232,196,176,0.5) 100%)",
        }} />

        {/* VEIL TOP fade */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 9,
          background: "linear-gradient(to bottom, rgba(253,250,246,0.85) 0%, transparent 50%, rgba(253,250,246,0.85) 100%)",
          opacity: veilAnimated ? 0 : 1,
          transition: "opacity 1.8s ease 0.5s",
          pointerEvents: "none",
        }} />

        {/* HERO CONTENT */}
        <div style={{
          position: "relative", zIndex: 5,
          textAlign: "center",
          padding: "2rem",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 1.4s ease, transform 1.4s ease",
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--text-light)",
            margin: "0 0 2.5rem",
          }}>
            Приглашение на свадьбу
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: 300,
            lineHeight: 1,
            color: "var(--text-dark)",
            margin: "0",
            letterSpacing: "-0.01em",
          }}>
            Анна
          </h1>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "2rem", margin: "0.75rem 0",
          }}>
            <div style={{ height: "1px", width: "100px", background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem", fontStyle: "italic",
              color: "var(--gold)", fontWeight: 300,
            }}>
              &amp;
            </span>
            <div style={{ height: "1px", width: "100px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: 300,
            lineHeight: 1,
            color: "var(--text-dark)",
            margin: "0",
            letterSpacing: "-0.01em",
          }}>
            Никита
          </h1>

          <div style={{ marginTop: "3rem" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.3rem, 3vw, 2rem)",
              fontStyle: "italic",
              color: "var(--rosewood)",
              fontWeight: 300,
              margin: "0 0 0.4rem",
            }}>
              15 июня 2025 года
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              color: "var(--text-light)",
              textTransform: "uppercase",
              margin: 0,
            }}>
              Начало торжества в 16:00
            </p>
          </div>

          <a href="#info" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginTop: "3.5rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-light)",
            textDecoration: "none",
          }}>
            Узнать больше <Icon name="ChevronDown" size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
