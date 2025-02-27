import { AssignLeaveDaysForm } from '@/interface/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface LeaveDaysState {
 isLoading: {[key:string]:boolean}
}

const initialState: LeaveDaysState = { 
    isLoading: {}
}

const leaveDaysSlices = createSlice({
  name: 'leaveDays',
  initialState,
  reducers: {
    assign(state, action: PayloadAction<AssignLeaveDaysForm>){
        state.isLoading[action.payload.smarter_id] = true
    },
    assignSuccessfull(state, action: PayloadAction<number>){
        state.isLoading[action.payload] = false
    }
  },
});

export const { 
    assign,
    assignSuccessfull
} = leaveDaysSlices.actions;
export default leaveDaysSlices.reducer;