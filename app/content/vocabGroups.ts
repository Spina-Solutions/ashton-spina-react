export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type VocabWord = { term: string; meaning: string };

export type VocabGroup = {
  id: string;
  title: string;
  tiers: Partial<Record<CEFR, VocabWord[]>>;
};

export const vocabGroups: VocabGroup[] = [
  {
    id: "prepositions",
    title: "Prepositions",
    tiers: {
      A1: [
        { term: "en", meaning: "in/on/at" },
        { term: "a", meaning: "to/at" },
        { term: "de", meaning: "of/from" },
        { term: "con", meaning: "with" },
        { term: "sin", meaning: "without" },
        { term: "por", meaning: "for/by/through" },
        { term: "para", meaning: "for/to/in order to" },
      ],
      A2: [
        { term: "sobre", meaning: "about/over/on" },
        { term: "entre", meaning: "between/among" },
        { term: "hasta", meaning: "until/up to" },
        { term: "desde", meaning: "since/from" },
      ],
    },
  },
  {
    id: "connectors",
    title: "Connectors & Fillers",
    tiers: {
      A1: [
        { term: "y", meaning: "and" },
        { term: "o", meaning: "or" },
        { term: "pero", meaning: "but" },
        { term: "porque", meaning: "because" },
        { term: "también", meaning: "also/too" },
        { term: "muy", meaning: "very" },
      ],
      A2: [
        { term: "aunque", meaning: "although" },
        { term: "entonces", meaning: "then/so" },
        { term: "además", meaning: "in addition" },
      ],
    },
  },
  {
    id: "conjunctions",
    title: "Conjunctions",
    tiers: {
      A1: [
        { term: "que", meaning: "that/which" },
        { term: "si", meaning: "if" },
      ],
      A2: [
        { term: "cuando", meaning: "when" },
        { term: "mientras", meaning: "while" },
      ],
    },
  },
  {
    id: "travel",
    title: "Travel",
    tiers: {
      A1: [
        { term: "el tren", meaning: "train" },
        { term: "el avión", meaning: "plane" },
        { term: "el hotel", meaning: "hotel" },
        { term: "el billete", meaning: "ticket" },
      ],
      A2: [
        { term: "la reserva", meaning: "reservation" },
        { term: "la maleta", meaning: "suitcase" },
        { term: "el pasaporte", meaning: "passport" },
      ],
    },
  },
  {
    id: "home",
    title: "Home",
    tiers: {
      A1: [
        { term: "la casa", meaning: "house" },
        { term: "la habitación", meaning: "room" },
        { term: "la cocina", meaning: "kitchen" },
        { term: "el baño", meaning: "bathroom" },
      ],
      A2: [
        { term: "el salón", meaning: "living room" },
        { term: "el dormitorio", meaning: "bedroom" },
        { term: "el jardín", meaning: "garden" },
      ],
    },
  },
  {
    id: "slang",
    title: "Slang & Colloquialisms",
    tiers: {
      B1: [
        { term: "tío/tía", meaning: "dude/gal (Spain)" },
        { term: "guay", meaning: "cool (Spain)" },
        { term: "pasta", meaning: "money (slang, Spain)" },
      ],
    },
  },
];


