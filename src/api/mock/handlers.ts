import { rest } from "msw";
import mockData from "./data.json";

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

  //handles GET /columns requests
  rest.get("/columns", (req, res, ctx) => {
    const id = req.url.searchParams.get("boardId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.columns.filter(
          (column) => column.boardId.toString() === id
        ),
      })
    );
  }),

  //handles GET /tasks requests
  rest.get("/tasks", (req, res, ctx) => {
    const id = req.url.searchParams.get("boardId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.tasks.filter((task) => task.boardId.toString() === id),
      })
    );
  }),

  //handles GET /tasks requests
  rest.get("/subtasks", (req, res, ctx) => {
    const id = req.url.searchParams.get("taskId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.subtasks.filter(
          (subtask) => subtask.taskId.toString() === id
        ),
      })
    );
  }),
];

//   // handles GET /columns requests
//   rest.get("/columns", () => {}),

//   //handles GET /tasks requests
//   rest.get("/tasks", () => {}),

//   //handles GET /subtasks requests
//   rest.get("/subtasks", () => {}),
