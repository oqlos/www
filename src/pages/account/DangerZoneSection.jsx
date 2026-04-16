import { useI18n } from "../../i18n/I18nProvider";

export default function DangerZoneSection({ onLogout }) {
  const { t } = useI18n();

  return (
    <div className="account-section danger-zone">
      <h3>{t("account.danger_zone")}</h3>
      <p className="danger-desc">{t("account.danger_desc")}</p>
      <button
        className="btn btn-outline btn-danger"
        onClick={onLogout}
      >
        {t("account.logout_all")}
      </button>
    </div>
  );
}
