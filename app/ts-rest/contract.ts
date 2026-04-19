import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

// Ledger state blob — stored as opaque JSON, validated by presence of key fields
const LedgerStateSchema = z.object({
  income: z.record(z.unknown()),
  joint: z.array(z.unknown()),
  ashtonP: z.array(z.unknown()),
  mariaP: z.array(z.unknown()),
  assets: z.array(z.unknown()),
  debts: z.array(z.unknown()),
  ious: z.array(z.unknown()),
  bizCosts: z.array(z.unknown()),
  bizRevenue: z.number(),
  splitMode: z.string(),
  tax: z.record(z.number()),
  scenarios: z.array(z.unknown()),
  pensions: z.array(z.unknown()).optional(),
}).passthrough();

export type LedgerStatePayload = z.infer<typeof LedgerStateSchema>;

/**
 * ts-rest contract
 *
 * Create a contract, this should ideally be shared between your consumers and producers
 * Think of this as your HTTP Schema that both your client and backend can use.
 * @link {@see https://ts-rest.com/docs/core/}
 **/
export const contract = c.router(
  {
    demo: {
      method: "GET",
      path: "/demo",
      responses: {
        200: c.type<{ demo: boolean }>(),
      },
    },
    createTodo: {
      method: "POST",
      path: "/todo/create",
      body: c.type<{ text: string }>(),
      responses: {
        200: c.type<{ status: string }>(),
      },
      summary: "Create a Todo",
    },

    // Ledger API — save/load the full ledger state for a user
    getLedgerState: {
      method: "GET",
      path: "/ledger/state",
      query: z.object({ userId: z.string().default("ashton") }),
      responses: {
        200: c.type<{ state: LedgerStatePayload | null; updatedAt: string | null }>(),
        500: c.type<{ error: string }>(),
      },
      summary: "Get saved ledger state",
    },
    saveLedgerState: {
      method: "PUT",
      path: "/ledger/state",
      query: z.object({ userId: z.string().default("ashton") }),
      body: LedgerStateSchema,
      responses: {
        200: c.type<{ ok: boolean; updatedAt: string }>(),
        400: c.type<{ error: string }>(),
        500: c.type<{ error: string }>(),
      },
      summary: "Save ledger state",
    },
  },
  {
    pathPrefix: "/api",
  },
);
