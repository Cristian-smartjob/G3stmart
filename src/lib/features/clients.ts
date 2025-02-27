import { Client } from '@/interface/common';
import { ClientForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ClientsState {
  list: Client[];
  isLoading: boolean;
  isCreateLoading: boolean;
}

const initialState: ClientsState = { 
  isLoading: true,
  isCreateLoading: false,
  list: []
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    create(state, action: PayloadAction<ClientForm>){
      state.isCreateLoading = true
    },
    createSuccessfull(state){
      state.isCreateLoading = false
    },
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<Client[]>){
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
  fetch,
  fetchSuccessfull,
  fetchError,
  createSuccessfull
} = clientsSlice.actions;
export default clientsSlice.reducer;