import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";
import { contract } from "../ts-rest/contract";
// TODO: stop using universal-middleware and directly integrate server middlewares instead and/or use vike-server https://vike.dev/server. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import { Get, UniversalHandler } from "@universal-middleware/core";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({});
const TABLE = process.env.LEDGER_TABLE_NAME ?? "";

/**
 * ts-rest route
 *
 * @link {@see https://ts-rest.com/docs/serverless/fetch-runtimes/}
 **/
const router = tsr.platformContext<object>().router(contract, {
  demo: async () => {
    return {
      status: 200,
      body: {
        demo: true,
      },
    };
  },
  createTodo: async ({ body }, _ctx) => {
    console.log("Received new todo", { text: body.text });
    return {
      status: 200,
      body: {
        status: "Ok",
      },
    };
  },

  getLedgerState: async ({ query }) => {
    if (!TABLE) return { status: 500, body: { error: "LEDGER_TABLE_NAME not configured" } };
    try {
      const result = await dynamo.send(new GetItemCommand({
        TableName: TABLE,
        Key: marshall({ userId: query.userId, dataKey: "ledger#state" }),
      }));
      if (!result.Item) return { status: 200, body: { state: null, updatedAt: null } };
      const item = unmarshall(result.Item);
      return { status: 200, body: { state: item.state as never, updatedAt: item.updatedAt as string } };
    } catch (e) {
      console.error("getLedgerState error", e);
      return { status: 500, body: { error: "Failed to read ledger state" } };
    }
  },

  saveLedgerState: async ({ body, query }) => {
    if (!TABLE) return { status: 500, body: { error: "LEDGER_TABLE_NAME not configured" } };
    try {
      const updatedAt = new Date().toISOString();
      await dynamo.send(new PutItemCommand({
        TableName: TABLE,
        Item: marshall({ userId: query.userId, dataKey: "ledger#state", state: body, updatedAt }, { removeUndefinedValues: true }),
      }));
      return { status: 200, body: { ok: true, updatedAt } };
    } catch (e) {
      console.error("saveLedgerState error", e);
      return { status: 500, body: { error: "Failed to save ledger state" } };
    }
  },
});

export const tsRestHandler: Get<[], UniversalHandler> = () => async (request, ctx, runtime) =>
  fetchRequestHandler({
    request: new Request(request.url, request),
    contract,
    router,
    options: {},
    platformContext: {
      ...ctx,
      ...runtime,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
