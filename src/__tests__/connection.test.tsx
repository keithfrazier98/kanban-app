import { connectToIDB } from "../api/indexeddb";
import { initServiceServer } from "../api/mock";
import { rest } from "msw";
import { indexedDB } from "fake-indexeddb";
import { setupServer } from "msw/node";
import { IBoardData } from "../@types/types";

const testHandler = () =>
  rest.get("/test", (req, res, ctx) => {
    return res(
      ctx.json({
        test: "success",
      })
    );
  });

const server = setupServer(testHandler());

// test the MSW server alone
test("MSW server can be setup properly in Jest", async () => {
  server.listen();
  const { test } = await (await fetch("/test")).json();

  expect(test).toBe("success");
  server.close();
});

//test the MSW server can be setup with IDB and still work properly
test("Indexed DB and MSW can be connected properly in Jest", async () => {
  //wait for IDB to resolve
  await connectToIDB(() => {}, indexedDB);

  const server = initServiceServer();
  server.use(testHandler());
  const { test } = await (await fetch("/test")).json();
  expect(test).toBe("success");
  server.close();
});

test("Indexed DB should setup and return mock data", async () => {
  await connectToIDB(() => {}, indexedDB);
  initServiceServer();
  const json: IBoardData[] = await (await fetch("/kbapi/boards")).json();

  expect(json.find((board) => board.name === "Roadmap")).toBeDefined();
});
