export type Language = {
  code: string;
  name: string;
  enabled: boolean;
};

export const romanceLanguages: Language[] = [
  { code: "es", name: "Spanish", enabled: true },
  { code: "fr", name: "French", enabled: false },
  { code: "it", name: "Italian", enabled: false },
  { code: "pt", name: "Portuguese", enabled: false },
  { code: "ro", name: "Romanian", enabled: false },
  { code: "ca", name: "Catalan", enabled: false },
];

export const defaultLanguageCode = "es";


