import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Ashton Spina — Living for the world's experiences",
  description:
    "Building thoughtful products. Exploring the world through code and photography. Full-stack developer with a passion for creating meaningful digital experiences.",

  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config;
