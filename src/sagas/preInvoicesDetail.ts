import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerPreInvoicesDetail from '@/lib/features/preinvoicesdetail'
import { createClient } from '@/lib/supabaseClient';
import { SupabaseClient } from '@supabase/supabase-js';


const fetch = async (id: number)  => {
    const client = createClient()
    return await client.from("PreInvoiceDetail").select(`
        id,
        value,
        status,
        billable_days,
            leave_days,
            total_consume_days,
        People (
            id,
            name,
            last_name,
            dni,
            country,
            JobTitle (
                id,
                name
            )
        )
    `).eq("preinvoice_id",id)
}


function* fetchPreinvoices(action: {type:string; payload: number;}){

    try {
        console.log('fetchPreinvoices', action.payload)
        const { data, error } = yield call(fetch, action.payload)
        if (error) {
            throw new Error(error.message);
        }
        yield put(ReducerPreInvoicesDetail.fetchSuccessfull(data))
    } catch(e) {
        yield put(ReducerPreInvoicesDetail.fetchError())
    }

}

const  update = async (client: SupabaseClient, id: number, status: string) => {

  return await client
  .from('PreInvoiceDetail')
  .update({ status })
  .eq('id', id)
}

function* AssignToPreinvoice(action: {type: string; payload: {preInvoce: number; smartersIds: number[]}}) {
    try {
        const client = createClient();

        for (const id of action.payload.smartersIds) {
            console.log('id', id)
            yield call(update, client, id, 'ASSIGN')
            yield put(ReducerPreInvoicesDetail.addProgress())
        }

        yield put(ReducerPreInvoicesDetail.assignSuccessfull(action.payload.preInvoce));
    } catch (e) {
       console.log('error', e)
    }
}

function* UnAssignToPreinvoice(action: {type: string; payload: {preInvoce: number; smartersIds: number[]}}) {
    try {
        const client = createClient();


        for (const id of action.payload.smartersIds) {
            yield call(update, client, id, 'NO_ASSIGN')
            yield put(ReducerPreInvoicesDetail.addProgress())
        }

        yield put(ReducerPreInvoicesDetail.assignSuccessfull(action.payload.preInvoce));

    } catch (e) {
       console.log('error', e)
    }
}


function* fetchPreinvoicesAction(){
    yield takeLatest([
        ReducerPreInvoicesDetail.fetch, 
        ReducerPreInvoicesDetail.assignSuccessfull], fetchPreinvoices);
}

function* AssignToPreinvoiceAction(){
    yield takeLatest([ReducerPreInvoicesDetail.assign], AssignToPreinvoice);
}

function* UnAssignToPreinvoiceAction(){
    yield takeLatest([ReducerPreInvoicesDetail.unAssign], UnAssignToPreinvoice);
}

export default function* preInvoicesDetailActions() {
    yield all([
        fetchPreinvoicesAction(),
        AssignToPreinvoiceAction(),
        UnAssignToPreinvoiceAction(),
    ])
 }