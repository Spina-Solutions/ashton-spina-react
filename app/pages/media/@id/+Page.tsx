import type { PageProps } from "vike/types";
import { mediaItems } from "../../../content/media.js";

type Data = {
  article: typeof mediaItems[0];
};

export default function ArticlePage({ data }: PageProps<Data>) {
  const { article } = data;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <a
          href="/media"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Media
        </a>
      </div>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Article content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.content}
        </div>
      </div>

      {/* Article footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Published on {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <a
            href="/media"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Media
          </a>
        </div>
      </footer>
    </article>
  );
}


