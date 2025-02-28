import { Contact } from '@/interface/common';
import { ContactForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ContactsState {
  list: Contact[];
  isLoading: boolean;
  isEditingLoading: {[key:string]: boolean};
  isDeletingLoading: {[key:string]: boolean};
}

const initialState: ContactsState = { 
  isLoading: true,
  list: [],
  isEditingLoading: {},
  isDeletingLoading: {}
}

const usersSlices = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    create(state, action: PayloadAction<ContactForm>){},
    update(state, action: PayloadAction<ContactForm>){
      state.isEditingLoading = {
        ...state.isEditingLoading,
        [action.payload.id || 0]: true
      }
    },
    deleteItem(state, action: PayloadAction<ContactForm>){
      state.isDeletingLoading = {
        ...state.isDeletingLoading,
        [action.payload.id || 0]: true
      }
    },
    createSuccessfull(){},
    updateSuccessfull(){},
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<Contact[]>){
      state.isLoading = false
      state.list = action.payload
    },
    fetchError(state){
      state.isLoading = false
    }
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
  deleteItem
} = usersSlices.actions;
export default usersSlices.reducer;