import { createEntityAdapter } from "@reduxjs/toolkit";
import { IColumn, IBoardPostBody, IColumnQuery } from "../../@types/types";
import { apiSlice } from "../api/apiSlice";

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
    updateColumns: builder.mutation({
      query: (columns: IBoardPostBody) => ({
        url: `/columns`,
        method: "POST",
        body: { columns },
      }),
      invalidatesTags: ["Column"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const updateResult = dispatch(
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

        try {
          await queryFulfilled;
        } catch (error) {
          updateResult.undo();
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
