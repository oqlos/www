import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PricingCards from "../components/PricingCards";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

export default function Billing() {
  const [searchParams] = useSearchParams();
  const { user, jwt, logout, navigate } = useAuth();
  const { t } = useI18n();
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
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">Billing</div>
        <h2>{t("billing.title")}</h2>
        <p className="section-desc">
          {plan !== "free"
            ? t("billing.on_plan", { plan: plan.charAt(0).toUpperCase() + plan.slice(1) })
            : t("billing.on_free")}
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
