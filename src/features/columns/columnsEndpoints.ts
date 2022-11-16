import { createEntityAdapter } from "@reduxjs/toolkit";
import { IColumn, IColumnPostBody, IColumnQuery } from "../../@types/types";
import { apiSlice } from "../api/apiSlice";
import { boardsAdapter, extendedBoardsApi } from "../boards/boardsEndpoints";

const columnsAdapter = createEntityAdapter<IColumn>({
  selectId: (column) => column.id,
});

const initialColumnQueryState = columnsAdapter.getInitialState<IColumnQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

export const extendedColumnsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getall columns given a boardId in search param
    getColumns: builder.query({
      query: (boardId: string | undefined) => `/columns?boardId=${boardId}`,
      transformResponse: (response: IColumn[]) => {
        return columnsAdapter.setAll(initialColumnQueryState, response);
      },
      providesTags: ["Column"],
    }),
    // update multiple columns and board name
    updateColumns: builder.mutation({
      query: (columns: IColumnPostBody) => ({
        url: `/columns`,
        method: "POST",
        body: { columns },
      }),
      invalidatesTags: (result, error, arg) => {
        return ["Column", { type: "Board", id: arg.boardId }];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const updateColumns = dispatch(
          extendedColumnsApi.util.updateQueryData(
            "getColumns",
            arg.boardId,
            (draft) => {
              // draft is an immer copy of the state and can be mutated directly
              // update the state with the columns adapter to update the normalized data
              columnsAdapter.updateMany(draft, {
                payload: arg.updates.map((col) => ({
                  id: col.id,
                  changes: col,
                })),
                type: "",
              });
            }
          )
        );

        let updateBoard;
        if (arg.newName) {
          updateBoard = dispatch(
            extendedBoardsApi.util.updateQueryData(
              "getBoards",
              arg,
              (draft) => {
                if (arg.newName)
                  boardsAdapter.updateOne(draft, {
                    id: arg.boardId,
                    changes: {
                      ...draft.entities[arg.boardId],
                      name: arg.newName,
                    },
                  });
              }
            )
          );
        }

        try {
          await queryFulfilled;
        } catch (error) {
          updateColumns.undo();
          if (updateBoard) {
            updateBoard.undo();
          }
        }
      },
    }),
    // delete a single column given an in the path params
    deleteColumn: builder.mutation({
      query: (columnId: string) => ({
        url: `/columns/${columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Column"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const deleteResult = dispatch(
          extendedColumnsApi.util.updateQueryData(
            "getColumns",
            undefined,
            (draft) => {
              columnsAdapter.removeOne(draft, arg);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          deleteResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetColumnsQuery,
  useUpdateColumnsMutation,
  useDeleteColumnMutation,
} = extendedColumnsApi;
