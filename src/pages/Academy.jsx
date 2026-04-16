import { useState } from "react";
import SharedNav from "../components/SharedNav";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

export default function Academy() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [activeModule, setActiveModule] = useState("getting-started");

  const modules = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of OqlOS and write your first test",
      duration: "15 min",
      lessons: [
        { id: 1, title: "Introduction to OqlOS", duration: "3 min" },
        { id: 2, title: "Understanding OQL Syntax", duration: "5 min" },
        { id: 3, title: "Writing Your First Test", duration: "7 min" },
      ],
    },
    {
      id: "hardware-control",
      title: "Hardware Control",
      description: "Control pumps, valves, sensors with OQL",
      duration: "30 min",
      lessons: [
        { id: 1, title: "Modbus Integration", duration: "8 min" },
        { id: 2, title: "GPIO and I²C", duration: "10 min" },
        { id: 3, title: "Sensor Reading", duration: "7 min" },
        { id: 4, title: "Actuator Control", duration: "5 min" },
      ],
    },
    {
      id: "api-testing",
      title: "API Testing with TestQL",
      description: "Test REST APIs with IQL/TestQL",
      duration: "25 min",
      lessons: [
        { id: 1, title: "IQL Basics", duration: "5 min" },
        { id: 2, title: "HTTP Methods", duration: "8 min" },
        { id: 3, title: "Assertions", duration: "7 min" },
        { id: 4, title: "API Test Scenarios", duration: "5 min" },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Topics",
      description: "NLP, CI/CD, and production deployment",
      duration: "45 min",
      lessons: [
        { id: 1, title: "NLP Console", duration: "10 min" },
        { id: 2, title: "CI/CD Integration", duration: "15 min" },
        { id: 3, title: "Production Deployment", duration: "12 min" },
        { id: 4, title: "Monitoring and Debugging", duration: "8 min" },
      ],
    },
  ];

  const activeModuleData = modules.find(m => m.id === activeModule);

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">Academy</div>
        <h2>{t("academy.title")}</h2>
        <p className="section-desc">
          {t("academy.subtitle")}
        </p>

        <div style={{ display: "flex", gap: 32, marginTop: 32 }}>
          {/* Module List */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ marginBottom: 16 }}>Modules</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {modules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: activeModule === module.id ? "2px solid var(--accent-blue)" : "1px solid var(--border)",
                    cursor: "pointer",
                    background: activeModule === module.id ? "var(--bg-hover)" : "transparent",
                  }}
                >
                  <h4 style={{ marginBottom: 4 }}>{module.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
                    {module.description}
                  </p>
                  <span style={{ fontSize: 12, color: "var(--accent-blue)" }}>
                    {module.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Content */}
          <div style={{ flex: 2, minWidth: 400 }}>
            <h3 style={{ marginBottom: 16 }}>{activeModuleData.title}</h3>
            <p style={{ marginBottom: 24, color: "var(--text-muted)" }}>
              {activeModuleData.description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {activeModuleData.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      {index + 1}. {lesson.title}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {lesson.duration}
                    </span>
                  </div>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13 }}>
                    Start
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: 24, borderRadius: 8, background: "var(--bg-hover)" }}>
              <h4 style={{ marginBottom: 8 }}>📚 Resources</h4>
              <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
                <li><a href="#" style={{ color: "var(--accent-blue)" }}>OQL Language Reference</a></li>
                <li><a href="#" style={{ color: "var(--accent-blue)" }}>TestQL/IQL Guide</a></li>
                <li><a href="#" style={{ color: "var(--accent-blue)" }}>Hardware Integration Docs</a></li>
                <li><a href="#" style={{ color: "var(--accent-blue)" }}>API Documentation</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
