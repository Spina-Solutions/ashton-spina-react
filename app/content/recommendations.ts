export type RecommendationCategory = "travel" | "film-tv" | "restaurants" | "books" | "albums";

export type Recommendation = {
  title: string;
  description?: string;
  year?: string;
  link?: string;
  linkText?: string;
  category: RecommendationCategory;
};

export const recommendations: Recommendation[] = [
  // Travel
  {
    title: "Cinque Terre, Italy",
    description: "Five colorful fishing villages along the Italian Riviera with stunning coastal views and hiking trails",
    year: "2024",
    category: "travel"
  },
  {
    title: "Hoi An, Vietnam",
    description: "Ancient town with lantern-lit streets, incredible street food, and beautiful architecture",
    year: "2023",
    category: "travel"
  },
  {
    title: "Santorini, Greece",
    description: "Iconic white-washed buildings, breathtaking sunsets, and crystal-clear waters",
    year: "2023",
    category: "travel"
  },
  {
    title: "Kyoto, Japan",
    description: "Traditional temples, bamboo forests, and the perfect blend of ancient and modern Japan",
    year: "2022",
    category: "travel"
  },

  // Film & TV
  {
    title: "The Bear",
    description: "Intense drama about a fine-dining chef returning to run his family's Chicago sandwich shop",
    year: "2024",
    category: "film-tv",
    link: "https://www.hulu.com/series/the-bear",
    linkText: "Hulu"
  },
  {
    title: "Succession",
    description: "Dark comedy-drama about a dysfunctional media dynasty and the battle for control",
    year: "2023",
    category: "film-tv",
    link: "https://www.hbo.com/succession",
    linkText: "HBO"
  },
  {
    title: "Everything Everywhere All at Once",
    description: "Mind-bending multiverse adventure that's both hilarious and deeply moving",
    year: "2022",
    category: "film-tv",
    link: "https://www.imdb.com/title/tt6710474/",
    linkText: "IMDb"
  },
  {
    title: "Dune",
    description: "Epic sci-fi adaptation with stunning visuals and complex world-building",
    year: "2021",
    category: "film-tv",
    link: "https://www.imdb.com/title/tt1160419/",
    linkText: "IMDb"
  },

  // Restaurants
  {
    title: "Osteria Francescana",
    description: "Three-Michelin-starred restaurant in Modena, Italy, by Massimo Bottura",
    year: "2024",
    category: "restaurants",
    link: "https://www.osteriafrancescana.it/",
    linkText: "Website"
  },
  {
    title: "Noma",
    description: "Revolutionary Nordic cuisine in Copenhagen, consistently ranked among the world's best",
    year: "2023",
    category: "restaurants",
    link: "https://noma.dk/",
    linkText: "Website"
  },
  {
    title: "Sukiyabashi Jiro",
    description: "Legendary sushi restaurant in Tokyo, made famous by the documentary 'Jiro Dreams of Sushi'",
    year: "2022",
    category: "restaurants",
    link: "https://www.imdb.com/title/tt1772925/",
    linkText: "Documentary"
  },
  {
    title: "El Celler de Can Roca",
    description: "Three-Michelin-starred restaurant in Girona, Spain, known for innovative Catalan cuisine",
    year: "2021",
    category: "restaurants",
    link: "https://cellercanroca.com/",
    linkText: "Website"
  },

  // Books
  {
    title: "The Seven Moons of Maali Almeida",
    description: "Winner of the 2022 Booker Prize, a ghost story set during the Sri Lankan civil war",
    year: "2024",
    category: "books",
    link: "https://www.goodreads.com/book/show/58946817-the-seven-moons-of-maali-almeida",
    linkText: "Goodreads"
  },
  {
    title: "Klara and the Sun",
    description: "Kazuo Ishiguro's exploration of artificial intelligence and what it means to be human",
    year: "2023",
    category: "books",
    link: "https://www.goodreads.com/book/show/54120408-klara-and-the-sun",
    linkText: "Goodreads"
  },
  {
    title: "Project Hail Mary",
    description: "Andy Weir's space adventure about a lone astronaut trying to save humanity",
    year: "2022",
    category: "books",
    link: "https://www.goodreads.com/book/show/54493401-project-hail-mary",
    linkText: "Goodreads"
  },
  {
    title: "The Midnight Library",
    description: "Matt Haig's thought-provoking novel about life's infinite possibilities",
    year: "2021",
    category: "books",
    link: "https://www.goodreads.com/book/show/52578297-the-midnight-library",
    linkText: "Goodreads"
  },

  // Albums
  {
    title: "Midnights",
    description: "Taylor Swift's introspective pop album exploring sleepless nights and self-reflection",
    year: "2024",
    category: "albums",
    link: "https://open.spotify.com/album/151w1FgRZfnKZA9FEcg9Z3",
    linkText: "Spotify"
  },
  {
    title: "Renaissance",
    description: "Beyoncé's dance-heavy album celebrating Black and queer culture",
    year: "2023",
    category: "albums",
    link: "https://open.spotify.com/album/5tJfX7GrJPNTXfU1W8Kq2c",
    linkText: "Spotify"
  },
  {
    title: "Dawn FM",
    description: "The Weeknd's concept album about the afterlife, blending pop and electronic sounds",
    year: "2022",
    category: "albums",
    link: "https://open.spotify.com/album/2nLOHgzXzwFEpl62zAgCEC",
    linkText: "Spotify"
  },
  {
    title: "Sour",
    description: "Olivia Rodrigo's debut album capturing the raw emotions of teenage heartbreak",
    year: "2021",
    category: "albums",
    link: "https://open.spotify.com/album/6s84u2TupR3wdUv4NgKA2j",
    linkText: "Spotify"
  }
];
