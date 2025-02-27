import { AssignedProject, Project } from '@/interface/common';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectsState {
  list: Project[];
  isLoading: boolean;
}

const initialState: ProjectsState = { 
  isLoading: true,
  list: []
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    assign(state, action: PayloadAction<AssignedProject>){

    },
    assignSuccessfull(state){

    },
    fetch(state){
      state.isLoading = true
    },
    fetchSuccessfull(state, action: PayloadAction<Project[]>){
      state.isLoading = false
      state.list = action.payload
    },
    fetchError(state){
      state.isLoading = false
    }
  },
});

export const { 
  assign,
  assignSuccessfull,
  fetch,
  fetchSuccessfull,
  fetchError,
} = projectsSlice.actions;
export default projectsSlice.reducer;