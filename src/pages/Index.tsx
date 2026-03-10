import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/7048d3b4-6e70-4430-bdde-e5d5e1e77d10/files/da7a0c01-ffc8-4043-a784-50dffdbbc371.jpg";

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

type FormData = {
  firstName: string;
  lastName: string;
  withPartner: string;
  partnerName: string;
  transfer: string;
  alcohol: string[];
  menu: string;
  attending: string;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--text-light)",
  marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "1.05rem",
  color: "var(--text-dark)",
  background: "rgba(253,250,246,0.9)",
  border: "1px solid rgba(201,163,110,0.35)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box" as const,
};

const choiceButtonStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.75rem",
  padding: "0.6rem 1.25rem",
  border: "1px solid",
  borderRadius: "999px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  letterSpacing: "0.05em",
};

export default function Index() {
  const [veilAnimated, setVeilAnimated] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    withPartner: "",
    partnerName: "",
    transfer: "",
    alcohol: [],
    menu: "",
    attending: "",
  });
  const [formSent, setFormSent] = useState(false);

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

  const toggleAlcohol = (val: string) => {
    setFormData(prev => ({
      ...prev,
      alcohol: prev.alcohol.includes(val)
        ? prev.alcohol.filter(a => a !== val)
        : [...prev.alcohol, val],
    }));
  };

  const buildMessage = () => `
🌸 Анкета гостя — Свадьба Анны и Никиты 🌸

👤 Имя: ${formData.firstName} ${formData.lastName}
👫 Придёт с парой: ${formData.withPartner === "yes" ? "Да" : "Нет"}
${formData.withPartner === "yes" ? `💑 Имя партнёра: ${formData.partnerName}\n` : ""}🚌 Нужен трансфер: ${formData.transfer === "yes" ? "Да" : "Нет"}
🍾 Алкоголь: ${formData.alcohol.length > 0 ? formData.alcohol.join(", ") : "Не употребляю"}
🍽 Предпочтения в меню: ${formData.menu || "Нет"}
✅ Присутствие: ${formData.attending === "yes" ? "Буду на торжестве" : "Не смогу прийти"}
  `.trim();

  const handleSendTelegram = () => {
    window.open(`https://t.me/nevesta_anna?text=${encodeURIComponent(buildMessage())}`, "_blank");
    setFormSent(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Анкета гостя — Свадьба Анны и Никиты");
    window.open(`mailto:anna.nevesta@mail.ru?subject=${subject}&body=${encodeURIComponent(buildMessage())}`, "_blank");
    setFormSent(true);
  };

  return (
    <div style={{ background: "var(--milk)", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>

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

      {/* ===== HERO ===== */}
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
        <div
          style={{
            position: "absolute", top: 0, left: 0,
            width: "53%", height: "100%",
            transformOrigin: "left center",
            zIndex: 10,
            transform: veilAnimated ? "translateX(-120%) scaleX(0.3)" : "translateX(0)",
            opacity: veilAnimated ? 0 : 1,
            transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 2s ease",
            background: "linear-gradient(135deg, rgba(253,250,246,0.99) 0%, rgba(245,237,224,0.97) 50%, rgba(232,196,176,0.5) 100%)",
          }}
        />

        {/* VEIL RIGHT */}
        <div
          style={{
            position: "absolute", top: 0, right: 0,
            width: "53%", height: "100%",
            transformOrigin: "right center",
            zIndex: 10,
            transform: veilAnimated ? "translateX(120%) scaleX(0.3)" : "translateX(0)",
            opacity: veilAnimated ? 0 : 1,
            transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 2s ease",
            background: "linear-gradient(225deg, rgba(253,250,246,0.99) 0%, rgba(245,237,224,0.97) 50%, rgba(232,196,176,0.5) 100%)",
          }}
        />

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
            marginBottom: "2.5rem",
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

      {/* ===== INFO ===== */}
      <section id="info" style={{
        padding: "7rem 2rem",
        background: "linear-gradient(180deg, var(--milk) 0%, var(--cream) 100%)",
        position: "relative",
      }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 1.5rem" }}>
            Приглашение
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "var(--text-dark)", margin: "0 0 2rem" }}>
            Дорогой гость
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            fontStyle: "italic", color: "var(--text-mid)",
            lineHeight: 2, fontWeight: 300, margin: "0 0 3rem",
          }}>
            Мы счастливы пригласить вас разделить с нами один из самых важных дней нашей жизни.
            Ваше присутствие станет особым подарком и наполнит этот вечер теплом и радостью.
          </p>

          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", width: "200px", margin: "0 auto 3rem" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "Calendar", label: "Дата", value: "15 июня 2025" },
              { icon: "Clock", label: "Время", value: "16:00 — 00:00" },
              { icon: "MapPin", label: "Место", value: "Банкетный зал «Эдем»" },
              { icon: "Navigation", label: "Адрес", value: "ул. Садовая, 12, Москва" },
            ].map(item => (
              <div key={item.label} style={{
                padding: "2rem 1.25rem",
                background: "rgba(253,250,246,0.85)",
                borderRadius: "1.5rem",
                border: "1px solid rgba(201,163,110,0.2)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              }}>
                <div style={{
                  width: "50px", height: "50px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--cream), var(--blush))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(201,163,110,0.25)",
                }}>
                  <Icon name={item.icon} size={20} style={{ color: "var(--rosewood)" }} />
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-light)", margin: 0 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--text-dark)", margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" style={{ padding: "7rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 0.75rem" }}>
              Наша история
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "var(--text-dark)", margin: 0 }}>
              Анна &amp; Никита
            </h2>
          </div>

          <div style={{ position: "relative", borderRadius: "2rem", overflow: "hidden", maxWidth: "560px", margin: "0 auto", boxShadow: "0 30px 80px rgba(139,94,82,0.22)" }}>
            <img src={COUPLE_PHOTO} alt="Анна и Никита" style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(61,43,31,0.45) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: 0, right: 0, textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "white", margin: 0, fontStyle: "italic", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
                Анна &amp; Никита
              </p>
            </div>
          </div>

          <div style={{
            marginTop: "3rem", padding: "3rem",
            background: "rgba(253,250,246,0.75)", borderRadius: "1.5rem",
            border: "1px solid rgba(201,163,110,0.2)", textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              fontStyle: "italic", color: "var(--text-mid)",
              lineHeight: 2, fontWeight: 300, margin: 0,
            }}>
              Мы встретились в тот день, когда судьба решила, что двум людям пора стать одним целым.
              С тех пор каждый рассвет стал ярче, каждый момент — ценнее.
              Мы счастливы, что теперь пишем эту историю вместе — и хотим, чтобы вы стали её частью.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DRESS CODE ===== */}
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

      {/* ===== RSVP ===== */}
      <section id="rsvp" style={{ padding: "7rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 1rem" }}>
              Подтверждение
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "var(--text-dark)", margin: "0 0 0.5rem" }}>
              Анкета гостя
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text-mid)", fontWeight: 300, margin: 0 }}>
              Пожалуйста, заполните анкету до 1 мая 2025
            </p>
          </div>

          {formSent ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(253,250,246,0.9)", borderRadius: "2rem", border: "1px solid rgba(201,163,110,0.3)" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, var(--cream), var(--blush))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "2px solid rgba(201,163,110,0.3)" }}>
                <Icon name="Heart" size={32} style={{ color: "var(--rosewood)" }} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "var(--text-dark)", margin: "0 0 1rem" }}>
                Спасибо!
              </h3>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text-mid)", fontWeight: 300 }}>
                Ваша анкета отправлена. Мы будем очень рады видеть вас!
              </p>
              <button
                onClick={() => setFormSent(false)}
                style={{ marginTop: "2rem", fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-light)", background: "transparent", border: "1px solid rgba(201,163,110,0.4)", borderRadius: "999px", padding: "0.75rem 2rem", cursor: "pointer" }}
              >
                Изменить ответы
              </button>
            </div>
          ) : (
            <div style={{ background: "rgba(253,250,246,0.85)", borderRadius: "2rem", border: "1px solid rgba(201,163,110,0.25)", padding: "2.5rem", backdropFilter: "blur(10px)" }}>

              {/* Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Имя *</label>
                  <input style={inputStyle} placeholder="Ваше имя" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Фамилия *</label>
                  <input style={inputStyle} placeholder="Ваша фамилия" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>

              {/* Partner */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Придёте с парой?</label>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" as const }}>
                  {[{ v: "yes", l: "Да, с парой" }, { v: "no", l: "Буду один(а)" }].map(opt => (
                    <button key={opt.v} onClick={() => setFormData(p => ({ ...p, withPartner: opt.v }))} style={{ ...choiceButtonStyle, background: formData.withPartner === opt.v ? "linear-gradient(135deg, var(--blush), var(--rose))" : "transparent", color: formData.withPartner === opt.v ? "white" : "var(--text-mid)", borderColor: formData.withPartner === opt.v ? "var(--rose)" : "rgba(201,163,110,0.35)" }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {formData.withPartner === "yes" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Имя партнёра</label>
                  <input style={inputStyle} placeholder="Как зовут вашу пару" value={formData.partnerName} onChange={e => setFormData(p => ({ ...p, partnerName: e.target.value }))} />
                </div>
              )}

              {/* Transfer */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Нужен трансфер?</label>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" as const }}>
                  {[{ v: "yes", l: "Да, нужен" }, { v: "no", l: "Нет, спасибо" }].map(opt => (
                    <button key={opt.v} onClick={() => setFormData(p => ({ ...p, transfer: opt.v }))} style={{ ...choiceButtonStyle, background: formData.transfer === opt.v ? "linear-gradient(135deg, var(--blush), var(--rose))" : "transparent", color: formData.transfer === opt.v ? "white" : "var(--text-mid)", borderColor: formData.transfer === opt.v ? "var(--rose)" : "rgba(201,163,110,0.35)" }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alcohol */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Предпочтения в алкоголе</label>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.6rem", marginTop: "0.5rem" }}>
                  {["Вино", "Шампанское", "Виски", "Коньяк", "Водка", "Пиво", "Не употребляю"].map(a => (
                    <button key={a} onClick={() => toggleAlcohol(a)} style={{ ...choiceButtonStyle, background: formData.alcohol.includes(a) ? "linear-gradient(135deg, var(--blush), var(--rose))" : "transparent", color: formData.alcohol.includes(a) ? "white" : "var(--text-mid)", borderColor: formData.alcohol.includes(a) ? "var(--rose)" : "rgba(201,163,110,0.35)" }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Предпочтения в меню / аллергии</label>
                <textarea style={{ ...inputStyle, height: "90px", resize: "none" as const, lineHeight: 1.6 }} placeholder="Вегетарианское меню, непереносимость лактозы..." value={formData.menu} onChange={e => setFormData(p => ({ ...p, menu: e.target.value }))} />
              </div>

              {/* Attending */}
              <div style={{ marginBottom: "2.5rem" }}>
                <label style={labelStyle}>Вы придёте на торжество? *</label>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" as const }}>
                  {[{ v: "yes", l: "С радостью приду!" }, { v: "no", l: "К сожалению, не смогу" }].map(opt => (
                    <button key={opt.v} onClick={() => setFormData(p => ({ ...p, attending: opt.v }))} style={{ ...choiceButtonStyle, background: formData.attending === opt.v ? "linear-gradient(135deg, var(--blush), var(--rose))" : "transparent", color: formData.attending === opt.v ? "white" : "var(--text-mid)", borderColor: formData.attending === opt.v ? "var(--rose)" : "rgba(201,163,110,0.35)" }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send */}
              <div style={{ padding: "1.75rem", background: "rgba(232,196,176,0.15)", borderRadius: "1rem", border: "1px solid rgba(201,163,110,0.2)" }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "var(--text-light)", textAlign: "center", margin: "0 0 1.25rem", letterSpacing: "0.1em" }}>
                  Отправить анкету невесте:
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
                  <button
                    onClick={handleSendTelegram}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Montserrat', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a96e, #a07860)", color: "white", border: "none", borderRadius: "999px", padding: "0.9rem 2.25rem", cursor: "pointer", fontWeight: 500, boxShadow: "0 4px 20px rgba(160,120,96,0.3)" }}
                  >
                    <Icon name="Send" size={14} />
                    Telegram
                  </button>
                  <button
                    onClick={handleSendEmail}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Montserrat', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: "var(--rosewood)", border: "1.5px solid var(--rose)", borderRadius: "999px", padding: "0.9rem 2.25rem", cursor: "pointer", fontWeight: 500 }}
                  >
                    <Icon name="Mail" size={14} />
                    Эл. почта
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: "5rem 2rem", background: "var(--milk)", textAlign: "center", borderTop: "1px solid rgba(201,163,110,0.15)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--text-dark)", fontStyle: "italic", margin: "0 0 1.5rem" }}>
          Анна &amp; Никита
        </p>
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", width: "140px", margin: "0 auto 1.5rem" }} />
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-light)", margin: "0 0 2rem" }}>
          15 июня 2025 · Банкетный зал «Эдем» · Москва
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--blush)", margin: 0, fontWeight: 300 }}>
          С любовью ждём вас 🤍
        </p>
      </footer>
    </div>
  );
}
