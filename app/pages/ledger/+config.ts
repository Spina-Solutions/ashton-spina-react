import type { Config } from "vike/types";
import Layout from "./LedgerLayout.js";

export default {
  title: "The Ledger — Household & Holdings",
  description: "Editorial budget dashboard — household, business, and runway on one page.",
  Layout,
  ssr: false,
} satisfies Config;
