import { createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardColumn, IColumnQuery } from "../../@types/types";
import { apiSlice } from "../api/apiSlice";

const columnsAdapter = createEntityAdapter<IBoardColumn>({
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
      transformResponse: (response: IBoardColumn[]) => {
        return columnsAdapter.setAll(initialColumnQueryState, response);
      },
      providesTags: ["Column"],
    }),
    // Columns with id's not created by the db will get added
    // Columns missing from previous state will be deleted
    updateColumns: builder.mutation({
      query: (columns: IBoardColumn[]) => ({
        url: `/columns`,
        method: "PUT",
        body: { columns },
      }),
      invalidatesTags: ["Column"],
    }),
    // delete a single column given an in the path params
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

export const {
  useGetColumnsQuery,
  useUpdateColumnsMutation,
  useDeleteColumnMutation,
} = extendedColumnsApi;
