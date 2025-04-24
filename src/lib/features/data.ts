import type { AFPInstitution, HealthInstitution, Role, Seniority } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Definición local de DataTables y GenericDataMap
export enum DataTables {
  AFPInstitution = 'AFPInstitution',
  JobTitle = 'JobTitle',
  HealthInstitution = 'HealthInstitution',
  Role = 'Role',
  Seniority = 'Seniority',
  Price = 'Price',
  CurrencyType = 'CurrencyType',
}

export type GenericDataMap = {
  [key in DataTables]?: unknown[];
};

interface DataState {
  list: GenericDataMap;
  isLoadingData: { [key: string]: boolean };
  errorData: { [key: string]: boolean };
}

const initialState: DataState = {
  list: {
    [DataTables.AFPInstitution]: [],
    [DataTables.HealthInstitution]: [],
    [DataTables.Role]: [],
    [DataTables.Seniority]: [],
    [DataTables.Price]: [],
    [DataTables.CurrencyType]: [],
    [DataTables.JobTitle]: [],
  },
  isLoadingData: {
    [DataTables.AFPInstitution]: true,
    [DataTables.HealthInstitution]: true,
    [DataTables.Role]: true,
    [DataTables.Seniority]: true,
    [DataTables.Price]: true,
    [DataTables.CurrencyType]: true,
    [DataTables.JobTitle]: true,
  },
  errorData: {
    [DataTables.AFPInstitution]: false,
    [DataTables.HealthInstitution]: false,
    [DataTables.Role]: false,
    [DataTables.Seniority]: false,
    [DataTables.Price]: false,
    [DataTables.CurrencyType]: false,
    [DataTables.JobTitle]: false,
  },
};

const dataSlices = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetch(state, action: PayloadAction<DataTables>) {
      state.isLoadingData[action.payload] = true;
      state.errorData[action.payload] = false;
    },
    fetchSuccessfull(
      state,
      action: PayloadAction<{ list: (AFPInstitution | HealthInstitution | Role | Seniority)[]; table: DataTables }>
    ) {
      state.isLoadingData[action.payload.table] = false;
      state.errorData[action.payload.table] = false;
      state.list = { ...state.list, [action.payload.table]: [...action.payload.list] };
    },
    fetchError(state, action: PayloadAction<DataTables>) {
      state.isLoadingData[action.payload] = false;
      state.errorData[action.payload] = true;
    },
  },
});

export const { fetch, fetchSuccessfull, fetchError } = dataSlices.actions;
export default dataSlices.reducer;
