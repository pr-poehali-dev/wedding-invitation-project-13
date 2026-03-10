import { useState } from "react";
import Icon from "@/components/ui/icon";

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

export default function RsvpSection() {
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
    window.open(`https://t.me/Epifuha?text=${encodeURIComponent(buildMessage())}`, "_blank");
    setFormSent(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Анкета гостя — Свадьба Анны и Никиты");
    window.open(`mailto:Yepifantseva.anya@bk.ru?subject=${subject}&body=${encodeURIComponent(buildMessage())}`, "_blank");
    setFormSent(true);
  };

  return (
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
  );
}