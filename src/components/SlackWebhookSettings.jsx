import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { mockFetch } from "../mocks/api";

const NOTIFICATION_EVENTS = [
  { id: "test_start", label: "Test started", default: false },
  { id: "test_success", label: "Test completed successfully", default: true },
  { id: "test_failure", label: "Test failed", default: true },
  { id: "test_error", label: "Test error/timeout", default: true },
  { id: "daily_summary", label: "Daily summary", default: false },
  { id: "weekly_report", label: "Weekly report", default: true },
];

export default function SlackWebhookSettings() {
  const { user, jwt } = useAuth();
  const { t, lang } = useI18n();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("#oqlos-alerts");
  const [enabled, setEnabled] = useState(false);
  const [events, setEvents] = useState(
    NOTIFICATION_EVENTS.reduce((acc, e) => ({ ...acc, [e.id]: e.default }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [testStatus, setTestStatus] = useState(null);

  // Load saved settings
  useEffect(() => {
    if (user?.slack_webhook) {
      setWebhookUrl(user.slack_webhook.url || "");
      setChannel(user.slack_webhook.channel || "#oqlos-alerts");
      setEnabled(user.slack_webhook.enabled || false);
      setEvents(user.slack_webhook.events || events);
    }
  }, [user]);

  async function handleSave() {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const res = await mockFetch("/integrations/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          url: webhookUrl,
          channel,
          enabled,
          events,
        }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: lang === "pl" 
            ? "Ustawienia Slack zapisane!"
            : "Slack settings saved!"
        });
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: lang === "pl"
          ? "Błąd zapisywania. Spróbuj ponownie."
          : "Error saving. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTest() {
    setTestStatus("sending");
    
    try {
      const res = await mockFetch("/integrations/slack/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          url: webhookUrl,
          channel,
        }),
      });

      if (res.ok) {
        setTestStatus("success");
        setTimeout(() => setTestStatus(null), 3000);
      } else {
        throw new Error("Test failed");
      }
    } catch (err) {
      setTestStatus("error");
      setTimeout(() => setTestStatus(null), 3000);
    }
  }

  const toggleEvent = (eventId) => {
    setEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  return (
    <div style={{
      padding: 24,
      borderRadius: 12,
      border: "1px solid var(--border)",
      background: "var(--bg-card)",
      marginBottom: 24
    }}>
      <h3 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 24 }}>💬</span>
        {lang === "pl" ? "Powiadomienia Slack" : "Slack Notifications"}
      </h3>
      
      <p style={{ color: "var(--text-muted)", margin: "0 0 20px 0", fontSize: 14 }}>
        {lang === "pl" 
          ? "Otrzymuj powiadomienia o testach bezpośrednio na Slack."
          : "Get test notifications directly in Slack."}
      </p>

      {message && (
        <div 
          className={`auth-msg ${message.type}`}
          style={{ marginBottom: 16 }}
        >
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12,
          cursor: "pointer",
          padding: 12,
          borderRadius: 8,
          background: enabled ? "rgba(59,130,246,0.1)" : "transparent",
          border: enabled ? "1px solid var(--accent-blue)" : "1px solid var(--border)"
        }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          <span style={{ fontWeight: 500 }}>
            {lang === "pl" ? "Włącz powiadomienia Slack" : "Enable Slack notifications"}
          </span>
        </label>
      </div>

      {enabled && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg-hover)",
                fontSize: 14
              }}
            />
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--text-muted)" }}>
              {lang === "pl" 
                ? "Utwórz webhook w Slack: Apps → Incoming Webhooks → Add to Slack"
                : "Create webhook in Slack: Apps → Incoming Webhooks → Add to Slack"}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
              {lang === "pl" ? "Kanał (opcjonalnie)" : "Channel (optional)"}
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="#oqlos-alerts"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg-hover)",
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
              {lang === "pl" ? "Wybierz zdarzenia" : "Select events"}
            </label>
            <div style={{ display: "grid", gap: 8 }}>
              {NOTIFICATION_EVENTS.map((event) => (
                <label 
                  key={event.id}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14
                  }}
                >
                  <input
                    type="checkbox"
                    checked={events[event.id]}
                    onChange={() => toggleEvent(event.id)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ color: events[event.id] ? "var(--text)" : "var(--text-muted)" }}>
                    {event.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isLoading || !webhookUrl}
            >
              {isLoading 
                ? (lang === "pl" ? "Zapisywanie..." : "Saving...")
                : (lang === "pl" ? "Zapisz ustawienia" : "Save settings")
              }
            </button>
            
            <button 
              className="btn btn-outline"
              onClick={handleTest}
              disabled={!webhookUrl || testStatus === "sending"}
            >
              {testStatus === "sending" 
                ? (lang === "pl" ? "Wysyłanie..." : "Sending...")
                : testStatus === "success"
                  ? "✓ " + (lang === "pl" ? "Wysłano!" : "Sent!")
                  : testStatus === "error"
                    ? "✗ " + (lang === "pl" ? "Błąd" : "Error")
                    : (lang === "pl" ? "Wyślij test" : "Send test")
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
}
