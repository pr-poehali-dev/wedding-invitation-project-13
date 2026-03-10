import Icon from "@/components/ui/icon";

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/7048d3b4-6e70-4430-bdde-e5d5e1e77d10/bucket/0a02f5dc-ddc4-45b9-9780-4f6fa0cc9ffe.jpg";

export default function InfoGallerySection() {
  return (
    <>
      {/* INFO */}
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
              { icon: "Calendar", label: "Дата", value: "19 июня 2026" },
              { icon: "Heart", label: "Регистрация брака", value: "12:30 · Дворец бракосочетания" },
              { icon: "MapPin", label: "Адрес загса", value: "ул. Ленина, д. 28" },
              { icon: "Bus", label: "Трансфер на банкет", value: "Отправление 13:50–14:00 · ул. Катукова, 11" },
              { icon: "MapPin", label: "База отдыха", value: "«Сосновый бор»" },
              { icon: "UtensilsCrossed", label: "Фуршет", value: "14:50 — 15:30" },
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

      {/* GALLERY */}
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
    </>
  );
}