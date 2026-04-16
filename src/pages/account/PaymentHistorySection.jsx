import { useI18n } from "../../i18n/I18nProvider";

export default function PaymentHistorySection({ payments }) {
  const { t } = useI18n();

  return (
    <div className="account-section">
      <h3>{t("account.payment_history")}</h3>
      <div className="payment-history">
        {payments.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>{t("account.date")}</th>
                <th>{t("account.description")}</th>
                <th>{t("account.amount")}</th>
                <th>{t("account.payment_status")}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>{payment.description}</td>
                  <td>{payment.amount}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-payments">{t("account.no_payments")}</p>
        )}
      </div>
    </div>
  );
}
