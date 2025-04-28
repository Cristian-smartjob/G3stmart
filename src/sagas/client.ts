import { takeLatest, all, put, call, CallEffect, PutEffect } from "redux-saga/effects";
import * as ReducerClient from "@/lib/features/clients";
import { ClientForm } from "@/interface/form";
import type { Client } from "@prisma/client";

// Definir los tipos de respuesta de API
type ClientWithRelations = Client & {
  currencyType: {
    id: number;
    name: string;
  } | null;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

// Generador tipado para añadir cliente
function* addNewClient(action: {
  type: string;
  payload: ClientForm;
}): Generator<CallEffect<unknown> | PutEffect<ReturnType<typeof ReducerClient.createSuccessfull>>, void, unknown> {
  try {
    const response = yield call(() =>
      fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error((errorData as ApiResponse<unknown>).message || "Error adding client");
    }

    yield put(ReducerClient.createSuccessfull());
  } catch (e) {
    console.error("Error adding client:", e);
  }
}

// Generador tipado para actualizar un cliente
function* updateClient(action: {
  type: string;
  payload: ClientForm;
}): Generator<
  | CallEffect<unknown>
  | PutEffect<ReturnType<typeof ReducerClient.updateSuccessfull> | ReturnType<typeof ReducerClient.fetch>>,
  void,
  unknown
> {
  try {
    if (!action.payload.id) {
      throw new Error("Client ID is required for update");
    }

    const response = yield call(() =>
      fetch(`/api/clients/${action.payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error((errorData as ApiResponse<unknown>).message || "Error updating client");
    }

    yield put(ReducerClient.updateSuccessfull(action.payload.id as number));
    // Recargar la lista después de actualizar
    yield put(ReducerClient.fetch());
  } catch (e) {
    console.error("Error updating client:", e);
  }
}

// Generador tipado para obtener clientes
function* fetchClient(): Generator<
  | CallEffect<unknown>
  | PutEffect<ReturnType<typeof ReducerClient.fetchSuccessfull> | ReturnType<typeof ReducerClient.fetchError>>,
  void,
  unknown
> {
  try {
    const response = yield call(() =>
      fetch("/api/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const result = yield call(() => (response as Response).json());

    if (!(response as Response).ok) {
      throw new Error((result as ApiResponse<unknown>).message || "Error fetching clients");
    }

    yield put(ReducerClient.fetchSuccessfull((result as ApiResponse<ClientWithRelations[]>).data));
  } catch (e) {
    console.error("Error fetching client:", e);
    yield put(ReducerClient.fetchError());
  }
}

function* fetchClientAction() {
  yield takeLatest(
    [ReducerClient.fetch, ReducerClient.createSuccessfull, ReducerClient.updateSuccessfull],
    fetchClient
  );
}

function* addNewClientAction() {
  yield takeLatest(ReducerClient.create.type, addNewClient);
}

function* updateClientAction() {
  yield takeLatest(ReducerClient.update.type, updateClient);
}

export default function* clientsActions() {
  yield all([fetchClientAction(), addNewClientAction(), updateClientAction()]);
}
