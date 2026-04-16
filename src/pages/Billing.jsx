import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PricingCards from "../components/PricingCards";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";
import { mockFetch } from "../mocks/api";

const PLAN_PRICES = {
  free: { amount: 0, currency: "eur" },
  business: { amount: 4900, currency: "eur" }, // €49.00
  enterprise: { amount: null, currency: "eur" } // Custom pricing
};

export default function Billing() {
  const [searchParams] = useSearchParams();
  const { user, jwt, logout, navigate } = useAuth();
  const { t, lang } = useI18n();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [sessionId] = useState(searchParams.get("session"));
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);

  // Load current plan from user profile
  useEffect(() => {
    if (user?.plan) {
      setCurrentPlan(user.plan);
    }
    // Handle successful payment redirect
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [user, sessionId]);

  async function verifyPayment(sessionId) {
    try {
      const res = await mockFetch(`/billing/verify-session?session_id=${sessionId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data.plan);
        // Refresh user data
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to verify payment:", err);
    }
  }

  async function handleSubscribe(selectedPlan) {
    // Enterprise redirects to demo booking
    if (selectedPlan === "enterprise") {
      navigate("/demo");
      return;
    }

    if (!jwt) {
      navigate(`/login?plan=${selectedPlan}`);
      return;
    }

    // Free plan - no payment needed
    if (selectedPlan === "free") {
      try {
        const res = await mockFetch("/billing/downgrade", {
          method: "POST",
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (res.ok) {
          setCurrentPlan("free");
          alert(lang === "pl" ? "Plan Free aktywowany." : "Free plan activated.");
        }
      } catch {
        alert("Service unavailable. Please try later.");
      }
      return;
    }

    // Paid plans - create Stripe checkout session
    setIsLoading(true);
    try {
      const priceData = PLAN_PRICES[selectedPlan];
      const res = await mockFetch("/billing/create-checkout-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}` 
        },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: priceData.amount,
          currency: priceData.currency,
          success_url: `${window.location.origin}/billing?session={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/billing`
        }),
      });
      
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert(lang === "pl" 
        ? "Błąd płatności. Spróbuj ponownie lub skontaktuj się z nami."
        : "Payment error. Please try again or contact us."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm(lang === "pl" 
      ? "Czy na pewno chcesz anulować subskrypcję? Wrócisz do planu Free."
      : "Are you sure you want to cancel your subscription? You'll be downgraded to Free."
    )) return;

    try {
      const res = await mockFetch("/billing/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        setCurrentPlan("free");
        alert(lang === "pl" 
          ? "Subskrypcja anulowana. Plan Free aktywny do końca okresu."
          : "Subscription cancelled. Free plan active until period end."
        );
      }
    } catch {
      alert("Service unavailable. Please try later.");
    }
  }

  const isPaidPlan = currentPlan !== "free" && currentPlan !== "enterprise";

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">{t("billing.title")}</div>
        <h2>{t("billing.title")}</h2>
        
        {/* Current Plan Status */}
        <div style={{
          padding: 24,
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 32
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
                {lang === "pl" ? "Aktualny plan" : "Current Plan"}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                {user?.email}
              </div>
            </div>
            
            {isPaidPlan && (
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                >
                  {lang === "pl" ? "Anuluj subskrypcję" : "Cancel Subscription"}
                </button>
              </div>
            )}
          </div>
          
          {sessionId && (
            <div className="auth-msg success" style={{ marginTop: 16 }}>
              {lang === "pl" 
                ? "Płatność zakończona sukcesem! Twój plan jest teraz aktywny."
                : "Payment successful! Your plan is now active."}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              padding: 32,
              background: "var(--bg-card)",
              borderRadius: 12,
              textAlign: "center"
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: "3px solid var(--border)",
                borderTop: "3px solid var(--accent-blue)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px"
              }} />
              <p>{lang === "pl" ? "Przetwarzanie płatności..." : "Processing payment..."}</p>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <PricingCards 
          onSubscribe={handleSubscribe} 
          currentPlan={currentPlan}
        />

        {/* Payment Info */}
        <div style={{
          marginTop: 48,
          padding: 24,
          borderRadius: 12,
          background: "rgba(0,0,0,0.2)",
          fontSize: 13,
          color: "var(--text-muted)"
        }}>
          <p style={{ margin: "0 0 8px 0" }}>
            🔒 {lang === "pl" 
              ? "Płatności obsługiwane przez Stripe. Twoje dane są bezpieczne."
              : "Payments processed by Stripe. Your data is secure."}
          </p>
          <p style={{ margin: 0 }}>
            {lang === "pl"
              ? "Możesz anulować subskrypcję w dowolnym momencie. Zwroty wg polityki Stripe."
              : "You can cancel anytime. Refunds according to Stripe policy."}
          </p>
        </div>
      </div>
    </div>
  );
}
