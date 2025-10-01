export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="mx-auto max-w-3xl px-3 sm:px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#projects" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/#experience" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="/#photos" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Photography
                </a>
              </li>
              <li>
                <a href="/media" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Media
                </a>
              </li>
              <li>
                <a href="/archive" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Archive
                </a>
              </li>
              <li>
                <a href="/recommendations" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Recommendations
                </a>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Projects</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://jobcrawls.com" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  JobCrawls
                </a>
              </li>
              <li>
                <a href="https://conjugr8.com" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Conjugr8
                </a>
              </li>
              <li>
                <a href="https://travel-atlas.com" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Travel Atlas
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@ashtonspina.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Email
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/ashtonspina" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/ashtonspina" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Building thoughtful products. Exploring the world through code and photography.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Ashton Spina. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Built with React, Vite & Vike</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
