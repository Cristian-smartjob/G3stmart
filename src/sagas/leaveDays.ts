
import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerLeaveDays from '@/lib/features/leaveDays'
import { createClient } from '@/lib/postgresClient';
import { AssignLeaveDaysForm } from '@/interface/form';



function* AssignLeaveDays(action: {type: string; payload: AssignLeaveDaysForm}) {
    try {
        const client = createClient();
        const { error } = yield call(() => client.from('LeaveDays').insert({
            start_date: action.payload.start_date,
            end_date: action.payload.end_date,
            smarter_id: action.payload.smarter_id
        } as Record<string, unknown>));

        yield put(ReducerLeaveDays.assignSuccessfull(action.payload.smarter_id));
    } catch (e) {
       console.log('error', e)
    }
}


function* AssignLeaveDaysAction(){
    yield takeLatest([ReducerLeaveDays.assign], AssignLeaveDays);
}


export default function* leaveDaysActions() {
    yield all([
        AssignLeaveDaysAction(),
    ])
 }