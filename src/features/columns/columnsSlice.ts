import { createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardColumn, IColumnState } from "../../@types/types";
import { apiSlice } from "../api/apiSlice";

const columnsAdapter = createEntityAdapter<IBoardColumn>({
  selectId: (column) => column.name,
});

const initialState = columnsAdapter.getInitialState<IColumnState>({
  ids: [],
  entities: {},
  status: "idle",
});

export const extendedColumnsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getColumns: builder.query({
      query: (boardId: string | undefined) => `/columns?boardId=${boardId}`,
      transformResponse: (response: IBoardColumn[]) => {
        return columnsAdapter.setAll(initialState, response);
      },
    }),
    deleteColumn: builder.mutation({
      query: (columnId) => ({
        url: `/columns/${columnId}}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Column", id: arg }],
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

export const { useGetColumnsQuery } = extendedColumnsApi;

