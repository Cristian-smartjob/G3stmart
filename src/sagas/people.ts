import { takeLatest, all, put, call, Effect } from "redux-saga/effects";
import * as ReducerUser from "@/lib/features/users";
import { PeopleWithAllRelations } from "@/types/people";

interface ApiResponse {
  data: PeopleWithAllRelations[];
  message?: string;
}

function* fetchUsers(): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(fetch, "/api/people")) as Response;

    if (!response.ok) {
      throw new Error("Error fetching people");
    }

    const result = (yield call([response, "json"])) as ApiResponse;
    yield put(ReducerUser.fetchSuccessfull(result.data));
  } catch {
    yield put(ReducerUser.fetchError());
  }
}

function* PeopleSaga() {
  yield all([takeLatest(ReducerUser.fetch.type, fetchUsers)]);
}

export default PeopleSaga;
