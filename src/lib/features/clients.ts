import { Client } from '@prisma/client';
import { ClientForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ClientsState {
  list: Client[];
  isLoading: boolean;
  isCreateLoading: boolean;
  isEditingLoading: {[key:string]: boolean};
  isDeletingLoading: {[key:string]: boolean};
}

const initialState: ClientsState = { 
  isLoading: true,
  isCreateLoading: false,
  list: [],
  isEditingLoading: {},
  isDeletingLoading: {}
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    create(state){
      state.isCreateLoading = true
    },
    createSuccessfull(state){
      state.isCreateLoading = false
    },
    update(state, action: PayloadAction<ClientForm>){
          state.isEditingLoading = {
            ...state.isEditingLoading,
            [action.payload.id || 0]: true
          }
        },
        deleteItem(state, action: PayloadAction<ClientForm>){
          state.isDeletingLoading = {
            ...state.isDeletingLoading,
            [action.payload.id || 0]: true
          }
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
  createSuccessfull,
  update,
  deleteItem
} = clientsSlice.actions;
export default clientsSlice.reducer;