import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

const CASE_STUDIES = [
  {
    id: "medical-device-gdansk",
    industry: "medical",
    location: "Gdańsk, Polska",
    company: "MediTest Sp. z o.o.",
    headline: "Redukcja czasu testów o 70% dla certyfikacji sprzętu medycznego",
    challenge: "Ręczne testowanie 200+ urządzeń respiratorowych miesięcznie na certyfikację UMDNS. Proces trwał 5 dni, z wieloma błędami operatora.",
    solution: "Implementacja OqlOS z DSL dla testów IEC 62353. Automatyczna rejestracja wyników w systemie jakości.",
    results: [
      "Czas testu: 5 dni → 1.5 dnia",
      "Koszty QA: -60% rocznie",
      "Zero błędów w audytach GxP od wdrożenia",
      "3x więcej testów bez zatrudniania nowych osób"
    ],
    quote: "OqlOS pozwolił nam przejść audyt FDA bez uwag do procesów testowych. Pełna ścieżka audytu była kluczowa.",
    author: "Marek Kowalski",
    role: "Dyrektor Jakości"
  },
  {
    id: "manufacturing-wroclaw",
    industry: "manufacturing",
    location: "Wrocław, Polska",
    company: "PumpControl Systems",
    headline: "Automatyzacja testów zaworów i pomp procesowych",
    challenge: "Testowanie 50 konfiguracji pomp w różnych warunkach ciśnieniowych. Każda zmiana wymagała przepisania skryptów Python.",
    solution: "OQL jako język testów - operatorzy piszą scenariusze bez programistów. Integracja z Modbus RTU i analogowymi czujnikami.",
    results: [
      "Nowy scenariusz testu: 2h (dev) → 15 min (operator)",
      "Pokrycie testów regresji: 40% → 95%",
      "Rozwiązywanie incydentów produkcyjnych: -70% czasu"
    ],
    quote: "Nasz operator produkcji napisał pierwszy scenariusz OQL po 30 minutach szkolenia. To zmienia sposób myślenia o testach.",
    author: "Anna Nowak",
    role: "Kierownik Produkcji"
  },
  {
    id: "qa-studio-krakow",
    industry: "software",
    location: "Kraków, Polska",
    company: "QA Digital",
    headline: "Jedno narzędzie dla API, GUI i hardware testing",
    challenge: "3 różne zespoły używały Cypress, Postman i ręcznych procedur na hardware. Brak spójnej dokumentacji i ścieżki audytu.",
    solution: "Unifikacja w TestQL/OQL. Jeden DSL dla wszystkich warstw: API → GUI → Hardware. Wersjonowanie w Git.",
    results: [
      "Stack testowy: 3 narzędzia → 1 platforma",
      "Koszty licencji: -€12k rocznie",
      "Czas onboardingu QA: 2 tyg. → 3 dni"
    ],
    quote: "Wreszcie mamy single source of truth dla testów. Dev, QA i Ops używają tego samego języka.",
    author: "Tomasz Wiśniewski",
    role: "Lead QA Engineer"
  }
];

function IndustryBadge({ industry }) {
  const colors = {
    medical: { bg: "#fef2f2", text: "#dc2626", label: "Medycyna" },
    manufacturing: { bg: "#f0fdf4", text: "#16a34a", label: "Produkcja" },
    software: { bg: "#eff6ff", text: "#2563eb", label: "Software QA" }
  };
  const style = colors[industry] || colors.software;
  
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 12,
      background: style.bg,
      color: style.text,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }}>
      {style.label}
    </span>
  );
}

export default function CaseStudies() {
  const { user, logout } = useAuth();
  const { t, lang } = useI18n();

  const title = lang === "pl" ? "Case Studies" : lang === "de" ? "Fallstudien" : "Case Studies";
  const subtitle = lang === "pl" 
    ? "Jak firmy redukują koszty testów i przyspieszają certyfikację sprzętu"
    : lang === "de"
    ? "Wie Unternehmen Testkosten senken und Hardware-Zertifizierung beschleunigen"
    : "How companies reduce testing costs and accelerate hardware certification";

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">{title}</div>
        <h2 style={{ marginBottom: 8 }}>{subtitle}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
          {lang === "pl" ? "Prawdziwe wdrożenia OqlOS w polskich firmach produkcyjnych i medycznych."
            : lang === "de" ? "Reale OqlOS-Implementierungen in polnischen Produktions- und Medizinunternehmen."
            : "Real-world OqlOS implementations in Polish manufacturing and medical companies."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              style={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div style={{
                padding: "24px 32px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-hover)"
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <IndustryBadge industry={study.industry} />
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    📍 {study.location}
                  </span>
                </div>
                <h3 style={{ fontSize: 22, margin: 0, lineHeight: 1.3 }}>{study.headline}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "8px 0 0 0" }}>
                  <strong>{study.company}</strong>
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: "32px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 24,
                  marginBottom: 32
                }}>
                  <div>
                    <h4 style={{ color: "#dc2626", marginBottom: 12, fontSize: 14, textTransform: "uppercase" }}>
                      {lang === "pl" ? "Wyzwanie" : lang === "de" ? "Herausforderung" : "Challenge"}
                    </h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>
                      {study.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: "#2563eb", marginBottom: 12, fontSize: 14, textTransform: "uppercase" }}>
                      {lang === "pl" ? "Rozwiązanie" : lang === "de" ? "Lösung" : "Solution"}
                    </h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div style={{
                  background: "rgba(22, 163, 74, 0.1)",
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  borderRadius: 8,
                  padding: 24,
                  marginBottom: 32
                }}>
                  <h4 style={{ 
                    color: "#16a34a", 
                    marginBottom: 16, 
                    fontSize: 14, 
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    ✅ {lang === "pl" ? "Wyniki" : lang === "de" ? "Ergebnisse" : "Results"}
                  </h4>
                  <ul style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px 24px",
                    margin: 0,
                    padding: 0,
                    listStyle: "none"
                  }}>
                    {study.results.map((result, idx) => (
                      <li key={idx} style={{ fontSize: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>→</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote */}
                <blockquote style={{
                  margin: 0,
                  padding: "24px 32px",
                  background: "var(--bg-hover)",
                  borderRadius: 8,
                  borderLeft: "4px solid var(--accent-blue)"
                }}>
                  <p style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    margin: "0 0 16px 0",
                    color: "var(--text)"
                  }}>
                    "{study.quote}"
                  </p>
                  <footer style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    <strong>{study.author}</strong>, {study.role}, {study.company}
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 48,
          padding: 32,
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)",
          border: "1px solid var(--border)",
          textAlign: "center"
        }}>
          <h3 style={{ marginBottom: 12 }}>
            {lang === "pl" ? "Chcesz podobne wyniki?"
              : lang === "de" ? "Möchten Sie ähnliche Ergebnisse?"
              : "Want similar results?"}
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            {lang === "pl" ? "Umów 15-minutowe demo i zobacz jak OqlOS działa w Twoim kontekście."
              : lang === "de" ? "Vereinbaren Sie eine 15-minütige Demo und sehen Sie, wie OqlOS in Ihrem Kontext funktioniert."
              : "Book a 15-minute demo and see how OqlOS works in your context."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/demo" className="btn btn-primary" style={{ padding: "12px 24px" }}>
              {lang === "pl" ? "📅 Umów demo" : lang === "de" ? "📅 Demo buchen" : "📅 Book demo"}
            </a>
            <a href="/roi" className="btn btn-outline" style={{ padding: "12px 24px" }}>
              {lang === "pl" ? "📊 Kalkulator ROI" : lang === "de" ? "📊 ROI-Rechner" : "📊 ROI Calculator"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
