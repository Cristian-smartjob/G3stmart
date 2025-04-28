import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PeopleWithAllRelations } from "@/types/people";

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
