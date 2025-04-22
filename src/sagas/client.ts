import { takeLatest, all, put, call } from "redux-saga/effects";
import * as ReducerClient from "@/lib/features/clients";
import { createClient } from "@/lib/postgresClient";
import { ClientForm } from "@/interface/form";

function* addNewClient(action: { type: string; payload: ClientForm }) {
  try {
    const client = createClient();

    const { error } = yield call(() =>
      client.from("Client").insert(action.payload as Record<string, unknown> as Record<string, unknown>)
    );

    if (error) {
      throw new Error(error.message);
    }

    yield put(ReducerClient.createSuccessfull());
  } catch (e) {
    console.error("Error adding client:", e);
  }
}

function* fetchClient() {
  try {
    const client = createClient();
    const { data, error } = yield call(() =>
      client
        .from("Client")
        .select(
          `
            id,
            name,
            billable_day,
            rut,
            CurrencyType (
                id,
                name
            )
           `
        )
        .execute()
    );

    if (error) {
      throw new Error(error.message);
    }

    if (data !== null) {
      yield put(ReducerClient.fetchSuccessfull(data));
    }
  } catch (e) {
    console.error("Error fetching client:", e);
    yield put(ReducerClient.fetchError());
  }
}

function* fetchClientAction() {
  yield takeLatest([ReducerClient.fetch, ReducerClient.createSuccessfull], fetchClient);
}

function* addNewClientAction() {
  yield takeLatest([ReducerClient.create], addNewClient);
}

export default function* clientsActions() {
  yield all([fetchClientAction(), addNewClientAction()]);
}
