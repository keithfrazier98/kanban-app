import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardColumn, IColumnState } from "../../@types/types";
import { RootState } from "../../app/store";

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
});

export const { columnsSelected } = columnsSlice.actions;

export const { selectAll: selectAllColumns } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);

export default columnsSlice.reducer;
