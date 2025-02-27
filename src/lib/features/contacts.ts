import { Contact } from '@/interface/common';
import { ContactForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ContactsState {
  list: Contact[];
  isLoading: boolean;
}

const initialState: ContactsState = { 
  isLoading: true,
  list: []
}

const usersSlices = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    create(state, action: PayloadAction<ContactForm>){},
    createSuccessfull(){},
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
  createSuccessfull,
  fetch,
  fetchSuccessfull,
  fetchError
} = usersSlices.actions;
export default usersSlices.reducer;