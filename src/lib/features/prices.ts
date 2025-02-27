import { Price, Project } from '@/interface/common';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PricesState {
  list: Price[];
  isLoading: boolean;
}

const initialState: PricesState = { 
  isLoading: true,
  list: []
}

const pricesSlices = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<Price[]>){
      state.isLoading = false
      state.list = action.payload
    },
    fetchError(state){
      state.isLoading = false
    }
  },
});

export const { 
  fetch,
  fetchSuccessfull,
  fetchError
} = pricesSlices.actions;
export default pricesSlices.reducer;