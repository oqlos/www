import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/global.css";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");
  const verifyTokenRef = useRef(false);

  useEffect(() => {
    if (!token || verifyTokenRef.current) return;
    verifyTokenRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/auth/verify?token=${token}`);
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setMsg({ type: "success", text: "Logged in! Redirecting…" });
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setMsg({ type: "error", text: data.detail || "Invalid or expired link" });
        }
      } catch {
        setMsg({ type: "error", text: "Connection error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Check your email for a login link!" });
        setEmail("");
      } else {
        setMsg({ type: "error", text: data.detail || "Request failed" });
      }
    } catch {
      setMsg({ type: "error", text: "Connection error" });
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
            <h2>Passwordless Login</h2>
            <p>Enter your email and we'll send a magic login link. No passwords needed.</p>
            <form onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="email"
                placeholder="you@company.com"
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
                {loading ? "Sending…" : "Send Magic Link"}
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
