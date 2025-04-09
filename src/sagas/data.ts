/* eslint-disable */
// @ts-nocheck
import { all, put, call, takeEvery } from "redux-saga/effects";
import * as ReducerData from "@/lib/features/data";
import {
  AFPInstitution,
  DataTables,
  HealthInstitution,
  JobTitle,
  Role,
  Seniority,
  CurrencyType,
} from "@/interface/common";

const mapSelectData: { [key: string]: string } = {
  [DataTables.AFPInstitution]: "*",
  [DataTables.JobTitle]: "*",
  [DataTables.HealthInstitution]: "*",
  [DataTables.Role]: "*",
  [DataTables.Seniority]: "*",
  [DataTables.Price]: `
        id,
        name,
        value,
        CurrencyType (
                id,
                name
            )
    `,
};

type DataResponse = {
  data: (AFPInstitution | HealthInstitution | Role | Seniority | JobTitle | CurrencyType)[];
};

function* fetchData(action: { type: string; payload: DataTables }) {
  try {
    console.log(`Fetching ${action.payload} data...`);

    const fetchEffect = yield call(() =>
      fetch("/api/db/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: action.payload,
          conditions: [],
        }),
      })
    );

    const response: Response = fetchEffect;
    const jsonEffect = yield call(() => response.json());
    const responseData: DataResponse = jsonEffect;

    if (!response.ok) {
      console.error(`Error fetching ${action.payload} data:`, responseData);
      yield put(ReducerData.fetchError(action.payload));
      return;
    }

    console.log(`${action.payload} data fetched successfully:`, responseData?.data?.length || 0, "records");

    yield put(
      ReducerData.fetchSuccessfull({
        list: responseData.data || [],
        table: action.payload,
      })
    );
  } catch (e) {
    console.error("Exception in data saga:", e);
    yield put(ReducerData.fetchError(action.payload));
  }
}

function* fetchDataAction() {
  yield takeEvery([ReducerData.fetch], fetchData);
}

export default function* dataActions() {
  yield all([fetchDataAction()]);
}
