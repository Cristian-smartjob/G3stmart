import type { People, JobTitle, Client, Role, AFPInstitution, HealthInstitution, Seniority, CurrencyType } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Definir el tipo de PeopleWithAllRelations según lo que necesitamos
type PeopleWithAllRelations = People & {
  jobTitle: JobTitle | null;
  client: Client | null;
  role: Role | null;
  afpInstitution: AFPInstitution | null;
  healthInstitution: HealthInstitution | null;
  seniority: Seniority | null;
  currencyType: CurrencyType | null;
};

interface UsersState {
  list: PeopleWithAllRelations[];
  isLoading: boolean;
}

const initialState: UsersState = {
  isLoading: true,
  list: [],
};

const usersSlices = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetch(state) {
      state.isLoading = true;
    },
    fetchSuccessfull(state, action: PayloadAction<PeopleWithAllRelations[]>) {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchError(state) {
      state.isLoading = false;
    },
  },
});

export const { fetch, fetchSuccessfull, fetchError } = usersSlices.actions;
export default usersSlices.reducer;
