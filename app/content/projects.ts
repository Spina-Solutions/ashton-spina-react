import jobcrawlsLogo from "../assets/logos/jobcrawls_logo.svg";
import jobcrawlsCover from "../assets/projects/jobcrawls_cover.jpg";
import conjugr8Logo from "../assets/logos/conjugr8_logo.svg";
import conjugr8Cover from "../assets/projects/conjugr8_cover.jpg";
import travelAtlasLogo from "../assets/projects/travel-atlas.png";
import travelAtlasScreenshot from "../assets/projects/travel-atlas_screenshot.png";
import wanderLogo from "../assets/logos/wander_logo.jpg";
import type { TileTone } from "../types/bento.js";

export type ProjectStatus = "live" | "archived";

export type FeaturedProject = {
  name: string;
  description: string;
  href: string;
  logo: string;
  screenshot?: string;
  status: ProjectStatus;
  tone: TileTone;
};

export const featuredProjects: FeaturedProject[] = [
  {
    name: "JobCrawls",
    description: "Finland-focused job aggregator using AI to extract data features for robust searching and filtering.",
    href: "https://jobcrawls.com",
    logo: jobcrawlsLogo,
    screenshot: jobcrawlsCover,
    status: "live",
    tone: "plain",
  },
  {
    name: "Conjugr8",
    description: "Speed-focused language learning toolset and tracker, built for fast progress without time-wasting gamification.",
    href: "https://conjugr8.com",
    logo: conjugr8Logo,
    screenshot: conjugr8Cover,
    status: "live",
    tone: "sun",
  },
  {
    name: "Travel Atlas",
    description: "My first attempt at solving a personal problem: a trip planner for travel. No longer maintained.",
    href: "https://travel-atlas.com",
    logo: travelAtlasLogo,
    screenshot: travelAtlasScreenshot,
    status: "archived",
    tone: "sage",
  },
  {
    name: "Wander",
    description: "Android research app for cognitive testing and mind-wandering data, built at the University of Groningen.",
    href: "https://github.com/RUGSoftEng/2017-Cognitive-Sensors",
    logo: wanderLogo,
    status: "archived",
    tone: "plain",
  },
];
