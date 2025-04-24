import { all, put, call, takeEvery } from "redux-saga/effects";
import * as ReducerData from "@/lib/features/data";
import { DataTables } from "@/lib/features/data";
import { ApiResponse, FetchSagaGenerator } from "@/types/saga";
import type { 
  AFPInstitution, 
  HealthInstitution, 
  JobTitle, 
  Role, 
  Seniority, 
  Price, 
  CurrencyType 
} from "@prisma/client";

// Tipo para el precio con sus relaciones
type PriceWithCurrency = Price & {
  CurrencyType: CurrencyType | null;
};

// Tipo unión para todos los tipos de datos posibles
type DataModels = 
  | AFPInstitution 
  | HealthInstitution 
  | JobTitle 
  | Role 
  | Seniority 
  | PriceWithCurrency;

function* fetchData(action: { type: string; payload: DataTables }): FetchSagaGenerator<DataModels[]> {
  try {
    console.log(`Fetching ${action.payload} data...`);

    const response = yield call(() =>
      fetch(`/api/data/${action.payload}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
    );

    const result = yield call(() => (response as Response).json());

    if (!(response as Response).ok) {
      throw new Error((result as ApiResponse<unknown>).message || `Error fetching ${action.payload} data`);
    }

    console.log(`${action.payload} data fetched successfully:`, (result as ApiResponse<DataModels[]>)?.data?.length || 0, "records");

    yield put(
      ReducerData.fetchSuccessfull({
        list: (result as ApiResponse<DataModels[]>).data || [],
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
