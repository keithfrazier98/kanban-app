import { createEntityAdapter } from "@reduxjs/toolkit";
import { IColumn, IColumnPostBody, IColumnQuery } from "../../@types/types";
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
      query: (columns: IColumnPostBody) => ({
        url: `/columns`,
        method: "POST",
        body: { columns },
      }),
      invalidatesTags: ["Column"],
    }),
    // delete a single column given an in the path params
    deleteColumn: builder.mutation({
      query: (columnId:string) => ({
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
