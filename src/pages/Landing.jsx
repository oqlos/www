import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import PricingCards from "../components/PricingCards";
import LangSwitch from "../components/LangSwitch";
import logger from "../utils/logger";
import { INSTALL_DOCKER, INSTALL_PIP, INSTALL_RPI } from "../data/install-commands";
import { config } from "../config";
import { useI18n } from "../i18n/I18nProvider";

export default function Landing() {
  const { t, lang } = useI18n();
  const [activeExample, setActiveExample] = useState("pump-test");
  const [activeTab, setActiveTab] = useState("docker");
  const [copiedTab, setCopiedTab] = useState(null);
  const exampleKeys = Object.keys(OQL_EXAMPLES);

  // A/B test: hero subtitle variant (a/b/c/d or random)
  const getVariant = () => {
    const params = new URLSearchParams(window.location.search);
    const paramVariant = params.get('variant');
    if (paramVariant && ['a', 'b', 'c', 'd'].includes(paramVariant)) {
      return paramVariant;
    }
    // Random assignment for true A/B test
    const variants = ['a', 'b', 'c', 'd'];
    return variants[Math.floor(Math.random() * variants.length)];
  };
  const [variant] = useState(getVariant);
  const heroSubtitle = t(`landing.hero_subtitle_variant_${variant}`) || t("landing.hero_subtitle");

  useEffect(() => {
    logger.info("Landing page loaded", "Landing", { exampleCount: exampleKeys.length });
  }, [exampleKeys.length]);

  const handleExampleChange = (key) => {
    setActiveExample(key);
    logger.debug(`Example changed to: ${key}`, "Landing", { key });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    logger.debug(`Tab changed to: ${tabId}`, "Landing", { tabId });
  };

  const handleCopy = (tab, code) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    logger.info(`Code copied for tab: ${tab}`, "Landing", { tab });
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="oqlos-root">
      {/* ═══ NAV ═══ */}
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <a href="#use-cases">{t("landing.features_label")}</a>
          <a href="#editor">{t("landing.editor_label")}</a>
          <a href="#pricing">{t("landing.pricing_label")}</a>
          <Link to="/login">{lang === 'pl' ? 'Zaloguj' : 'Login'}</Link>
          <LangSwitch />
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <header className="hero">
        <div className="hero-badge">{t("landing.badge")}</div>
        <h1>
          <em>OqlOS</em> + TestQL
        </h1>
        <p className="hero-sub">
          {heroSubtitle}
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => document.getElementById('use-cases')?.scrollIntoView({behavior:'smooth'})}>
            {t("landing.get_started")}
          </button>
          <button className="btn btn-outline" onClick={() => window.location.href = '/roi'}>
            {t("landing.cta_manager_roi")}
          </button>
          <button className="btn btn-outline" onClick={() => document.getElementById('editor')?.scrollIntoView({behavior:'smooth'})}>
            {t("landing.try_oql_live")}
          </button>
        </div>
      </header>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="section" style={{textAlign: 'center', padding: '60px 20px'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 24}}>
          <div>
            <div style={{fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)'}}>3</div>
            <div style={{fontSize: 14, color: 'var(--text-muted)'}}>Companies piloting</div>
          </div>
          <div>
            <div style={{fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)'}}>1200+</div>
            <div style={{fontSize: 14, color: 'var(--text-muted)'}}>Scenarios run</div>
          </div>
          <div>
            <div style={{fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)'}}>&lt;1s</div>
            <div style={{fontSize: 14, color: 'var(--text-muted)'}}>Response time</div>
          </div>
        </div>
        <p style={{fontSize: 14, color: 'var(--text-muted)'}}>Trusted by industrial QA teams in Poland and Germany</p>
      </section>

      {/* ═══ USE CASE CAROUSEL ═══ */}
      <section className="section" id="use-cases">
        <div className="section-label">{t("landing.ecosystem_label")}</div>
        <h2>{t("landing.ecosystem_title")}</h2>
        <p className="section-desc">
          {t("landing.ecosystem_desc")}
        </p>
        <div className="install-tabs" style={{justifyContent: 'center', marginBottom: 32}}>
          {[
            { id: "bhp", label: lang === 'pl' ? "Testy BHP" : "Safety Tests" },
            { id: "qa", label: "QA API/GUI" },
            { id: "devops", label: "DevOps" },
            { id: "pharma", label: "Pharma GxP" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`install-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚙</div>
            <h3>{t("landing.oql_feature_title")}</h3>
            <p>{t("landing.oql_feature_desc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>{t("landing.testql_feature_title")}</h3>
            <p>{t("landing.testql_feature_desc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🐳</div>
            <h3>{t("landing.docker_feature_title")}</h3>
            <p>{t("landing.docker_feature_desc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍓</div>
            <h3>{t("landing.rpi_feature_title")}</h3>
            <p>{t("landing.rpi_feature_desc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>{t("landing.rest_api_feature_title")}</h3>
            <p>{t("landing.rest_api_feature_desc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>{t("landing.reports_feature_title")}</h3>
            <p>{t("landing.reports_feature_desc")}</p>
          </div>
        </div>
      </section>

      {/* ═══ LIVE EDITOR ═══ */}
      <section className="section" id="editor">
        <div className="section-label">{t("landing.editor_label")}</div>
        <h2>{t("landing.editor_title")}</h2>
        <p className="section-desc">
          {t("landing.editor_desc")}
        </p>
        <div className="editor-section">
          <div className="editor-columns">
            <div className="example-tabs">
              {exampleKeys.map((k) => (
                <button
                  key={k}
                  className={`example-tab ${activeExample === k ? "active" : ""}`}
                  onClick={() => handleExampleChange(k)}
                >
                  {t(`landing.example_${k}`)}
                </button>
              ))}
            </div>
            <CodeEditor example={OQL_EXAMPLES[activeExample]} />
            <TerminalSim />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" style={{textAlign: 'center'}}>
        <div className="section-label">{lang === 'pl' ? "JAK TO DZIAŁA" : "HOW IT WORKS"}</div>
        <h2>{lang === 'pl' ? "3 kroki do automatyzacji" : "3 steps to automation"}</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginTop: 40}}>
          <div style={{flex: 1, minWidth: 250, maxWidth: 300}}>
            <div style={{fontSize: 48, marginBottom: 16}}>✍️</div>
            <h3 style={{marginBottom: 8}}>{lang === 'pl' ? "Pisz" : "Write"}</h3>
            <p style={{color: 'var(--text-muted)', fontSize: 14}}>
              {lang === 'pl' ? "Opisz test w naturalnym języku" : "Describe test in natural language"}
            </p>
          </div>
          <div style={{flex: 1, minWidth: 250, maxWidth: 300}}>
            <div style={{fontSize: 48, marginBottom: 16}}>⚙️</div>
            <h3 style={{marginBottom: 8}}>{lang === 'pl' ? "Uruchom" : "Run"}</h3>
            <p style={{color: 'var(--text-muted)', fontSize: 14}}>
              {lang === 'pl' ? "Wykonaj na sprzęcie lub w mocku" : "Execute on hardware or in mock mode"}
            </p>
          </div>
          <div style={{flex: 1, minWidth: 250, maxWidth: 300}}>
            <div style={{fontSize: 48, marginBottom: 16}}>📋</div>
            <h3 style={{marginBottom: 8}}>{lang === 'pl' ? "Raportuj" : "Report"}</h3>
            <p style={{color: 'var(--text-muted)', fontSize: 14}}>
              {lang === 'pl' ? "Eksportuj wyniki do PDF/CSV" : "Export results to PDF/CSV"}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="section" id="pricing">
        <div className="section-label">{t("landing.plans_label")}</div>
        <h2>{t("landing.plans_title")}</h2>
        <p className="section-desc">
          {t("landing.plans_desc")}
        </p>
        <PricingCards onSubscribe={(plan) => window.location.href = `/login?plan=${plan}`} />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <p>
          {t("landing.footer_text", { year: config.copyright })}
        </p>
        <p style={{marginTop:8}}>
          3 companies piloting · 1200+ scenarios run · &lt;1s response time
        </p>
      </footer>
    </div>
  );
}
