import { useState, useEffect } from "react";
import SharedNav from "../components/SharedNav";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { mockFetch } from "../mocks/api";
import ProfileSection from "./account/ProfileSection";
import SubscriptionSection from "./account/SubscriptionSection";
import PaymentHistorySection from "./account/PaymentHistorySection";
import SlackWebhookSettings from "../components/SlackWebhookSettings";
import DangerZoneSection from "./account/DangerZoneSection";

export default function Account() {
  const { user, jwt, logout, navigate } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  
  // Subscription state
  const [subscription, setSubscription] = useState({
    plan: user?.plan || "free",
    status: "active",
    cancel_at_period_end: false,
    current_period_end: null,
  });

  // Payment history
  const [payments, setPayments] = useState([
    {
      id: 1,
      date: "2026-04-01",
      amount: "€49.00",
      status: "paid",
      description: "Pro Plan - Monthly",
    },
  ]);

  useEffect(() => {
    if (user) {
      setSubscription({
        plan: user.plan || "free",
        status: "active",
        cancel_at_period_end: false,
        current_period_end: user.current_period_end || null,
      });
    }
  }, [user]);

  async function handleProfileUpdate(formData) {
    setLoading(true);
    setMessage(null);

    try {
      const res = await mockFetch("/api/user/profile", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: t("account.profile_updated") });
      } else {
        setMessage({ type: "error", text: t("account.update_failed") });
      }
    } catch {
      setMessage({ type: "error", text: t("account.update_failed") });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm(t("account.cancel_confirm"))) return;

    setLoading(true);
    try {
      const res = await mockFetch("/billing/subscription/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (res.ok) {
        setSubscription(prev => ({ ...prev, cancel_at_period_end: true }));
        setMessage({ type: "success", text: t("account.subscription_cancelled") });
      }
    } catch {
      setMessage({ type: "error", text: t("account.cancel_failed") });
    } finally {
      setLoading(false);
    }
  }

  async function handleReactivateSubscription() {
    setLoading(true);
    try {
      const res = await mockFetch("/billing/subscription/reactivate", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (res.ok) {
        setSubscription(prev => ({ ...prev, cancel_at_period_end: false }));
        setMessage({ type: "success", text: t("account.subscription_reactivated") });
      }
    } catch {
      setMessage({ type: "error", text: t("account.reactivate_failed") });
    } finally {
      setLoading(false);
    }
  }

  function handleExportData() {
    const exportData = {
      profile: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        company: user?.company || "",
        phone: user?.phone || "",
        role: user?.role,
        created_at: user?.created_at,
      },
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end,
      },
      payments: payments,
      exported_at: new Date().toISOString(),
      export_version: "1.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `oqlos-account-data-${user?.email || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setMessage({ type: "success", text: t("account.data_exported") });
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">Account</div>
        <h2>{t("account.title")}</h2>
        <p className="section-desc">
          {t("account.subtitle")}
        </p>

        {message && (
          <div className={`auth-msg ${message.type}`} style={{ marginBottom: 24 }}>
            {message.text}
          </div>
        )}

        <ProfileSection
          user={user}
          jwt={jwt}
          loading={loading}
          onProfileUpdate={handleProfileUpdate}
          onExportData={handleExportData}
        />

        <SubscriptionSection
          subscription={subscription}
          loading={loading}
          onCancel={handleCancelSubscription}
          onReactivate={handleReactivateSubscription}
          onChangePlan={() => navigate("/billing")}
          onUpgrade={() => navigate("/billing")}
        />

        <PaymentHistorySection payments={payments} />

        <SlackWebhookSettings />

        <DangerZoneSection onLogout={logout} />
      </div>
    </div>
  );
}
