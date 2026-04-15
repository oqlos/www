import { createContext, useContext, useState, useCallback } from "react";
import en from "./en.json";
import pl from "./pl.json";

const dictionaries = { en, pl };
const SUPPORTED_LANGS = Object.keys(dictionaries);

const I18nContext = createContext();

function getInitialLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch {}
  const browser = navigator.language?.slice(0, 2);
  return SUPPORTED_LANGS.includes(browser) ? browser : "en";
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  }, []);

  const dict = dictionaries[lang] || dictionaries.en;

  const t = useCallback((key, vars) => {
    const keys = key.split(".");
    let val = dict;
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) return key;
    }
    if (typeof val === "string" && vars) {
      return val.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
    }
    return val;
  }, [dict]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, SUPPORTED_LANGS }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
