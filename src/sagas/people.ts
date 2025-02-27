import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerUser from '@/lib/features/users'
import { createClient } from '@/lib/supabaseClient';

function* fetchPeople(){
    try {
       
        const client = createClient()

        const { data } = yield call([client.from('People'), 'select'], 
        `
        *,
        JobTitle (
            id,
            name
        )
       `);
        /*
        const { data, error } = yield call([client.from('PreInvoice'), 'select'], `
            id,
            status,
            oc_number,
            hes_number,
            Client (
                id,
                name
            )
           `)

        */
        yield put(ReducerUser.fetchSuccessfull(data))
    } catch(e) {
        console.log('error', e)
        yield put(ReducerUser.fetchError())
    }
 }

function* fetchPeopleAction(){
    yield takeLatest([ReducerUser.fetch], fetchPeople);
 }

export default function* peopleAction() {
    yield all([
        fetchPeopleAction(),
    ])
 }