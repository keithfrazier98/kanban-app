import { connectToIDB } from "../api/indexeddb";
import { initServiceServer, initServiceWorkers } from "../api/mock";
import { rest } from "msw";
import { indexedDB } from "fake-indexeddb";
import { setupServer } from "msw/node";

const testHandler = () =>
  rest.get("http://localhost:3000/test", (req, res, ctx) => {
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
  const { test } = await (await fetch("http://localhost:3000/test")).json();

  expect(test).toBe("success");
  server.close();
});

//test the MSW server can be setup with IDB and still work properly
test("Indexed DB and MSW can be connected properly in Jest", async () => {
  //wait for IDB to resolve
  await connectToIDB(() => {}, indexedDB);

  //
  const server = initServiceServer();
  server.use(testHandler());
  const { test } = await (await fetch("http://localhost:3000/test")).json();
  expect(test).toBe("success");
  server.close();
});
