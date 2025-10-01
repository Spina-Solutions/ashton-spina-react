import { useEffect, useRef, useState } from "react";
import { romanceLanguages, defaultLanguageCode } from "../content/languages.js";
import { FlagIcon } from "./FlagIcon.js";

function getStoredLanguage(): string {
  try {
    return localStorage.getItem("language") || defaultLanguageCode;
  } catch {
    return defaultLanguageCode;
  }
}

function setStoredLanguage(code: string) {
  try {
    localStorage.setItem("language", code);
    window.dispatchEvent(new CustomEvent("language-changed", { detail: code }));
  } catch {
    // no-op
  }
}

export function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultLanguageCode);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelected(getStoredLanguage());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function choose(code: string) {
    setSelected(code);
    setStoredLanguage(code);
    setOpen(false);
  }

  const active = romanceLanguages.find((l) => l.code === selected) || romanceLanguages[0];

  return (
    <div className={"relative"} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={"inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <FlagIcon code={active.code as any} width={18} height={12} />
        <span className={"text-gray-800 dark:text-gray-200"}>{active.name}</span>
      </button>
      {open ? (
        <div
          className={"absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden z-50"}
          role="listbox"
        >
          {romanceLanguages.map((lang) => {
            const disabled = !lang.enabled;
            const isActive = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => (disabled ? undefined : choose(lang.code))}
                className={[
                  "flex w-full items-center gap-2 px-3 py-2 text-sm",
                  disabled ? "cursor-not-allowed opacity-60" : "hover:bg-gray-50 dark:hover:bg-gray-800",
                  isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200" : "",
                ].join(" ")}
                role="option"
                aria-selected={isActive}
                aria-disabled={disabled}
                title={disabled ? `${lang.name} (coming soon)` : lang.name}
              >
                <FlagIcon code={lang.code as any} width={18} height={12} />
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}


