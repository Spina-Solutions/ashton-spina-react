export type GrammarRule = {
  title: string;
  explanation: string;
  examples: string[];
};

export type VocabularyCategory = {
  title: string;
  words: { term: string; meaning: string }[];
};

export type SentenceExercise = {
  prompt: string;
  answer: string;
};

export type ComprehensionItem = {
  paragraph: string;
  questions: { q: string; a: string }[];
};

export type SpeakingPrompt = {
  topic: string;
  instruction: string;
  starter?: string;
};

export const spanishContent = {
  language: "Spanish",
  code: "es",
  grammar: [
    {
      title: "Regular -ar verbs in present",
      explanation:
        "To conjugate -ar verbs, drop -ar and add: -o, -as, -a, -amos, -áis, -an.",
      examples: [
        "hablar → yo hablo, tú hablas, él/ella habla, nosotros hablamos, vosotros habláis, ellos hablan",
      ],
    },
    {
      title: "Regular -er verbs in present",
      explanation:
        "Drop -er and add: -o, -es, -e, -emos, -éis, -en.",
      examples: ["comer → yo como, tú comes, él come, nosotros comemos, vosotros coméis, ellos comen"],
    },
    {
      title: "Regular -ir verbs in present",
      explanation:
        "Drop -ir and add: -o, -es, -e, -imos, -ís, -en.",
      examples: ["vivir → yo vivo, tú vives, él vive, nosotros vivimos, vosotros vivís, ellos viven"],
    },
    {
      title: "Gender and number",
      explanation:
        "Most nouns ending in -o are masculine, -a feminine. Plural usually adds -s or -es.",
      examples: ["el perro / los perros", "la casa / las casas", "el lápiz / los lápices"],
    },
    {
      title: "Definite articles",
      explanation: "el (m.sg), la (f.sg), los (m.pl), las (f.pl).",
      examples: ["el libro, la mesa, los coches, las flores"],
    },
  ] as GrammarRule[],
  vocabulary: [
    {
      title: "Common verbs",
      words: [
        { term: "ser", meaning: "to be (essential)" },
        { term: "estar", meaning: "to be (state)" },
        { term: "tener", meaning: "to have" },
        { term: "ir", meaning: "to go" },
        { term: "hacer", meaning: "to do/make" },
      ],
    },
    {
      title: "Everyday nouns",
      words: [
        { term: "la casa", meaning: "house" },
        { term: "el trabajo", meaning: "work/job" },
        { term: "el café", meaning: "coffee" },
        { term: "el libro", meaning: "book" },
        { term: "la ciudad", meaning: "city" },
      ],
    },
    {
      title: "Adjectives",
      words: [
        { term: "grande", meaning: "big" },
        { term: "pequeño", meaning: "small" },
        { term: "rápido", meaning: "fast" },
        { term: "lento", meaning: "slow" },
        { term: "fácil", meaning: "easy" },
      ],
    },
  ] as VocabularyCategory[],
  sentences: [
    { prompt: "Yo __ café por la mañana (beber)", answer: "bebo" },
    { prompt: "Nosotros __ en Madrid (vivir)", answer: "vivimos" },
    { prompt: "¿__ tú español? (hablar)", answer: "hablas" },
  ] as SentenceExercise[],
  comprehension: {
    paragraph:
      "Sofía vive en Barcelona. Cada día toma el metro para ir al trabajo. Le gusta leer un libro durante el viaje y tomar un café cuando llega a la oficina.",
    questions: [
      { q: "¿Dónde vive Sofía?", a: "En Barcelona." },
      { q: "¿Cómo va al trabajo?", a: "En metro." },
      { q: "¿Qué le gusta hacer durante el viaje?", a: "Leer un libro." },
    ],
  } as ComprehensionItem,
  speaking: [
    {
      topic: "Presentarte",
      instruction: "Preséntate en 3-4 frases: nombre, origen, trabajo/estudios, aficiones.",
      starter: "Hola, me llamo... Soy de... Trabajo/Estudio... Me gusta...",
    },
    {
      topic: "En un café",
      instruction: "Imagina que pides en un café. Di lo que quieres y pregunta el precio.",
    },
  ] as SpeakingPrompt[],
} as const;

export type SpanishContent = typeof spanishContent;


