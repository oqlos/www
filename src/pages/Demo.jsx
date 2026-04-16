import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

// Check if mock mode is enabled
const IS_MOCK = import.meta.env.VITE_FORCE_MOCK_API === 'true';

// Cal.com embed URL - replace with your actual Cal.com username/event
const CAL_URL = "https://cal.com/oqlos/demo-15min?embed=true&theme=dark";

// Mock calendar component for dev/testing
function MockCalendar({ onSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);

  const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 24,
        padding: 16,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        border: '1px dashed var(--accent-blue)'
      }}>
        <span style={{ color: 'var(--accent-blue)', fontSize: 14 }}>🔧 MOCK MODE</span>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Symulacja Cal.com dla developmentu
        </p>
      </div>

      {booked ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3>Demo zaplanowane!</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {selectedDate} o {selectedTime}<br/>
            (Mock - w produkcji prawdziwy Cal.com)
          </p>
        </div>
      ) : (
        <>
          <h3 style={{ marginBottom: 16 }}>Wybierz termin</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 8,
            marginBottom: 24
          }}>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 6,
                  border: selectedDate === day ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                  background: selectedDate === day ? 'rgba(0,0,0,0.3)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {selectedDate && (
            <>
              <h3 style={{ marginBottom: 16 }}>Wybierz godzinę</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: selectedTime === time ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                      background: selectedTime === time ? 'rgba(0,0,0,0.3)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedDate && selectedTime && (
            <button
              onClick={handleBook}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 8,
                border: 'none',
                background: 'var(--accent-blue)',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Potwierdź demo: {selectedDate} {selectedTime}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function Demo() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(IS_MOCK ? true : false);
  const [iframeError, setIframeError] = useState(false);

  // Handle iframe load errors (e.g., 404 from Cal.com)
  const handleIframeLoad = () => {
    setLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setLoaded(true);
  };

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">{t("demo.label")}</div>
        <h2>{t("demo.title")}</h2>
        <p className="section-desc">{t("demo.subtitle")}</p>

        <div style={{ 
          maxWidth: 1200, 
          margin: "32px auto", 
          minHeight: 600,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "var(--bg-card)"
        }}>
          {IS_MOCK || iframeError ? (
            <MockCalendar />
          ) : (
            <>
              {!loaded && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  gap: 16
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    border: "3px solid var(--border)",
                    borderTop: "3px solid var(--accent-blue)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ color: "var(--text-muted)" }}>{t("demo.loading")}</p>
                </div>
              )}

              {iframeError && (
                <div style={{
                  padding: 24,
                  textAlign: "center",
                  color: "var(--text-muted)",
                  background: "var(--bg-hover)",
                  borderRadius: 8,
                  margin: "16px auto",
                  maxWidth: 600
                }}>
                  <p style={{ marginBottom: 16 }}>⚠️ {t("demo.iframe_error") || "Cal.com booking unavailable - showing demo mode"}</p>
                </div>
              )}

              <iframe
                src={CAL_URL}
                width="100%"
                height={loaded && !iframeError ? 700 : 0}
                frameBorder="0"
                allowFullScreen
                title={t("demo.iframe_title")}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  opacity: loaded && !iframeError ? 1 : 0,
                  transition: "opacity 0.3s ease"
                }}
              />
            </>
          )}
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginTop: 48
        }}>
          <div style={{
            padding: 24,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-hover)"
          }}>
            <h4 style={{ marginBottom: 12 }}>🎯 {t("demo.what_to_expect")}</h4>
            <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20, color: "var(--text-muted)" }}>
              <li>{t("demo.expect_1")}</li>
              <li>{t("demo.expect_2")}</li>
              <li>{t("demo.expect_3")}</li>
            </ul>
          </div>

          <div style={{
            padding: 24,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-hover)"
          }}>
            <h4 style={{ marginBottom: 12 }}>📧 {t("demo.contact_alt")}</h4>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
              {t("demo.contact_text")}
            </p>
            <a 
              href="mailto:hello@oqlos.com" 
              style={{ 
                color: "var(--accent-blue)",
                fontSize: 14,
                fontWeight: 500
              }}
            >
              hello@oqlos.com →
            </a>
          </div>

          <div style={{
            padding: 24,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-hover)"
          }}>
            <h4 style={{ marginBottom: 12 }}>🐳 {t("demo.self_serve")}</h4>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
              {t("demo.self_serve_text")}
            </p>
            <button 
              className="btn btn-outline"
              onClick={() => window.open("https://docs.oqlos.com/self-hosted", "_blank")}
              style={{ fontSize: 13, padding: "6px 12px" }}
            >
              {t("demo.docs_btn")} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
