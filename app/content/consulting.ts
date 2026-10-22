import { EMAIL } from "./links.js";
import type { TileTone } from "../types/bento.js";

export type ConsultingService = {
  title: string;
  summary: string;
  includes: string[];
  // Where I've done this before; every claim here comes from content/experience.ts
  proof: string;
  tone: TileTone;
};

export const consultingServices: ConsultingService[] = [
  {
    title: "Fractional Head of Engineering",
    summary: "Interim or part-time engineering leadership for marketplace teams that need direction now.",
    includes: ["Org design and team scaling", "Coaching engineering managers", "Feedback, ownership and delivery practices"],
    proof: "Head of Engineering for SMG Real Estate B2B; grew Homegate's team from 2 to 6.",
    tone: "ink",
  },
  {
    title: "Marketplace mergers and integration",
    summary: "Bringing two platforms, and the teams behind them, together without losing momentum.",
    includes: ["Platform and codebase integration plans", "Aligning orgs, processes and ownership", "Retiring duplicate legacy systems"],
    proof: "Drove the integration of immoscout24.ch and homegate.ch at SMG.",
    tone: "coral",
  },
  {
    title: "B2B monetisation and product",
    summary: "Engineering that grows revenue from the professional side of a marketplace.",
    includes: ["Product ladders and packaging", "Third-party services and partners", "Billing and transaction systems"],
    proof: "Led engineering for a B2B line worth around 40% of SMG revenue.",
    tone: "sun",
  },
  {
    title: "Build and modernise platforms",
    summary: "Hands-on architecture and delivery when the platform itself is the bottleneck.",
    includes: ["Identity and authentication", "Centralising customer data", "Data aggregation and AI extraction on AWS"],
    proof: "Built Homegate's AWS Cognito auth; built and run JobCrawls end to end.",
    tone: "sage",
  },
];

export const CONSULTING_ENQUIRY_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent("Consulting enquiry")}`;
