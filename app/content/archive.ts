export type ArchiveProject = {
  year: string;
  name: string;
  description: string;
  madeAt: string;
  // Only technologies confirmed from the project itself or the role title
  builtWith?: string[];
  link?: string;
};

export const archiveProjects: ArchiveProject[] = [
  {
    year: "2024",
    name: "JobCrawls",
    description: "Aggregates Finland's job market from company career pages and other sources, using AI to extract structured data for search and filtering.",
    madeAt: "TechTactics Oy",
    builtWith: ["React", "Vike", "Hono", "Tailwind CSS", "TypeScript", "AWS Lambda", "Athena"],
    link: "https://jobcrawls.com",
  },
  {
    year: "2024",
    name: "Conjugr8",
    description: "Verb and grammar trainer for Romance languages, built for fast repetition over gamification, with web and mobile apps.",
    madeAt: "Personal",
    builtWith: ["React", "Vite", "Vike", "React Native", "Expo", "TypeScript"],
    link: "https://conjugr8.com",
  },
  {
    year: "2024",
    name: "Travel Atlas",
    description: "A trip planner built to solve my own travel planning. No longer maintained.",
    madeAt: "Personal",
    link: "https://travel-atlas.com",
  },
  {
    year: "2024",
    name: "This website",
    description: "Personal site with a personal and a work mode, server-rendered at the edge.",
    madeAt: "Personal",
    builtWith: ["React", "Vike", "Hono", "Tailwind CSS", "TypeScript", "AWS CDK", "Lambda@Edge"],
    link: "https://ashtonspina.com",
  },
  {
    year: "2022",
    name: "homegate.ch and immoscout24.ch merger, flatfox acquisition",
    description: "Part of merging two of Switzerland's largest property marketplaces into SMG Real Estate, integrating their organisations and processes, and of its later acquisition of flatfox.",
    madeAt: "SMG Swiss Marketplace Group",
    link: "https://www.linkedin.com/company/smg-marketplace/",
  },
  {
    year: "2022",
    name: "Real Estate B2B engineering",
    description: "Led engineering for the Real Estate B2B business, contributing around 40% of SMG revenue, and coached its engineering managers.",
    madeAt: "SMG Swiss Marketplace Group",
    link: "https://www.linkedin.com/company/smg-marketplace/",
  },
  {
    year: "2020",
    name: "Authentication and customer data",
    description: "Built modern authentication and authorisation, centralised customer data and retired legacy systems, improving conversion and security.",
    madeAt: "Homegate AG",
    builtWith: ["AWS Cognito"],
    link: "https://www.linkedin.com/company/homegate/",
  },
  {
    year: "2020",
    name: "Product ladder and third-party services",
    description: "Expanded Homegate's product ladder and targeted third-party services to grow revenue, while scaling the team from 2 to 6.",
    madeAt: "Homegate AG",
    link: "https://www.linkedin.com/company/homegate/",
  },
  {
    year: "2019",
    name: "Analytics dashboards and billing",
    description: "Built analytics and reporting dashboards for customers and rebuilt the transaction service for more efficient billing.",
    madeAt: "Homegate AG",
    link: "https://www.linkedin.com/company/homegate/",
  },
  {
    year: "2019",
    name: "Claims flow and risk monitoring",
    description: "Rebuilt the claims flow to cut time-to-repair and manual work, and added claim risk monitoring to reduce fraud.",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js"],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    year: "2018",
    name: "Pricing, reseller portal and integrations",
    description: "Dynamic device-based pricing, a reseller portal internationalised for Germany and Belgium, and an internal SaaS to integrate systems.",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["Laravel", "Vue.js"],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    year: "2018",
    name: "Finance reporting",
    description: "Expanded finance systems for richer reporting and data presentation.",
    madeAt: "Belsimpel (Gomibo)",
    builtWith: ["PHP", "MariaDB"],
    link: "https://www.linkedin.com/company/belsimpel/",
  },
  {
    year: "2017",
    name: "Wander (Cognitive Sensors)",
    description: "Android research app for cognitive testing and collecting mind-wandering data.",
    madeAt: "University of Groningen",
    builtWith: ["Android"],
    link: "https://github.com/RUGSoftEng/2017-Cognitive-Sensors",
  },
];
