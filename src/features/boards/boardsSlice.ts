import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  SerializedError,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IBoardData } from "../../@types/types";
import { client } from "../../api/mock/browser";
interface IBoardState {
  ids: string[];
  entities: IBoardData[];
  error?: string;
  status: "idle" | "succeeded" | "loading" | "failed";
}
const boardsAdapter = createEntityAdapter<IBoardData>({
  selectId: (board) => board.id,
  sortComparer: (a, b) => a.id - (b.id)
});
const initialState = boardsAdapter.getInitialState<IBoardState>({
  ids: [],
  entities: [],
  status: "idle",
});

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async () => {
  const response = await client.get("/boards");
  return response.data.data as IBoardData[];
});

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
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
          // Add any fetched posts to the array
          // Use the `upsertMany` reducer as a mutating update utility
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
