import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import { useI18n } from "../i18n/I18nProvider";

export default function SharedNav({ user, onLogout }) {
  const { t } = useI18n();
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
      <div className="nav-links">
        <Link to="/dashboard">{t("nav.dashboard")}</Link>
        <Link to="/scenarios">{t("nav.scenarios")}</Link>
        <Link to="/nlp">{t("nav.nlp")}</Link>
        <Link to="/billing">{t("nav.billing")}</Link>
        <Link to="/account">{t("nav.account")}</Link>
        <Link to="/status">{t("nav.status")}</Link>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user?.email}</span>
        <LangSwitch />
        <ThemeToggle />
        {onLogout && (
          <button className="btn btn-outline btn-sm" onClick={onLogout}>{t("nav.logout")}</button>
        )}
      </div>
    </nav>
  );
}
