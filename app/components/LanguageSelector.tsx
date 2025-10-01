import { romanceLanguages, defaultLanguageCode } from "../content/languages.js";
import { FlagIcon } from "./FlagIcon.js";

type Props = {
  selected?: string;
  onChange?: (code: string) => void;
};

export function LanguageSelector({ selected = defaultLanguageCode, onChange }: Props) {
  return (
    <div className={"max-w-full overflow-x-auto whitespace-nowrap inline-flex rounded-full border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-white/10 p-1"}>
      {romanceLanguages.map((lang) => {
        const isSelected = selected === lang.code;
        const base = "transition-colors px-2 py-1 rounded-full";
        const enabledClasses = isSelected
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
          : "text-gray-600 dark:text-gray-300";
        const disabledClasses = "cursor-not-allowed opacity-60";
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => (lang.enabled ? onChange?.(lang.code) : undefined)}
            aria-disabled={!lang.enabled}
            title={lang.enabled ? lang.name : `${lang.name} (coming soon)`}
            className={[base, "flex items-center gap-2", lang.enabled ? enabledClasses : disabledClasses].join(" ")}
          >
            <FlagIcon code={lang.code as any} />
            <span>{lang.name}</span>
          </button>
        );
      })}
    </div>
  );
}


