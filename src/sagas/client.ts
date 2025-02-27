import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerClient from '@/lib/features/clients'
import { createClient } from '@/lib/supabaseClient';
import { ClientForm } from '@/interface/form';


function* addNewClient(action: {type: string; payload: ClientForm}){
    try{
       
        const client = createClient()
       
        // @ts-expect-error: 'call'
        const { error } = yield call([client.from('Client'), 'insert'], action.payload);
    
        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerClient.createSuccessfull())
    }catch(e){
        
    }
}

function* fetchClient(){
    try {
        const client = createClient()
        const { data, error } = yield call([client.from('Client'), 'select'], `
            id,
            name,
            billable_day,
            rut,
            CurrencyType (
                id,
                name
            )
           `);

           if (error) {
            throw new Error(error.message);
        }

        if(data !== null){
            yield put(ReducerClient.fetchSuccessfull(data))
        }

    } catch(e) {
        yield put(ReducerClient.fetchError())
    }
 }

function* fetchClientAction(){
    yield takeLatest([ReducerClient.fetch, ReducerClient.createSuccessfull], fetchClient);
 }

 function* addNewClientAction(){
    yield takeLatest([ReducerClient.create], addNewClient);
 }

export default function* clientsActions() {
    yield all([
        fetchClientAction(),
        addNewClientAction(),
    ])
 }