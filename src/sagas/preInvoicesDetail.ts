import { takeLatest, all, put, call } from "redux-saga/effects";
import * as ReducerPreInvoicesDetail from "@/lib/features/preinvoicesdetail";
import { FetchSagaGenerator, ApiResponse } from "@/types/saga";
import type { PreInvoiceDetail } from "@prisma/client";

// Define el tipo para PreInvoiceDetail que incluye relaciones, si es necesario
type PreInvoiceDetailWithRelations = PreInvoiceDetail; // Ajusta según tus relaciones reales

// Worker saga: Realiza la petición API y maneja las acciones de éxito/error
function* fetchPreinvoices(action: {
  type: string;
  payload: number;
}): FetchSagaGenerator<PreInvoiceDetailWithRelations[]> {
  try {
    // Asegurarnos de que tenemos un ID válido
    const id =
      typeof action.payload === "number"
        ? action.payload
        : action.type === ReducerPreInvoicesDetail.assignSuccessfull.type
        ? action.payload
        : 0;

    if (!id) {
      return;
    }

    const response = yield call(() =>
      fetch(`/api/preinvoices/details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const result = yield call(() => (response as Response).json());

    if (!(response as Response).ok) {
      throw new Error((result as ApiResponse<unknown>).message || "Error fetching pre-invoice details");
    }

    yield put(ReducerPreInvoicesDetail.fetchSuccessfull((result as ApiResponse<PreInvoiceDetailWithRelations[]>).data));
  } catch {
    yield put(ReducerPreInvoicesDetail.fetchError());
  }
}

function* AssignToPreinvoice(action: {
  type: string;
  payload: { preInvoce: number; smartersIds: number[] };
}): FetchSagaGenerator<PreInvoiceDetail> {
  try {
    for (const id of action.payload.smartersIds) {
      const response = yield call(() =>
        fetch(`/api/preinvoices/details/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "ASSIGN" }),
        })
      );

      if (!(response as Response).ok) {
        const errorData = yield call(() => (response as Response).json());
        throw new Error((errorData as ApiResponse<unknown>).message || "Error assigning pre-invoice detail");
      }

      yield put(ReducerPreInvoicesDetail.addProgress());
    }

    yield put(ReducerPreInvoicesDetail.assignSuccessfull(action.payload.preInvoce));
  } catch {
    // Manejar el error si es necesario, o dejar vacío si no
  }
}

function* UnAssignToPreinvoice(action: {
  type: string;
  payload: { preInvoce: number; smartersIds: number[] };
}): FetchSagaGenerator<PreInvoiceDetail> {
  try {
    for (const id of action.payload.smartersIds) {
      const response = yield call(() =>
        fetch(`/api/preinvoices/details/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "NO_ASSIGN" }),
        })
      );

      if (!(response as Response).ok) {
        const errorData = yield call(() => (response as Response).json());
        throw new Error((errorData as ApiResponse<unknown>).message || "Error unassigning pre-invoice detail");
      }

      yield put(ReducerPreInvoicesDetail.addProgress());
    }

    yield put(ReducerPreInvoicesDetail.assignSuccessfull(action.payload.preInvoce));
  } catch {
    // Manejar el error si es necesario, o dejar vacío si no
  }
}

// Watcher saga: Espera por la acción 'FETCH_PREINVOICES' y llama al worker saga
function* fetchPreinvoicesAction() {
  yield takeLatest(
    [ReducerPreInvoicesDetail.fetch.type, ReducerPreInvoicesDetail.assignSuccessfull.type],
    fetchPreinvoices
  );
}

function* AssignToPreinvoiceAction() {
  yield takeLatest([ReducerPreInvoicesDetail.assign], AssignToPreinvoice);
}

function* UnAssignToPreinvoiceAction() {
  yield takeLatest([ReducerPreInvoicesDetail.unAssign], UnAssignToPreinvoice);
}

// Root saga: Combina todos los watcher sagas
export default function* preInvoicesDetailActions() {
  yield all([fetchPreinvoicesAction(), AssignToPreinvoiceAction(), UnAssignToPreinvoiceAction()]);
}
