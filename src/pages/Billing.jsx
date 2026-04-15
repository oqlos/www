import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PricingCards from "../components/PricingCards";
import "../styles/global.css";

export default function Billing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const jwt = localStorage.getItem("jwt");
  const [plan, setPlan] = useState("free");
  const [sessionId] = useState(searchParams.get("session"));

  useEffect(() => {
    if (sessionId) {
      setPlan("pro");
    }
  }, [sessionId]);

  async function handleSubscribe(selectedPlan) {
    if (!jwt) {
      navigate(`/login?plan=${selectedPlan}`);
      return;
    }
    try {
      const res = await fetch(`/billing/subscribe/${selectedPlan}?provider=stripe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      alert("Billing service unavailable. Please try later.");
    }
  }

  return (
    <div className="dashboard">
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/scenarios">Scenarios</Link>
          <Link to="/nlp">NLP Console</Link>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email || "Guest"}</span>
        </div>
      </nav>

      <div className="dash-content">
        <div className="section-label">Billing</div>
        <h2>Manage Your Plan</h2>
        <p className="section-desc">
          {plan !== "free"
            ? `You are currently on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`
            : "You are currently on the Free plan. Upgrade for fleet management, reports, and more."}
        </p>

        {sessionId && (
          <div className="auth-msg success" style={{ marginBottom: 24 }}>
            Payment successful! Your Pro plan is now active.
          </div>
        )}

        <PricingCards onSubscribe={handleSubscribe} />
      </div>
    </div>
  );
}
