import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { mockFetch } from "../mocks/api";

export default function Login() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");
  const plan = searchParams.get("plan");
  const verifyTokenRef = useRef(false);
  const autoSubmitRef = useRef(false);

  useEffect(() => {
    if (!token || verifyTokenRef.current) return;
    verifyTokenRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await mockFetch(`/auth/verify?token=${token}`);
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setMsg({ type: "success", text: t("login.success_logged_in") });
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setMsg({ type: "error", text: data.detail || t("login.error_invalid_link") });
        }
      } catch {
        setMsg({ type: "error", text: t("login.error_connection") });
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate, t]);

  // Auto-fill test email when plan=pro
  useEffect(() => {
    if (plan === "pro" && !autoSubmitRef.current) {
      setEmail("test@test.com");
      autoSubmitRef.current = true;
      
      // Auto-submit after a short delay for easier testing
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
      }, 500);
    }
  }, [plan]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await mockFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.testMode) {
        localStorage.setItem("jwt", "test-jwt-token");
        localStorage.setItem("user", JSON.stringify(data.user));
        setMsg({ type: "success", text: t("login.success_logged_in") });
        setTimeout(() => navigate(plan ? "/billing" : "/dashboard"), 600);
      } else if (res.ok) {
        setMsg({ type: "success", text: t("login.check_email") });
        setEmail("");
      } else {
        setMsg({ type: "error", text: data.detail || "Request failed" });
      }
    } catch {
      setMsg({ type: "error", text: t("login.error_connection") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="nav-logo" style={{ display: "block", marginBottom: 24, fontSize: 28 }}>
          <em>OqlOS</em>
        </Link>

        {token ? (
          <>
            <h2>Verifying login…</h2>
            <p>Hold on while we verify your magic link.</p>
          </>
        ) : (
          <>
            <h2>{t("login.title")}</h2>
            <p>{t("login.subtitle")}</p>
            <form onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="email"
                placeholder={t("login.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? t("login.sending") : t("login.send_link")}
              </button>
            </form>
          </>
        )}

        {msg && (
          <div className={`auth-msg ${msg.type}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
