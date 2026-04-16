import { useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";

export default function ProfileSection({ user, jwt, loading, onProfileUpdate, onExportData }) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onProfileUpdate(formData);
  };

  return (
    <div className="account-section">
      <h3>{t("account.profile_title")}</h3>
      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label>{t("account.name")}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>{t("account.email")}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>{t("account.company")}</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={loading}
            placeholder={t("account.company_placeholder")}
          />
        </div>
        <div className="form-group">
          <label>{t("account.phone")}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
            placeholder={t("account.phone_placeholder")}
          />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t("account.saving") : t("account.save_profile")}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onExportData}
          >
            {t("account.export_data")}
          </button>
        </div>
      </form>
    </div>
  );
}
