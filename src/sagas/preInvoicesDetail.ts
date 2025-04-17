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
        console.log('Iniciando fetchPreinvoices para preInvoiceId:', action.payload, 'tipo:', action.type);
        
        // Asegurarnos de que tenemos un ID válido
        const id = typeof action.payload === 'number' ? action.payload : 
                  action.type === ReducerPreInvoicesDetail.assignSuccessfull.type ? action.payload : 
                  0;
        
        if (!id) {
            console.error('ID inválido para fetchPreinvoices');
            return;
        }
        
        console.log('Realizando petición API para ID:', id);
        const response = yield call(() => 
            fetch(`/api/preinvoices/details/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
        );
        
        console.log('Respuesta recibida de la API:', (response as Response).status);
        
        const result = yield call(() => (response as Response).json());
        
        if (!(response as Response).ok) {
            console.error('Error en la respuesta de la API:', result);
            throw new Error((result as ApiResponse<unknown>).message || "Error fetching pre-invoice details");
        }
        
        console.log('Detalles de prefactura recibidos:', (result as ApiResponse<PreInvoiceDetailWithRelations[]>).data.length);
        yield put(ReducerPreInvoicesDetail.fetchSuccessfull((result as ApiResponse<PreInvoiceDetailWithRelations[]>).data))
    } catch(e) {
        console.error("Error en fetchPreinvoices:", e);
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
    console.log('Configurando saga watcher para fetchPreinvoices');
    yield takeLatest([
        ReducerPreInvoicesDetail.fetch.type, 
        ReducerPreInvoicesDetail.assignSuccessfull.type], fetchPreinvoices);
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