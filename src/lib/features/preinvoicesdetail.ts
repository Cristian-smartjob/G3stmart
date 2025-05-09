import type { PreInvoiceDetail as PrismaPreInvoiceDetail } from "@prisma/client";
import { CheckboxStatus } from "@/interface/ui";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type PreInvoiceDetail = PrismaPreInvoiceDetail & { isSelected?: boolean };

interface PreInvoiceDetailState {
  list: PreInvoiceDetail[];
  isLoading: boolean;
  isLoadingAssignOrUnassign: boolean;
  progressAssignOrUnassign: number;
  totalAssignOrUnassign: number;
  allSelectedStatus: CheckboxStatus;
  lastProcessedId: number | null;
}

const initialState: PreInvoiceDetailState = {
  isLoading: true,
  isLoadingAssignOrUnassign: false,
  progressAssignOrUnassign: 0,
  totalAssignOrUnassign: 1,
  list: [],
  allSelectedStatus: CheckboxStatus.Off,
  lastProcessedId: null,
};

const preInvoicesDetailSlices = createSlice({
  name: "preInvoicesDetail",
  initialState,
  reducers: {
    assign(state, action: PayloadAction<{ preInvoce: number; smartersIds: number[] }>) {
      state.isLoadingAssignOrUnassign = true;
      state.totalAssignOrUnassign = action.payload.smartersIds.length;
      state.progressAssignOrUnassign = 0;
    },
    unAssign(state, action: PayloadAction<{ preInvoce: number; smartersIds: number[] }>) {
      state.isLoadingAssignOrUnassign = true;
      state.totalAssignOrUnassign = action.payload.smartersIds.length;
      state.progressAssignOrUnassign = 0;
    },
    addProgress(state) {
      state.progressAssignOrUnassign = state.progressAssignOrUnassign + 1;
    },
    assignSuccessfull(state, action: PayloadAction<number>) {
      state.isLoadingAssignOrUnassign = false;
      state.lastProcessedId = action.payload;
    },
    fetch(state) {
      state.isLoading = true;
    },
    fetchSuccessfull(state, action: PayloadAction<PreInvoiceDetail[]>) {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchError(state) {
      state.isLoading = false;
    },
    selectAll(state, action: PayloadAction<CheckboxStatus>) {
      state.allSelectedStatus = action.payload;
      if (action.payload === CheckboxStatus.Off || action.payload === CheckboxStatus.On) {
        const isOn = action.payload === CheckboxStatus.On;
        state.list = state.list.map((item) => ({ ...item, isSelected: isOn }));
      }
    },
    selectItem(state, action: PayloadAction<PreInvoiceDetail>) {
      if (state.allSelectedStatus === CheckboxStatus.On && action.payload.isSelected === false) {
        state.allSelectedStatus = CheckboxStatus.Mixed;
      }
      state.list = state.list.map((item) =>
        item.id === action.payload.id ? { ...item, isSelected: action.payload.isSelected } : item
      );
    },
  },
});

export const {
  fetch,
  fetchSuccessfull,
  fetchError,
  assign,
  unAssign,
  assignSuccessfull,
  selectAll,
  selectItem,
  addProgress,
} = preInvoicesDetailSlices.actions;
export default preInvoicesDetailSlices.reducer;
