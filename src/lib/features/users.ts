import { People } from '@/interface/common';
import { PeopleForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
  list: People[];
  isLoading: boolean;
}

const initialState: UsersState = { 
  isLoading: true,
  list: []
}

const usersSlices = createSlice({
  name: 'users',
  initialState,
  reducers: {
    create(state, action: PayloadAction<PeopleForm>){},
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<People[]>){
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
  fetchError
} = usersSlices.actions;
export default usersSlices.reducer;