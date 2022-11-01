import { createSlice } from "@reduxjs/toolkit";
import { IBoardData, IBoardState } from "../../@types/types";
import { RootState } from "../../app/store";

// Setup boards slice to hold the current board state
const initialState: IBoardState = {
  selectedBoard: null,
  addBoardModalOpen: false,
  editBoardModalOpen: false,
  deleteBoardModalOpen: false,
};
const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardSelected(state, action: { payload: { board: IBoardData | null } }) {
      const { board } = action.payload;
      state.selectedBoard = board;
    },
    editBoardModalOpened(state, action: { payload: { open: boolean } }) {
      const { open } = action.payload;
      state.editBoardModalOpen = open;
    },
    addBoardModalOpened(state, action: { payload: { open: boolean } }) {
      const { open } = action.payload;
      state.addBoardModalOpen = open;
    },
    deleteBoardModalOpened(state, action: { payload: { open: boolean } }) {
      const { open } = action.payload;
      state.deleteBoardModalOpen = open;
    },
  },
});

export default boardsSlice.reducer;

export const {
  boardSelected,
  editBoardModalOpened,
  addBoardModalOpened,
  deleteBoardModalOpened,
} = boardsSlice.actions;

export const getSelectedBoard = ({ boards: { selectedBoard } }: RootState) =>
  selectedBoard;

export const boardOptionsOpen = ({
  boards: { deleteBoardModalOpen },
}: RootState) => deleteBoardModalOpen;
