import { AFPInstitution, DataTables, GenericDataMap, HealthInstitution, Role, Seniority } from '@/interface/common';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DataState {
  list: GenericDataMap;
  isLoadingData: {[key: string]: boolean};
}

const initialState: DataState = {
  list: {
    [DataTables.AFPInstitution]: [],
    [DataTables.HealthInstitution]: [],
    [DataTables.Role]: [],
    [DataTables.Seniority]: [],
    [DataTables.Price]: [],
    [DataTables.CurrencyType]: [],
    [DataTables.JobTitle]: []
  },
  isLoadingData: {
    [DataTables.AFPInstitution]: true,
    [DataTables.HealthInstitution]: true,
    [DataTables.Role]: true,
    [DataTables.Seniority]: true,
    [DataTables.Price]: true,
    [DataTables.CurrencyType]: true,
    [DataTables.JobTitle]: true
  }
}

const dataSlices = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetch(state, action: PayloadAction<DataTables>){
      state.isLoadingData[action.payload] = true
    },
    fetchSuccessfull(state, action: PayloadAction<{list: (AFPInstitution | HealthInstitution | Role | Seniority)[]; table: DataTables}>){
      state.isLoadingData[action.payload.table] = true
      state.list = {...state.list, [action.payload.table]: [...action.payload.list] }
    },
    fetchError(state, action: PayloadAction<DataTables>){
      state.isLoadingData[action.payload] = false
    }
  },
});

export const { 
  fetch,
  fetchSuccessfull,
  fetchError
} = dataSlices.actions;
export default dataSlices.reducer;