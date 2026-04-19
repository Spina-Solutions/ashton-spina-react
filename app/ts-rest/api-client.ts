import { initClient } from "@ts-rest/core";
import { contract } from "./contract.js";

// Browser-side ts-rest client — relative baseUrl works for same-origin API
export const apiClient = initClient(contract, {
  baseUrl: "",
  baseHeaders: {},
});
