import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  SerializedError,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { IBoardData, IBoardState } from "../../@types/types";
import { client } from "../../api/mock/client";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

const boardsAdapter = createEntityAdapter<IBoardData>({
  selectId: (board) => board.id,
  sortComparer: (a, b) => a.id - b.id,
});
const initialState = boardsAdapter.getInitialState<IBoardState>({
  ids: [],
  entities: {},
  status: "idle",
  selectedBoard: null,
});

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async () => {
  const response = await client.get("/boards");
  return response.data.data as IBoardData[];
});

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardSelected(state, action) {
      const { board } = action.payload;
      state.selectedBoard = board;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBoards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<IBoardData[]>) => {
          console.log(state, action);
          state.status = "succeeded";
          // set boards state using the normalizing adapter
          boardsAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default boardsSlice.reducer;

export const { boardSelected } = boardsSlice.actions;

export const getSelectedBoard = ({ boards: { selectedBoard } }: RootState) =>
  selectedBoard;

export const boardRequestStatus = ({ boards: { status } }: RootState) => status;

export const {
  selectAll: selectAllBoards,
  selectById: selectBoardById,
  selectIds: selectBoardIds,
} = boardsAdapter.getSelectors<RootState>((state) => state.boards);
