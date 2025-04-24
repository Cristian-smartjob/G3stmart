import type { PreInvoice } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Definición local de PreInvoiceUpdate (ajusta los campos según tu uso real)
export type PreInvoiceUpdate = Partial<Omit<PreInvoice, "id">>;

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
  name: "preInvoices",
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
      state.error = action.payload || "Error al cargar preInvoices";
    },
    update(
      state,
      action: PayloadAction<{
        id: number;
        status: string;
        rejectNote?: string;
        invoiceNumber?: string;
        hesNumber?: string;
        ocNumber?: string;
        ocAmount?: number;
        edpNumber?: string;
        completedBy?: string;
        completedAt?: Date;
      }>
    ) {
      state.list = state.list.map((item) => {
        if (item.id === action.payload.id) {
          const updatedItem = { ...item };
          updatedItem.status = action.payload.status;

          if (action.payload.rejectNote !== undefined) {
            updatedItem.rejectNote = action.payload.rejectNote;
          }

          if (action.payload.invoiceNumber !== undefined) {
            updatedItem.invoiceNumber = action.payload.invoiceNumber;
          }

          if (action.payload.hesNumber !== undefined) {
            updatedItem.hesNumber = action.payload.hesNumber;
          }

          if (action.payload.ocNumber !== undefined) {
            updatedItem.ocNumber = action.payload.ocNumber;
          }

          // Manejar decimales de forma segura
          if (action.payload.ocAmount !== undefined) {
            // Convertimos el número a un formato compatible con Decimal
            // @ts-expect-error - esperamos un error de tipo aquí ya que el tipo number no es compatible con Decimal
            updatedItem.ocAmount = action.payload.ocAmount;
          }

          if (action.payload.edpNumber !== undefined) {
            updatedItem.edpNumber = action.payload.edpNumber;
          }

          // Añadir manejo para los nuevos campos
          if (action.payload.completedBy !== undefined) {
            updatedItem.completedBy = action.payload.completedBy;
          }

          if (action.payload.completedAt !== undefined) {
            updatedItem.completedAt = action.payload.completedAt;
          }

          return updatedItem;
        }

        return item;
      });
    },
    // Puedes agregar más reducers según tus necesidades
  },
});

export const { fetch, fetchSuccessfull, fetchError, update } = preInvoicesSlice.actions;
export default preInvoicesSlice.reducer;
