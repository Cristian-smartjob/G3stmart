import { takeLatest, all, put, call, CallEffect, PutEffect } from "redux-saga/effects";
import * as ReducerUser from "@/lib/features/users";
import type { People, JobTitle, Client, Role, AFPInstitution, HealthInstitution, Seniority, CurrencyType } from "@prisma/client";

// Definir el tipo de PeopleWithAllRelations según lo que necesitamos
type PeopleWithAllRelations = People & {
  jobTitle: JobTitle | null;
  client: Client | null;
  role: Role | null;
  afpInstitution: AFPInstitution | null;
  healthInstitution: HealthInstitution | null;
  seniority: Seniority | null;
  currencyType: CurrencyType | null;
};

type ApiResponse = {
  data: PeopleWithAllRelations[];
  message?: string;
};

// Tipar el generador con los tipos correctos
function* fetchPeople(): Generator<
  CallEffect<unknown> | PutEffect<ReturnType<typeof ReducerUser.fetchSuccessfull> | ReturnType<typeof ReducerUser.fetchError>>,
  void,
  unknown
> {
  try {
    console.log("Fetching People data...");

    const response = yield call(() => 
      fetch("/api/people", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
    );
    
    const result = yield call(() => (response as Response).json());
    
    if (!(response as Response).ok) {
      throw new Error((result as ApiResponse).message || "Error fetching People data");
    }

    console.log("People data fetched successfully:", (result as ApiResponse)?.data?.length || 0, "records");
    yield put(ReducerUser.fetchSuccessfull((result as ApiResponse).data));
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
