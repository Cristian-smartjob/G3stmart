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
    // Obtener parámetros de la URL para el tabId
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = urlParams.get("returnTabId") || "1";

    // Asegurarnos de que tenemos un ID válido
    let id: number;

    if (action.type === ReducerPreInvoicesDetail.fetch.type) {
      // Si es una acción de fetch, intentamos obtener el ID de la URL
      const pathParts = window.location.pathname.split("/");
      id = Number(pathParts[pathParts.length - 1]);
    } else if (action.type === ReducerPreInvoicesDetail.assignSuccessfull.type) {
      // Si es una acción de asignación exitosa, usamos el ID del payload
      id = Number(action.payload);
    } else {
      // En cualquier otro caso, intentamos usar el payload directamente
      id = Number(action.payload);
    }

    if (!id || isNaN(id)) {
      console.error("ID inválido para detalles de prefactura:", id);
      yield put(ReducerPreInvoicesDetail.fetchError());
      return;
    }

    console.log(`Fetching preinvoice details for ID: ${id}, Tab: ${tabId}`);

    const response = yield call(() =>
      fetch(`/api/preinvoices/details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Añadir cache: 'no-store' para evitar problemas de caché
        cache: "no-store",
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      console.error("Error response:", errorData);
      throw new Error((errorData as ApiResponse<unknown>).message || "Error fetching pre-invoice details");
    }

    const rawResult = yield call(() => (response as Response).json());
    const result = rawResult as ApiResponse<PreInvoiceDetailWithRelations[]>;

    if (!result || !Array.isArray(result.data)) {
      console.error("Invalid response format:", result);
      throw new Error("Invalid response format");
    }

    yield put(ReducerPreInvoicesDetail.fetchSuccessfull(result.data));
  } catch (error) {
    console.error("Error in fetchPreinvoices saga:", error);
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
