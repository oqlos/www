const PLANS = [
  {
    id: "free",
    label: "Open Source",
    name: "OqlOS Free",
    price: "€0",
    period: "Apache 2.0 — forever",
    features: [
      "oql-core parser + interpreter",
      "oql-cli (oqlctl)",
      "TestQL runner",
      "1 device, local only",
      "Docker compose (dev)",
      "Community support"
    ],
    cta: "Download from GitHub",
    ctaAction: "github",
    featured: false
  },
  {
    id: "starter",
    label: "For individuals",
    name: "Starter",
    price: "€19",
    pricePeriod: "/month",
    period: "per user · cancel anytime",
    features: [
      "Everything from Free +",
      "Up to 5 devices",
      "Web IDE (OqlIDE)",
      "Scenario library",
      "Basic PDF reports",
      "Email support (48h)"
    ],
    cta: "Start trial",
    ctaAction: "subscribe",
    featured: false
  },
  {
    id: "pro",
    label: "Recommended",
    name: "OqlOS Pro",
    price: "€49",
    pricePeriod: "/month",
    period: "per org · cancel anytime",
    features: [
      "Everything from Starter +",
      "Unlimited devices",
      "Fleet management",
      "Advanced compliance reports",
      "Docker prod with TLS",
      "Priority email support (24h)",
      "Team collaboration"
    ],
    cta: "Start trial",
    ctaAction: "subscribe",
    featured: true
  },
  {
    id: "business",
    label: "For teams",
    name: "Business",
    price: "€149",
    pricePeriod: "/month",
    period: "per org · cancel anytime",
    features: [
      "Everything from Pro +",
      "Up to 20 team members",
      "SSO / SAML authentication",
      "Audit log API",
      "Custom integrations",
      "SLA: 99.9% uptime",
      "Chat support"
    ],
    cta: "Start trial",
    ctaAction: "subscribe",
    featured: false
  },
  {
    id: "enterprise",
    label: "For enterprises",
    name: "Enterprise",
    price: "Custom",
    period: "contact for pricing",
    features: [
      "Everything from Business +",
      "Unlimited team members",
      "On-premise deployment",
      "White-label branding",
      "Custom hardware drivers",
      "ERP / LIMS integration",
      "SLA: 99.99% uptime",
      "Dedicated support engineer",
      "On-site training"
    ],
    cta: "Contact sales",
    ctaAction: "contact",
    featured: false
  }
];

export default function PricingCards({ onSubscribe, currentPlan = "free" }) {
  const handleCta = (plan) => {
    if (plan.ctaAction === "github") {
      window.open("https://github.com/oqlos/oqlos", "_blank");
    } else if (plan.ctaAction === "contact") {
      window.location.href = "/demo";
    } else {
      onSubscribe?.(plan.id);
    }
  };

  return (
    <div className="pricing-grid" style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 24,
      maxWidth: 1400,
      margin: "0 auto"
    }}>
      {PLANS.map((plan) => (
        <div 
          key={plan.id}
          className={`price-card ${plan.featured ? "featured" : ""} ${currentPlan === plan.id ? "current" : ""}`}
          style={{
            position: "relative",
            borderRadius: 12,
            border: plan.featured 
              ? "2px solid var(--accent-blue)" 
              : currentPlan === plan.id 
                ? "2px solid var(--success)"
                : "1px solid var(--border)",
            padding: 24,
            background: plan.featured 
              ? "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 50%)"
              : currentPlan === plan.id
                ? "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 50%)"
                : "var(--bg-card)"
          }}
        >
          {currentPlan === plan.id && (
            <div style={{
              position: "absolute",
              top: -12,
              right: 16,
              background: "var(--success)",
              color: "white",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600
            }}>
              Current Plan
            </div>
          )}
          
          <div className="price-label" style={{ 
            fontSize: 12, 
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: plan.featured ? "var(--accent-blue)" : "var(--text-muted)",
            marginBottom: 8,
            fontWeight: 600
          }}>
            {plan.label}
          </div>
          
          <h3 style={{ margin: "0 0 8px 0", fontSize: 22 }}>{plan.name}</h3>
          
          <div className="price-amount" style={{ 
            fontSize: plan.price === "Custom" ? 28 : 36, 
            fontWeight: 700,
            marginBottom: 4
          }}>
            {plan.price}
            {plan.pricePeriod && (
              <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>
                {plan.pricePeriod}
              </span>
            )}
          </div>
          
          <div className="price-period" style={{ 
            fontSize: 13, 
            color: "var(--text-muted)",
            marginBottom: 20
          }}>
            {plan.period}
          </div>
          
          <ul className="price-features" style={{ 
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px 0",
            fontSize: 14,
            lineHeight: 1.8
          }}>
            {plan.features.map((feature, idx) => (
              <li key={idx} style={{ 
                display: "flex", 
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 8
              }}>
                <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span>
                <span style={{ color: "var(--text-muted)" }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            className={`btn ${plan.featured ? "btn-primary" : "btn-outline"}`}
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => handleCta(plan)}
            disabled={currentPlan === plan.id}
          >
            {currentPlan === plan.id ? "Current Plan" : plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
