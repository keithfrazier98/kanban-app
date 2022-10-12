import { rest } from "msw";
import mockData from "./data.json"

export const handlers = [
  //handles GET /boards requests
  rest.get("/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.boards,
      })
    );
  }),

  //handles POST /boards requests
  rest.post("/boards", () => {}),
];

//   // handles GET /columns requests
//   rest.get("/columns", () => {}),

//   //handles GET /tasks requests
//   rest.get("/tasks", () => {}),

//   //handles GET /subtasks requests
//   rest.get("/subtasks", () => {}),
