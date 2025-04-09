import { Client } from "@/interface/common";
import { ContactForm } from "@/interface/form";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  clientId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  client: Client | null;
}

interface ContactsState {
  list: Contact[];
  isLoading: boolean;
  isEditingLoading: { [key: string]: boolean };
  isDeletingLoading: { [key: string]: boolean };
}

const initialState: ContactsState = {
  isLoading: true,
  list: [],
  isEditingLoading: {},
  isDeletingLoading: {},
};

const usersSlices = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    create: {
      reducer: () => {},
      prepare: (payload: ContactForm) => ({ payload }),
    },
    update(state, action: PayloadAction<ContactForm>) {
      state.isEditingLoading = {
        ...state.isEditingLoading,
        [action.payload.id || 0]: true,
      };
    },
    deleteItem(state, action: PayloadAction<ContactForm>) {
      state.isDeletingLoading = {
        ...state.isDeletingLoading,
        [action.payload.id || 0]: true,
      };
    },
    createSuccessfull() {},
    deleteSuccessfull(state, action: PayloadAction<ContactForm>) {
      state.isDeletingLoading = {
        ...state.isDeletingLoading,
        [action.payload.id || 0]: false,
      };
    },
    updateSuccessfull(state, action: PayloadAction<ContactForm>) {
      state.isEditingLoading = {
        ...state.isEditingLoading,
        [action.payload.id || 0]: false,
      };
    },
    fetch(state) {
      state.isLoading = true;
    },
    fetchSuccessfull(state, action: PayloadAction<Contact[]>) {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchError(state) {
      state.isLoading = false;
    },
  },
});

export const {
  create,
  update,
  createSuccessfull,
  updateSuccessfull,
  fetch,
  fetchSuccessfull,
  fetchError,
  deleteItem,
  deleteSuccessfull,
} = usersSlices.actions;
export default usersSlices.reducer;
