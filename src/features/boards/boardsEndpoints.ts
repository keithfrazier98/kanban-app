import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { IBoardData, IBoardQuery, IBoardState } from "../../@types/types";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

// use an entity adapter for the extendedBoardApi (normalizes query response)
const boardsAdapter = createEntityAdapter<IBoardData>({
  selectId: (board) => board.id,
  // sortComparer: (a, b) => a.id - b.id,
});

// get the initial query state from the adapter
const boardQueryInitialState = boardsAdapter.getInitialState<IBoardQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

// extend the apiSlice with the board queries
export const extendedBoardAPi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => "/boards",
      transformResponse: (responseData: IBoardData[]) => {
        return boardsAdapter.setAll(boardQueryInitialState, responseData);
      },
    }),
  }),
});

export const { useGetBoardsQuery } = extendedBoardAPi;

// get the response for the getBoards query
export const selectBoardsResult =
  extendedBoardAPi.endpoints.getBoards.select(undefined);

// create a memoized selector for the boards query
const selectAllBoardsResult = createSelector(
  selectBoardsResult,
  (boardResult) => boardResult.data
);

// use the boardsAdapter to access getSeletors, normalize the getBoards result
export const {
  selectAll: selectAllBoards,
  selectById: selectBoardById,
  selectIds: selectBoardIds,
} = boardsAdapter.getSelectors<RootState>(
  (state) => selectAllBoardsResult(state) ?? boardQueryInitialState
);



