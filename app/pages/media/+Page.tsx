import { mediaItems } from "../../content/media.js";

export default function MediaPage() {
  const articles = mediaItems.filter(item => item.category === 'article');
  const podcasts = mediaItems.filter(item => item.category === 'podcast');

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Media
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Articles, podcasts, and other content I've created exploring technology, travel, and urban development.
        </p>
      </div>

      {/* Articles Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <a href={`/media/${article.id}`} className="block">
                  {article.title}
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-4">
                <a
                  href={`/media/${article.id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Read more
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Podcasts Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Podcasts
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {podcasts.map((podcast) => (
            <article
              key={podcast.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>{new Date(podcast.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{podcast.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <a href={podcast.url} target="_blank" rel="noopener noreferrer" className="block">
                  {podcast.title}
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {podcast.excerpt}
              </p>
              <div className="mt-4">
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Listen now
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


