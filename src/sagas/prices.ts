import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerPrices from '@/lib/features/prices'
import { createClient } from '@/lib/supabaseClient';

function* fetchPrices(){
    try {
        const client = createClient()

        const { data, error } = yield call([client.from('Price'), 'select'], `
            id,
            name,
            description,
            value,
            CurrencyType (
                id,
                name,
                symbol
            )
           `)

        yield put(ReducerPrices.fetchSuccessfull(data))
    } catch(e) {
        console.log('error', e)
        yield put(ReducerPrices.fetchError())
    }
 }

function* fetchPricesAction(){
    yield takeLatest([ReducerPrices.fetch], fetchPrices);
 }

export default function* pricesActions() {
    yield all([
        fetchPricesAction(),
    ])
 }