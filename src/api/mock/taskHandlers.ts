import { rest } from "msw";
import { stringify } from "querystring";
// import { db } from ".";
import { ITask, ITaskConstructor, ITaskEntities } from "../../@types/types";
import { dbActionErrorWrapper, paramMissing, send405WithBody } from "./utils";

// const RESPONSE_DELAY = 0;
// const TASKS_ENPOINT = "/kbapi/tasks";
// /**
//  *  Definitions for CRUD opertations on the tasks table.
//  */
// export const taskHandlers = [
//   //handles GET /tasks requests
//   rest.get(TASKS_ENPOINT, (req, res, ctx) => {
//     const boardId = req.url.searchParams.get("boardId");
//     if (!boardId) {
//       return paramMissing(res, ctx, "boardID", "query");
//     }
//     return res(
//       ctx.status(200),
//       ctx.delay(RESPONSE_DELAY),
//       ctx.json(
//         db.task.findMany({
//           where: { board: { id: { equals: boardId } } },
//         })
//       )
//     );
//   }),

//   //handles POST /task requests (create single task)
//   rest.post(TASKS_ENPOINT, async (req, res, ctx) => {
//     const {
//       subtasks,
//       column: clientCol,
//       board: clientBoard,
//       ...task
//     } = await req.json<ITaskConstructor>();

//     const column = db.column.findFirst({
//       where: { id: { equals: clientCol.id } },
//     });

//     const board = db.board.findFirst({
//       where: { id: { equals: clientBoard.id } },
//     });

//     try {
//       if (!column || !board)
//         throw new Error(
//           "A column or board could not be found for with the data provided"
//         );

//       const taskEntity = db.task.create({ ...task, column, board });
//       const subtaskEntities = subtasks.map((title) => {
//         const subtask = {
//           title,
//           isCompleted: false,
//           task: taskEntity,
//         };
//         return db.subtask.create(subtask);
//       });

//       return res(
//         ctx.status(201),
//         ctx.body(JSON.stringify({ taskEntity, subtaskEntities }))
//       );
//     } catch (error) {
//       return send405WithBody(
//         res,
//         ctx,
//         error,
//         "An error occured when trying to create a new task."
//       );
//     }
//   }),

//   rest.put(TASKS_ENPOINT, async (req, res, ctx) => {
//     const tasks = await req.json<ITask[]>();
//     try {
//       if (!tasks) throw new Error("No body found in request.");
      
//       const column = db.column.findFirst({
//         where: { id: { equals: tasks[0].column.id } },
//       });

//       const board = db.board.findFirst({
//         where: { id: { equals: tasks[0].board.id } },
//       });

//       if (!column || !board)
//         throw new Error("Column or Board could not be determined.");

//       const newEntities = tasks.map(({ id, ...task }) =>
//         db.task.update({
//           where: { id: { equals: id } },
//           data: { ...task, board, column },
//         })
//       );
//       return res(ctx.status(200), ctx.json(JSON.stringify(newEntities)));
//     } catch (error) {
//       return send405WithBody(
//         res,
//         ctx,
//         error,
//         "An error occured while updating the tasks. "
//       );
//     }
//   }),

//   //handles PATCH /task requests (update single task)
//   rest.patch(TASKS_ENPOINT, async (req, res, ctx) => {
//     const {
//       id,
//       column: oldColumn,
//       board,
//       ...restOfTask
//     }: ITask = await req.json();
//     return dbActionErrorWrapper(id, res, ctx, () => {
//       const task = db.task.findFirst({ where: { id: { equals: id } } });

//       let newColumn = task?.column;
//       if (restOfTask.status !== oldColumn.name) {
//         const entity = db.column.findFirst({
//           where: { name: { equals: restOfTask.status } },
//         });

//         if (entity) newColumn = entity;
//       }

//       db.task.update({
//         where: { id: { equals: id } },
//         data: { ...restOfTask, column: newColumn },
//       });
//     });
//   }),

//   //handles DELETE /task reqeusts (single deletion)
//   rest.delete(TASKS_ENPOINT + "/:taskId", (req, res, ctx) => {
//     const { taskId } = req.params;
//     try {
//       if (typeof taskId === "string") {
//         db.task.delete({ where: { id: { equals: taskId } } });
//         return res(ctx.status(204));
//       } else {
//         throw new Error("taskId provided is not a string");
//       }
//     } catch (error) {
//       return send405WithBody(
//         res,
//         ctx,
//         error,
//         "An error occcured while trying to delete a task."
//       );
//     }
//   }),
// ];
