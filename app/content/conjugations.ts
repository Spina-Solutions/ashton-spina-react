export type Pronoun =
  | "yo"
  | "tú"
  | "él"
  | "ella"
  | "usted"
  | "nosotros"
  | "vosotros"
  | "ellos"
  | "ellas"
  | "ustedes";

export type Tense = "present"; // Extend later

export type ConjugationTable = Record<Tense, Partial<Record<Pronoun, string>>>;

export type VerbData = {
  infinitive: string;
  english: string;
  conjugations: ConjugationTable;
};

export const spanishVerbs: VerbData[] = [
  {
    infinitive: "hablar",
    english: "to speak",
    conjugations: {
      present: {
        yo: "hablo",
        tú: "hablas",
        él: "habla",
        ella: "habla",
        usted: "habla",
        nosotros: "hablamos",
        vosotros: "habláis",
        ellos: "hablan",
        ellas: "hablan",
        ustedes: "hablan",
      },
    },
  },
  {
    infinitive: "comer",
    english: "to eat",
    conjugations: {
      present: {
        yo: "como",
        tú: "comes",
        él: "come",
        ella: "come",
        usted: "come",
        nosotros: "comemos",
        vosotros: "coméis",
        ellos: "comen",
        ellas: "comen",
        ustedes: "comen",
      },
    },
  },
  {
    infinitive: "vivir",
    english: "to live",
    conjugations: {
      present: {
        yo: "vivo",
        tú: "vives",
        él: "vive",
        ella: "vive",
        usted: "vive",
        nosotros: "vivimos",
        vosotros: "vivís",
        ellos: "viven",
        ellas: "viven",
        ustedes: "viven",
      },
    },
  },
  {
    infinitive: "ser",
    english: "to be (essential)",
    conjugations: {
      present: {
        yo: "soy",
        tú: "eres",
        él: "es",
        ella: "es",
        usted: "es",
        nosotros: "somos",
        vosotros: "sois",
        ellos: "son",
        ellas: "son",
        ustedes: "son",
      },
    },
  },
  {
    infinitive: "estar",
    english: "to be (state)",
    conjugations: {
      present: {
        yo: "estoy",
        tú: "estás",
        él: "está",
        ella: "está",
        usted: "está",
        nosotros: "estamos",
        vosotros: "estáis",
        ellos: "están",
        ellas: "están",
        ustedes: "están",
      },
    },
  },
  {
    infinitive: "tener",
    english: "to have",
    conjugations: {
      present: {
        yo: "tengo",
        tú: "tienes",
        él: "tiene",
        ella: "tiene",
        usted: "tiene",
        nosotros: "tenemos",
        vosotros: "tenéis",
        ellos: "tienen",
        ellas: "tienen",
        ustedes: "tienen",
      },
    },
  },
  {
    infinitive: "ir",
    english: "to go",
    conjugations: {
      present: {
        yo: "voy",
        tú: "vas",
        él: "va",
        ella: "va",
        usted: "va",
        nosotros: "vamos",
        vosotros: "vais",
        ellos: "van",
        ellas: "van",
        ustedes: "van",
      },
    },
  },
  {
    infinitive: "poder",
    english: "to be able to",
    conjugations: {
      present: {
        yo: "puedo",
        tú: "puedes",
        él: "puede",
        ella: "puede",
        usted: "puede",
        nosotros: "podemos",
        vosotros: "podéis",
        ellos: "pueden",
        ellas: "pueden",
        ustedes: "pueden",
      },
    },
  },
];

export const allPronouns: Pronoun[] = [
  "yo",
  "tú",
  "él",
  "ella",
  "usted",
  "nosotros",
  "vosotros",
  "ellos",
  "ellas",
  "ustedes",
];

export function stripAccents(input: string): string {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


