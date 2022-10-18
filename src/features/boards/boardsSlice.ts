import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { IBoardData, IBoardState } from "../../@types/types";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

const boardsAdapter = createEntityAdapter<IBoardData>({
  selectId: (board) => board.id,
  // sortComparer: (a, b) => a.id - b.id,
});
const initialState = boardsAdapter.getInitialState<IBoardState>({
  ids: [],
  entities: {},
  status: "idle",
  selectedBoard: null,
});

export const extendedBoardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => "/boards",
      transformResponse: (responseData: IBoardData[]) => {
        return boardsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

export const { useGetBoardsQuery } = extendedBoardApiSlice;

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardSelected(state, action) {
      const { board } = action.payload;
      state.selectedBoard = board;
    },
  },
});

export default boardsSlice.reducer;

export const { boardSelected } = boardsSlice.actions;

export const getSelectedBoard = ({ boards: { selectedBoard } }: RootState) =>
  selectedBoard;

export const selectBoardsResult =
  extendedBoardApiSlice.endpoints.getBoards.select(undefined);

const selectUsersData = createSelector(
  selectBoardsResult,
  (boardResult) => boardResult.data
);

export const {
  selectAll: selectAllBoards,
  selectById: selectBoardById,
  selectIds: selectBoardIds,
} = boardsAdapter.getSelectors<RootState>(
  (state) => selectUsersData(state) ?? initialState
);
