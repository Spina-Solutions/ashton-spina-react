import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  // Fallbacks; pages set their own via +config, +title and +description
  title: "Ashton Spina · Marketplace engineering leader and builder",
  description:
    "Ashton Spina builds and leads marketplace engineering from Helsinki: consulting through TechTactics Oy, products like JobCrawls, and travel photography from 31 countries.",
  lang: "en",

  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config;
