import { all, put, call, takeEvery } from 'redux-saga/effects'
import * as ReducerData from '@/lib/features/data'
import { createClient } from '@/lib/supabaseClient'
import { DataTables } from '@/interface/common';

const mapSelectData: {[key:string]: string} = {
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
    `
}

function* fetchData(action: {type: string, payload: DataTables}){
    try {
        const client = createClient()
        const { data } = yield call([client.from(action.payload), 'select'], mapSelectData[action.payload]);
        yield put(ReducerData.fetchSuccessfull({list: data, table: action.payload}))
    } catch(e) {
        yield put(ReducerData.fetchError(action.payload))
    }
 }

function* fetchDataAction(){
    yield takeEvery([ReducerData.fetch], fetchData);
 }

export default function* dataActions() {
    yield all([
        fetchDataAction(),
    ])
 }