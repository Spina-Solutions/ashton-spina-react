type Recommendation = {
  title: string;
  description?: string;
  year?: string;
  link?: string;
  linkText?: string;
  category: 'travel' | 'film-tv' | 'restaurants' | 'books' | 'albums';
};

const recommendations: Recommendation[] = [
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

export default function RecommendationsPage() {
  return (
    <div className="max-w-3xl">
      <header className="pb-8">
        <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight text-gray-900 dark:text-gray-100">
          Recommendations
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          A curated collection of my favorite experiences across travel, entertainment, dining, literature, and music.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Travel */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Travel
          </h2>
          <div className="space-y-3">
            {recommendations.filter(r => r.category === 'travel').map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</div>
                    {rec.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</div>
                    )}
                    {rec.year && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{rec.year}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Film & TV */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Film & TV
          </h2>
          <div className="space-y-3">
            {recommendations.filter(r => r.category === 'film-tv').map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.link ? (
                        <a href={rec.link} target="_blank" rel="noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {rec.title}
                        </a>
                      ) : (
                        rec.title
                      )}
                    </div>
                    {rec.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</div>
                    )}
                    {rec.year && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{rec.year}</div>
                    )}
                  </div>
                  {rec.link && rec.linkText && (
                    <a href={rec.link} target="_blank" rel="noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline shrink-0">
                      {rec.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Restaurants
          </h2>
          <div className="space-y-3">
            {recommendations.filter(r => r.category === 'restaurants').map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.link ? (
                        <a href={rec.link} target="_blank" rel="noreferrer" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          {rec.title}
                        </a>
                      ) : (
                        rec.title
                      )}
                    </div>
                    {rec.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</div>
                    )}
                    {rec.year && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{rec.year}</div>
                    )}
                  </div>
                  {rec.link && rec.linkText && (
                    <a href={rec.link} target="_blank" rel="noreferrer" className="text-xs text-red-600 dark:text-red-400 hover:underline shrink-0">
                      {rec.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Books */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Books
          </h2>
          <div className="space-y-3">
            {recommendations.filter(r => r.category === 'books').map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.link ? (
                        <a href={rec.link} target="_blank" rel="noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          {rec.title}
                        </a>
                      ) : (
                        rec.title
                      )}
                    </div>
                    {rec.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</div>
                    )}
                    {rec.year && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{rec.year}</div>
                    )}
                  </div>
                  {rec.link && rec.linkText && (
                    <a href={rec.link} target="_blank" rel="noreferrer" className="text-xs text-green-600 dark:text-green-400 hover:underline shrink-0">
                      {rec.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Albums */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Albums
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.filter(r => r.category === 'albums').map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.link ? (
                        <a href={rec.link} target="_blank" rel="noreferrer" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                          {rec.title}
                        </a>
                      ) : (
                        rec.title
                      )}
                    </div>
                    {rec.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</div>
                    )}
                    {rec.year && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{rec.year}</div>
                    )}
                  </div>
                  {rec.link && rec.linkText && (
                    <a href={rec.link} target="_blank" rel="noreferrer" className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline shrink-0">
                      {rec.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


