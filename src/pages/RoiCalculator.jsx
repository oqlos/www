import { useState } from "react";
import SharedNav from "../components/SharedNav";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

export default function RoiCalculator() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  
  const [inputs, setInputs] = useState({
    currentTestEngineers: 5,
    avgSalary: 60000,
    testDurationHours: 8,
    testsPerMonth: 20,
    currentToolCost: 12000,
  });

  const calculateROI = () => {
    const currentMonthlyCost = inputs.currentTestEngineers * (inputs.avgSalary / 12) + (inputs.currentToolCost / 12);
    const oqlMonthlyCost = 49; // Starting at €49/month for Pro plan
    const monthlySavings = currentMonthlyCost - oqlMonthlyCost;
    const annualSavings = monthlySavings * 12;
    const roiPercentage = ((annualSavings / inputs.currentToolCost) * 100).toFixed(0);
    
    return {
      currentMonthlyCost,
      oqlMonthlyCost,
      monthlySavings,
      annualSavings,
      roiPercentage,
    };
  };

  const roi = calculateROI();

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">ROI Calculator</div>
        <h2>{t("roi.title")}</h2>
        <p className="section-desc">
          {t("roi.subtitle")}
        </p>

        <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
          {/* Input Section */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ marginBottom: 16 }}>{t("roi.your_current_setup")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t("roi.test_engineers")}
                </label>
                <input
                  type="number"
                  value={inputs.currentTestEngineers}
                  onChange={(e) => setInputs({ ...inputs, currentTestEngineers: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t("roi.avg_annual_salary")}
                </label>
                <input
                  type="number"
                  value={inputs.avgSalary}
                  onChange={(e) => setInputs({ ...inputs, avgSalary: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t("roi.test_duration_hours")}
                </label>
                <input
                  type="number"
                  value={inputs.testDurationHours}
                  onChange={(e) => setInputs({ ...inputs, testDurationHours: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t("roi.tests_per_month")}
                </label>
                <input
                  type="number"
                  value={inputs.testsPerMonth}
                  onChange={(e) => setInputs({ ...inputs, testsPerMonth: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t("roi.current_tool_cost")}
                </label>
                <input
                  type="number"
                  value={inputs.currentToolCost}
                  onChange={(e) => setInputs({ ...inputs, currentToolCost: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border)" }}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ marginBottom: 16 }}>{t("roi.your_savings")}</h3>
            <div style={{ 
              padding: 24, 
              borderRadius: 8, 
              background: "var(--bg-hover)", 
              border: "1px solid var(--border)" 
            }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
                  {t("roi.current_monthly_cost")}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>
                  €{roi.currentMonthlyCost.toFixed(0)}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
                  {t("roi.oql_monthly_cost")}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent-green)" }}>
                  €{roi.oqlMonthlyCost}
                </div>
              </div>

              <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, background: "var(--accent-blue)", color: "white" }}>
                <div style={{ fontSize: 14, marginBottom: 4, opacity: 0.9 }}>
                  {t("roi.monthly_savings")}
                </div>
                <div style={{ fontSize: 40, fontWeight: 700 }}>
                  €{roi.monthlySavings.toFixed(0)}
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
                    {t("roi.annual_savings")}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    €{roi.annualSavings.toFixed(0)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
                    {t("roi.roi_percentage")}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-green)" }}>
                    {roi.roiPercentage}%
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ marginTop: 24, width: "100%" }}
              onClick={() => window.location.href = "/billing"}
            >
              {t("roi.get_started")}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 32, padding: 24, borderRadius: 8, background: "var(--bg-hover)" }}>
          <h4 style={{ marginBottom: 12 }}>💡 {t("roi.assumptions_title")}</h4>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20, color: "var(--text-muted)" }}>
            <li>{t("roi.assumption_1")}</li>
            <li>{t("roi.assumption_2")}</li>
            <li>{t("roi.assumption_3")}</li>
            <li>{t("roi.assumption_4")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
