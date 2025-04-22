import { takeLatest, all, put, call } from "redux-saga/effects";
import * as ReducerUser from "@/lib/features/users";
import { createClient } from "@/lib/postgresClient";

function* fetchPeople() {
  try {
    const client = createClient();
    console.log("Fetching People data...");

    const { data, error } = yield call(() => client.from("People").select("*").withAllJoins().execute());

    if (error) {
      console.log("Error fetching People data:", error);
      yield put(ReducerUser.fetchError());
      return;
    }

    console.log("People data fetched successfully:", data?.length || 0, "records");
    yield put(ReducerUser.fetchSuccessfull(data));
  } catch (e) {
    console.log("error", e);
    yield put(ReducerUser.fetchError());
  }
}

function* fetchPeopleAction() {
  yield takeLatest([ReducerUser.fetch], fetchPeople);
}

export default function* peopleAction() {
  yield all([fetchPeopleAction()]);
}
