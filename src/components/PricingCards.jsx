export default function PricingCards({ onSubscribe }) {
  return (
    <div className="pricing-grid">
      <div className="price-card">
        <div className="price-label">Open Source</div>
        <h3>OqlOS Free</h3>
        <div className="price-amount">€0</div>
        <div className="price-period">Apache 2.0 — na zawsze</div>
        <ul className="price-features">
          <li>oql-core parser + interpreter</li>
          <li>oql-cli (oqlctl)</li>
          <li>TestQL runner</li>
          <li>Jedno urządzenie, lokalnie</li>
          <li>Docker compose (dev)</li>
          <li>Community support</li>
        </ul>
        <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          Pobierz z GitHub
        </button>
      </div>
      <div className="price-card featured">
        <div className="price-label">Rekomendowany</div>
        <h3>OqlOS Pro</h3>
        <div className="price-amount">
          €49<span style={{ fontSize: 16, fontWeight: 400, color: "var(--text-muted)" }}>/mies.</span>
        </div>
        <div className="price-period">per organizacja</div>
        <ul className="price-features">
          <li>Wszystko z Free +</li>
          <li>Multi-device fleet management</li>
          <li>OqlIDE (web editor)</li>
          <li>Biblioteka scenariuszy</li>
          <li>Raporty PDF + compliance</li>
          <li>Docker prod z TLS</li>
          <li>Email support</li>
        </ul>
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => onSubscribe?.("pro")}
        >
          Rozpocznij trial
        </button>
      </div>
      <div className="price-card">
        <div className="price-label">Dla dużych firm</div>
        <h3>Enterprise</h3>
        <div className="price-amount" style={{ fontSize: 28 }}>
          Indywidualnie
        </div>
        <div className="price-period">custom pricing</div>
        <ul className="price-features">
          <li>Wszystko z Pro +</li>
          <li>On-premise deployment</li>
          <li>White-label branding</li>
          <li>Custom hardware drivers</li>
          <li>Integracja ERP / LIMS</li>
          <li>SLA + dedicated support</li>
          <li>Szkolenia on-site</li>
        </ul>
        <button
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => onSubscribe?.("enterprise")}
        >
          Kontakt
        </button>
      </div>
    </div>
  );
}
