import { useI18n } from "../../i18n/I18nProvider";

export default function SubscriptionSection({ subscription, loading, onCancel, onReactivate, onChangePlan, onUpgrade }) {
  const { t } = useI18n();

  return (
    <div className="account-section">
      <h3>{t("account.subscription_title")}</h3>
      <div className="subscription-card">
        <div className="subscription-info">
          <div className="subscription-plan">
            <span className="plan-label">{t("account.current_plan")}</span>
            <span className={`plan-badge ${subscription.plan}`}>
              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </span>
          </div>
          <div className="subscription-status">
            <span className="status-label">{t("account.status")}</span>
            <span className={`status-badge ${subscription.status}`}>
              {subscription.status}
            </span>
          </div>
          {subscription.current_period_end && (
            <div className="subscription-renewal">
              <span className="renewal-label">{t("account.renews_on")}</span>
              <span className="renewal-date">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}
          {subscription.cancel_at_period_end && (
            <div className="subscription-cancelled">
              {t("account.will_cancel")}
            </div>
          )}
        </div>
        <div className="subscription-actions">
          {subscription.plan !== "free" && (
            <>
              {subscription.cancel_at_period_end ? (
                <button
                  className="btn btn-primary"
                  onClick={onReactivate}
                  disabled={loading}
                >
                  {t("account.reactivate")}
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  {t("account.cancel")}
                </button>
              )}
              <button
                className="btn btn-outline"
                onClick={onChangePlan}
              >
                {t("account.change_plan")}
              </button>
            </>
          )}
          {subscription.plan === "free" && (
            <button
              className="btn btn-primary"
              onClick={onUpgrade}
            >
              {t("account.upgrade")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
