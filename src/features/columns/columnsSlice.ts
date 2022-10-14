import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IBoardColumn, IColumnState } from "../../@types/types";
import { client } from "../../api/mock/client";
import { RootState } from "../../app/store";

export const fetchColumnsByBoardId = createAsyncThunk(
  "columns/fetchColumnsById",
  async (boardId: number) => {
    const response = await client.get(`/columns?boardId=${boardId}`);
    return response.data.data;
  }
);

const columnsAdapter = createEntityAdapter<IBoardColumn>({
  selectId: (column) => column.name,
});
const initialState = columnsAdapter.getInitialState<IColumnState>({
  ids: [],
  entities: {},
  status: "idle",
});

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    columnsSelected(state, action: { payload: { columns: IBoardColumn[] } }) {
      const { columns: changes } = action.payload;
      columnsAdapter.setAll(state, changes);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchColumnsByBoardId.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        fetchColumnsByBoardId.fulfilled,
        (state, action: PayloadAction<IBoardColumn[]>) => {
          console.log(state, action);
          state.status = "succeeded";
          // set boards state using the normalizing adapter
          columnsAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchColumnsByBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { columnsSelected } = columnsSlice.actions;

export const { selectAll: selectAllColumns } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);

export const columnsReqStatus = ({ columns: { status } }: RootState) => status;

export default columnsSlice.reducer;
