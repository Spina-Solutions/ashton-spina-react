type ArchiveProject = {
  year: string;
  name: string;
  description?: string;
  madeAt: string;
  builtWith: string[];
  link?: string;
  linkText?: string;
};

const archiveProjects: ArchiveProject[] = [
  {
    year: "2024",
    name: "JobCrawls",
    description: "Aggregated job search platform with smart filtering, alerts, and advanced search capabilities across multiple job boards",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Vite", "Web Scraping", "Real-time Alerts"],
    link: "https://jobcrawls.com",
    linkText: "jobcrawls.com"
  },
  {
    year: "2024",
    name: "Conjugr8",
    description: "Comprehensive language learning platform focused on Spanish verbs, grammar, and conjugation practice with interactive exercises",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vike", "SSR", "Interactive Learning"],
    link: "https://conjugr8.com",
    linkText: "conjugr8.com"
  },
  {
    year: "2024",
    name: "Travel Atlas",
    description: "Interactive world travel platform with comprehensive guides, maps, and travel planning tools for global destinations",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Mapbox", "Node.js", "PostgreSQL", "Geospatial Data", "Travel APIs"],
    link: "https://travel-atlas.com",
    linkText: "travel-atlas.com"
  },
  {
    year: "2024",
    name: "Personal Website",
    description: "Modern portfolio website with dual-mode functionality, SSR, dark mode, and comprehensive project showcase",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Vite", "Vike", "Tailwind CSS", "AWS CDK", "SSR", "Dual Mode UI"],
    link: "https://ashtonspina.com",
    linkText: "ashtonspina.com"
  },
  {
    year: "2024",
    name: "Spanish Learning Tools",
    description: "Comprehensive Spanish language learning platform with vocabulary groups, conjugation practice, and progress tracking",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Interactive Maps", "Progress Tracking", "Language Learning APIs"],
    link: "https://ashtonspina.com",
    linkText: "View on site"
  },
  {
    year: "2024",
    name: "Games for Your Group",
    description: "Interactive platform for discovering and organizing group games and activities for social gatherings",
    madeAt: "Personal",
    builtWith: ["React", "TypeScript", "Game Management", "Social Features", "Activity Planning"],
    link: "https://gamesforyourgroup.com",
    linkText: "gamesforyourgroup.com"
  },
  {
    year: "2023",
    name: "SMG Engineering Leadership",
    description: "Led engineering teams and architectural decisions for multiple B2B platforms serving real estate professionals",
    madeAt: "SMG Swiss Marketplace Group",
    builtWith: ["Team Leadership", "Architecture Design", "Microservices", "AWS", "React", "TypeScript", "Node.js"],
    link: "https://www.linkedin.com/company/smg-marketplace/"
  },
  {
    year: "2022",
    name: "SMG Real Estate B2B Platform",
    description: "Lead engineering for Real Estate B2B platform contributing ~40% of SMG revenue with advanced property management tools",
    madeAt: "SMG Swiss Marketplace Group",
    builtWith: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL", "Microservices", "Real Estate APIs"],
    link: "https://www.linkedin.com/company/smg-marketplace/"
  },
  {
    year: "2021",
    name: "Homegate Platform Modernization",
    description: "Scaled engineering team from 5 to 15+ developers and transitioned legacy platform to modern cloud architecture",
    madeAt: "Homegate AG",
    builtWith: ["React", "TypeScript", "AWS Cognito", "Node.js", "Docker", "Kubernetes", "CI/CD", "Team Scaling"],
    link: "https://www.linkedin.com/company/smg-marketplace/"
  },
  {
    year: "2020",
    name: "Homegate Analytics & Reporting",
    description: "Built comprehensive analytics dashboards and reporting systems to improve customer trust and business insights",
    madeAt: "Homegate AG",
    builtWith: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL", "Redis", "Data Visualization"],
    link: "https://www.linkedin.com/company/homegate/"
  },
  {
    year: "2020",
    name: "Homegate User Experience Platform",
    description: "Developed user experience improvements and A/B testing framework for property search and listing features",
    madeAt: "Homegate AG",
    builtWith: ["React", "TypeScript", "A/B Testing", "User Research", "Performance Optimization"],
    link: "https://www.linkedin.com/company/homegate/"
  },
  {
    year: "2019",
    name: "Belsimpel Claims Management System",
    description: "Rebuilt entire claims processing flow with richer data collection, automated risk monitoring, and fraud detection",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js", "PHP", "MariaDB", "Redis", "Queue Workers", "Fraud Detection", "Risk Assessment"],
    link: "https://www.linkedin.com/company/belsimpel/"
  },
  {
    year: "2019",
    name: "Belsimpel SaaS Integration Platform",
    description: "Built auxiliary SaaS platform to integrate multiple systems and accelerate feature development across products",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js", "PHP", "MySQL", "REST APIs", "Webhooks", "System Integration"],
    link: "https://www.linkedin.com/company/belsimpel/"
  },
  {
    year: "2019",
    name: "Belsimpel E-commerce Platform",
    description: "Developed and maintained e-commerce platform for mobile device sales with payment processing and inventory management",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js", "PHP", "Payment APIs", "Inventory Management", "E-commerce"],
    link: "https://www.linkedin.com/company/belsimpel/"
  },
  {
    year: "2018",
    name: "Belsimpel Finance & Reporting Systems",
    description: "Expanded finance systems with advanced reporting, data visualization, and automated financial workflows",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["PHP", "DHTML", "MariaDB", "JavaScript", "Chart.js", "PDF Generation", "Financial APIs"],
    link: "https://www.linkedin.com/company/belsimpel/"
  },
  {
    year: "2018",
    name: "Belsimpel Customer Portal",
    description: "Built customer self-service portal for account management, order tracking, and support ticket system",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js", "PHP", "MySQL", "Customer Service", "Order Management"],
    link: "https://www.linkedin.com/company/belsimpel/"
  },
  {
    year: "2017",
    name: "Wander - Cognitive Sensors Research App",
    description: "Android research application for cognitive testing and mind-wandering data collection with advanced analytics",
    madeAt: "University of Groningen",
    builtWith: ["Android", "Java", "SQLite", "Research APIs", "Data Analytics", "Cognitive Testing", "Machine Learning"],
    link: "https://github.com/RUGSoftEng/2017-Cognitive-Sensors",
    linkText: "GitHub"
  },
  {
    year: "2017",
    name: "University Teaching Assistant Platform",
    description: "Educational platform for teaching assistance, automated grading, and comprehensive student project support",
    madeAt: "University of Groningen",
    builtWith: ["Various", "Educational Tools", "Grading Systems", "Student Management", "Automated Assessment"],
    link: "https://www.linkedin.com/school/university-of-groningen/"
  },
  {
    year: "2016",
    name: "Computer Science Capstone Project",
    description: "Advanced software engineering project demonstrating full-stack development and system architecture skills",
    madeAt: "University of Groningen",
    builtWith: ["Full-Stack Development", "System Architecture", "Database Design", "Software Engineering"],
    link: "https://www.linkedin.com/school/university-of-groningen/"
  },
  {
    year: "2015-2017",
    name: "Academic Research Projects",
    description: "Multiple research projects in software engineering, algorithms, and computer science theory",
    madeAt: "University of Groningen",
    builtWith: ["Research", "Algorithms", "Data Structures", "Academic Writing", "Statistical Analysis"],
    link: "https://www.linkedin.com/school/university-of-groningen/"
  }
];

export default function ArchivePage() {
  return (
    <div className="max-w-3xl">
      <header className="pb-8">
        <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight text-gray-900 dark:text-gray-100">
          All Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          A comprehensive list of projects I've worked on over the years.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Year
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Project
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Made at
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Built with
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {archiveProjects.map((project: ArchiveProject, index: number) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {project.year}
                </td>
                <td className="py-4 px-2">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </div>
                  {project.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.description}
                    </div>
                  )}
                </td>
                <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.madeAt}
                </td>
                <td className="py-4 px-2">
                  <div className="flex flex-wrap gap-1">
                    {project.builtWith.map((tech: string, techIndex: number) => (
                      <span 
                        key={techIndex}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-2">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {project.linkText || 'View'}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
