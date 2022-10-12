import {
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const boardsAdapter = createEntityAdapter();
const initialState = boardsAdapter.getInitialState();

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
});

export default boardsSlice.reducer;
