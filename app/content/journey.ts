export type JourneyStop = {
  country: string;
  flag: string;
  startYear: number;
  // null while I still live there
  endYear: number | null;
  description: string;
};

export const journey: JourneyStop[] = [
  {
    country: "Canada",
    flag: "🇨🇦",
    startYear: 1995,
    endYear: 2015,
    description: "Born in Toronto, grew up in rural Ontario. First trips abroad after finishing school.",
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    startYear: 2015,
    endYear: 2019,
    description: "Bachelor's in Groningen, and a teaching assistant at the University of Groningen.",
  },
  {
    country: "Malta",
    flag: "🇲🇹",
    startYear: 2017,
    endYear: 2018,
    description: "Erasmus exchange in the middle of the Mediterranean.",
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    startYear: 2019,
    endYear: 2021,
    description: "Joined Homegate AG in Zurich: developer, then engineering manager, then Head of Engineering at SMG.",
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    startYear: 2021,
    endYear: null,
    description: "Based in Helsinki, leading engineering teams and building products of my own.",
  },
];
