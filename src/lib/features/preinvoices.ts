import { PreInvoice, PreInvoiceUpdate } from '@/interface/common';
import { PreinvoiceForm } from '@/interface/form';
import { CheckboxStatus } from '@/interface/ui';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PreInvoiceState {
  list: PreInvoice[];
  isLoading: boolean;
  isLoadingCreating: boolean;
 
}

const initialState: PreInvoiceState = { 
  isLoading: true,
  isLoadingCreating: false,
  list: [],
  
}

const preInvoicesSlices = createSlice({
  name: 'preInvoices',
  initialState,
  reducers: {
    update(state, action:PayloadAction<PreInvoiceUpdate>){},
    updateSuccessfull(){},
    create(state, action: PayloadAction<PreinvoiceForm>){
      state.isLoadingCreating = true
    },
    createSuccessfull(state){
      state.isLoadingCreating = false
    },
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<PreInvoice[]>){
      state.isLoading = false
      state.list = action.payload
    },
    fetchError(state){
      state.isLoading = false
    },
    
  },
});

export const { 
  create,
  createSuccessfull,
  fetch,
  fetchSuccessfull,
  fetchError,
  update,
  updateSuccessfull
} = preInvoicesSlices.actions;
export default preInvoicesSlices.reducer;