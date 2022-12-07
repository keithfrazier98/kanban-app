import { createSlice } from "@reduxjs/toolkit";
import { IBoardState } from "../../@types/types";
import { RootState } from "../../redux/store";
import { openModalFunction } from "../../utils/utils";

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
    boardSelected(state, action: { payload: { board: string | null } }) {
      const { board } = action.payload;
      state.selectedBoard = board;
    },
    editBoardModalOpened: openModalFunction("editBoardModalOpen"),
    addBoardModalOpened: openModalFunction("addBoardModalOpen"),
    deleteBoardModalOpened: openModalFunction("deleteBoardModalOpen"),
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
