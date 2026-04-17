import { useState, useCallback, useRef } from "react";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import OqlStepRenderer from "../components/OqlStepRenderer";
import OqlReportRenderer from "../components/OqlReportRenderer";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

export default function Scenarios() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [activeExample, setActiveExample] = useState("pump-test");
  const [viewMode, setViewMode] = useState("graphical");
  const [reportData, setReportData] = useState(null);
  const fileInputRef = useRef(null);
  
  // Store edited code for each scenario separately
  const [scenarioCodes, setScenarioCodes] = useState(() => {
    const initial = {};
    Object.keys(OQL_EXAMPLES).forEach((key) => {
      initial[key] = OQL_EXAMPLES[key].code;
    });
    return initial;
  });
  
  const exampleKeys = Object.keys(OQL_EXAMPLES);
  const currentScenario = OQL_EXAMPLES[activeExample];
  const currentCode = scenarioCodes[activeExample];

  const handleCodeChange = useCallback((newCode) => {
    setScenarioCodes((prev) => ({
      ...prev,
      [activeExample]: newCode,
    }));
  }, [activeExample]);

  const handleTabChange = useCallback((key) => {
    setActiveExample(key);
  }, []);

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">Scenarios</div>
        <h2>{t("scenarios.title")}</h2>
        <p className="section-desc">
          {t("scenarios.subtitle")}
        </p>

        <div className="editor-section">
          <div className="example-tabs">
            {exampleKeys.map((k) => (
              <button
                key={k}
                className={`example-tab ${activeExample === k ? "active" : ""}`}
                onClick={() => handleTabChange(k)}
              >
                {OQL_EXAMPLES[k].title}
              </button>
            ))}
          </div>
          <CodeEditor 
            example={currentScenario} 
            value={currentCode}
            onChange={handleCodeChange}
          />
        </div>

        <div className="oql-view-toggle">
          <button
            className={viewMode === "graphical" ? "active" : ""}
            onClick={() => setViewMode("graphical")}
          >
            Protocol View
          </button>
          <button
            className={viewMode === "terminal" ? "active" : ""}
            onClick={() => setViewMode("terminal")}
          >
            Terminal
          </button>
          <button
            className={viewMode === "report" ? "active" : ""}
            onClick={() => setViewMode("report")}
          >
            Report
          </button>
        </div>

        {viewMode === "report" && (
          <div style={{ margin: '12px 0' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    setReportData(JSON.parse(ev.target.result));
                  } catch {
                    alert('Invalid JSON file');
                  }
                };
                reader.readAsText(file);
              }}
            />
            <button
              className="oql-report-export-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Load data.json
            </button>
          </div>
        )}

        {viewMode === "graphical" ? (
          <OqlStepRenderer
            scenarioData={currentScenario}
            code={currentCode}
          />
        ) : viewMode === "report" ? (
          <OqlReportRenderer data={reportData} />
        ) : (
          <TerminalSim 
            scenarioData={currentScenario}
            code={currentCode}
          />
        )}
      </div>
    </div>
  );
}
