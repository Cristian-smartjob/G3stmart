import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerLeaveDays from '@/lib/features/leaveDays'
import { AssignLeaveDaysForm } from '@/interface/form';
import { ApiResponse, CreateSagaGenerator } from '@/types/saga';
import type { LeaveDays } from '@prisma/client';

function* AssignLeaveDays(action: {type: string; payload: AssignLeaveDaysForm}): CreateSagaGenerator<LeaveDays> {
    try {
        const response = yield call(() => 
            fetch('/api/leave-days', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate: action.payload.start_date,
                    endDate: action.payload.end_date,
                    personId: action.payload.smarter_id
                })
            })
        );
        
        if (!(response as Response).ok) {
            const errorData = yield call(() => (response as Response).json());
            throw new Error((errorData as ApiResponse<unknown>).message || "Error assigning leave days");
        }

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