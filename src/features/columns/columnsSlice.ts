import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const columnsAdapter = createEntityAdapter();
const initialState = columnsAdapter.getInitialState();

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {},
});


export default columnsSlice.reducer