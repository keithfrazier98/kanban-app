import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { IBoardColumn, IBoardTask, IColumnState } from "../../@types/types";
import { client } from "../../api/mock/browser";
import { RootState } from "../../app/store";

const fetchColumns = createAsyncThunk(
  "columns/fetchColumns",
  async (boardId) => {
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
  extraReducers() {
    
  },
});

export const { columnsSelected } = columnsSlice.actions;

export const { selectAll: selectAllColumns } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);

export default columnsSlice.reducer;
