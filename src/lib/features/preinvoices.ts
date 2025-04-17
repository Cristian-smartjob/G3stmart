import type { PreInvoice } from '@prisma/client';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Definición local de PreInvoiceUpdate (ajusta los campos según tu uso real)
export type PreInvoiceUpdate = Partial<Omit<PreInvoice, 'id'>>;

interface PreInvoicesState {
  list: PreInvoice[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PreInvoicesState = {
  list: [],
  isLoading: false,
  error: null,
};

const preInvoicesSlice = createSlice({
  name: 'preInvoices',
  initialState,
  reducers: {
    fetch(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccessfull(state, action: PayloadAction<PreInvoice[]>) {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    },
    fetchError(state, action: PayloadAction<string | undefined>) {
      state.isLoading = false;
      state.error = action.payload || 'Error al cargar preInvoices';
    },
    update(state, action: PayloadAction<{id: number, status: string, rejectNote?: string}>) {
      state.list = state.list.map(item => 
        item.id === action.payload.id ? 
          {
            ...item, 
            status: action.payload.status,
            rejectNote: action.payload.rejectNote !== undefined ? action.payload.rejectNote : item.rejectNote
          } : item
      );
    },
    // Puedes agregar más reducers según tus necesidades
  },
});

export const { fetch, fetchSuccessfull, fetchError, update } = preInvoicesSlice.actions;
export default preInvoicesSlice.reducer;