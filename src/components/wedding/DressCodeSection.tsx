const DRESS_CODE_COLORS = [
  { name: "Молочный", hex: "#fdfaf6" },
  { name: "Нежная роза", hex: "#f2c4be" },
  { name: "Припылённая сирень", hex: "#d4b8cc" },
  { name: "Шалфей", hex: "#b5c4b1" },
  { name: "Песок", hex: "#dfc9a8" },
  { name: "Небесный", hex: "#c2d8e8" },
];

const AVOID_COLORS = [
  { name: "Белый", hex: "#ffffff" },
  { name: "Чёрный", hex: "#1a1a1a" },
  { name: "Ярко-красный", hex: "#e53935" },
];

export default function DressCodeSection() {
  return (
    <section id="dresscode" style={{ padding: "7rem 2rem", background: "linear-gradient(180deg, var(--cream) 0%, var(--milk) 100%)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 1rem" }}>
          Рекомендации по стилю
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "var(--text-dark)", margin: "0 0 0.75rem" }}>
          Дресс-код
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "var(--text-mid)", margin: "0 0 3rem", fontWeight: 300 }}>
          Пастельная палитра — нежная и романтичная
        </p>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "var(--text-light)", margin: "0 0 1.5rem", letterSpacing: "0.1em" }}>
          Приветствуем оттенки:
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", marginBottom: "3rem" }}>
          {DRESS_CODE_COLORS.map(c => (
            <div key={c.name} style={{ textAlign: "center" }}>
              <div style={{
                width: "68px", height: "68px", borderRadius: "50%",
                background: c.hex, border: "2px solid rgba(201,163,110,0.35)",
                margin: "0 auto 0.6rem",
                boxShadow: "0 4px 16px rgba(139,94,82,0.15)",
              }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.62rem", color: "var(--text-light)", margin: 0 }}>
                {c.name}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
          {["🌸 Дамы — вечерние или коктейльные платья, элегантные брючные костюмы",
            "🎩 Господа — классический костюм, галстук или бабочка приветствуются"].map(t => (
            <div key={t} style={{ flex: "1", minWidth: "240px", padding: "1.25rem", background: "rgba(232,196,176,0.2)", borderRadius: "1rem", border: "1px solid rgba(201,163,110,0.2)" }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.78rem", color: "var(--text-mid)", margin: 0, lineHeight: 1.6 }}>
                {t}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.72rem", color: "var(--text-light)", margin: "0 0 1rem" }}>
          Пожалуйста, избегайте:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {AVOID_COLORS.map(c => (
            <div key={c.name} style={{ textAlign: "center", opacity: 0.65 }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: c.hex, border: "2px dashed rgba(139,94,82,0.4)",
                margin: "0 auto 0.5rem", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "rgba(180,40,40,0.5)", transform: "translateY(-50%) rotate(-45deg)" }} />
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.62rem", color: "var(--text-light)", margin: 0 }}>
                {c.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
