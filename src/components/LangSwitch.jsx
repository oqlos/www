import { useI18n } from "../i18n/I18nProvider";

const FLAGS = { en: "🇬🇧", pl: "🇵🇱" };

export default function LangSwitch() {
  const { lang, setLang, SUPPORTED_LANGS } = useI18n();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language"
      style={{
        background: "var(--bg-card)", color: "var(--text-primary)",
        border: "1px solid var(--border)", borderRadius: 6,
        padding: "3px 6px", fontSize: 13, cursor: "pointer",
      }}
    >
      {SUPPORTED_LANGS.map((l) => (
        <option key={l} value={l}>{FLAGS[l] || l} {l.toUpperCase()}</option>
      ))}
    </select>
  );
}
