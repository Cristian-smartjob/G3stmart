import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerPreInvoicesDetail from '@/lib/features/preinvoicesdetail'
import { FetchSagaGenerator, ApiResponse } from '@/types/saga'
import type { PreInvoiceDetail } from '@prisma/client'

// Tipo para los detalles de preinvoice con relaciones
type PreInvoiceDetailWithRelations = PreInvoiceDetail & {
    person: {
        id: number;
        name: string;
        lastName: string;
        dni: string | null;
        country: string | null;
        jobTitle: {
            id: number;
            name: string;
        } | null;
    } | null;
};

function* fetchPreinvoices(action: {type:string; payload: number;}): FetchSagaGenerator<PreInvoiceDetailWithRelations[]> {
    try {
        console.log('fetchPreinvoices', action.payload)
        
        const response = yield call(() => 
            fetch(`/api/preinvoices/details/${action.payload}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
        );
        
        const result = yield call(() => (response as Response).json());
        
        if (!(response as Response).ok) {
            throw new Error((result as ApiResponse<unknown>).message || "Error fetching pre-invoice details");
        }
        
        yield put(ReducerPreInvoicesDetail.fetchSuccessfull((result as ApiResponse<PreInvoiceDetailWithRelations[]>).data))
    } catch(e) {
        console.error("Error:", e);
        yield put(ReducerPreInvoicesDetail.fetchError())
    }
}

function* AssignToPreinvoice(action: {type: string; payload: {preInvoce: number; smartersIds: number[]}}): FetchSagaGenerator<PreInvoiceDetail> {
    try {
        for (const id of action.payload.smartersIds) {
            console.log('id', id)
            
            const response = yield call(() => 
                fetch(`/api/preinvoices/details/${id}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: 'ASSIGN' })
                })
            );
            
            if (!(response as Response).ok) {
                const errorData = yield call(() => (response as Response).json());
                throw new Error((errorData as ApiResponse<unknown>).message || "Error assigning pre-invoice detail");
            }
            
            yield put(ReducerPreInvoicesDetail.addProgress())
        }

        yield put(ReducerPreInvoicesDetail.assignSuccessfull(action.payload.preInvoce));
    } catch (e) {
       console.log('error', e)
    }
}

function* UnAssignToPreinvoice(action: {type: string; payload: {preInvoce: number; smartersIds: number[]}}): FetchSagaGenerator<PreInvoiceDetail> {
    try {
        for (const id of action.payload.smartersIds) {
            const response = yield call(() => 
                fetch(`/api/preinvoices/details/${id}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: 'NO_ASSIGN' })
                })
            );
            
            if (!(response as Response).ok) {
                const errorData = yield call(() => (response as Response).json());
                throw new Error((errorData as ApiResponse<unknown>).message || "Error unassigning pre-invoice detail");
            }
            
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