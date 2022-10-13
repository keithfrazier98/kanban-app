import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardColumn, IColumnState } from "../../@types/types";

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
  reducers: {},
});

export default columnsSlice.reducer;
