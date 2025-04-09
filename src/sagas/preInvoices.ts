import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerPreInvoices from '@/lib/features/preinvoices'
import { createClient } from '@/lib/postgresClient';
import { PreinvoiceForm } from '@/interface/form';
import { People, PreInvoiceUpdate } from '@/interface/common';
import { calcularDiasHabiles, getBillableDate } from '@/utils/date';


const fetchLeaveData = async (
    current_start_date: string, 
    current_end_date: string,
    id: number
) => {
    const client = createClient()
   
    return await client.from("LeaveDays").select(`
        start_date,
        end_date
    `)
    .gt('start_date', current_end_date) 
    .lt('end_date', current_start_date)
    .eq("smarter_id", id)
    .execute();
}


const updatePreInvoiceData = async (payload: PreInvoiceUpdate) => {
    const client = createClient()
    return await client
                    .from('PreInvoice')
                    .update(payload)
                    .execute();
}

function* updatePreinvoice(action: {type: string; payload: PreInvoiceUpdate}) {
    try {
        yield call(() => updatePreInvoiceData(action.payload));
        yield put(ReducerPreInvoices.updateSuccessfull());
    } catch (e) {
       console.log('error', e);
    }
}
  
  
function* fetchPreinvoices(){
    try {
        const client = createClient()
        const { data, error } = yield call(() => client.from('PreInvoice').select(`
            id,
            status,
            oc_number,
            hes_number,
            month,
            year,
            value,
            Client (
                id,
                name
            ),
            Contact (
                id,
                name,
                last_name
            )
           `).execute());

        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerPreInvoices.fetchSuccessfull(data))
    } catch(e) {
        yield put(ReducerPreInvoices.fetchError())
    }
}

function* addPreinvoice(action: {type: string; payload: PreinvoiceForm}){
    try{
        console.log('addPreinvoice', action.payload)
       
        const client = createClient()

        const year = action.payload.year || 0
        const month = (action.payload.month || 1) - 1
        const billable_day = action.payload.billable_day || 0

        const currentDate = getBillableDate(year, month, billable_day)
        const previousDate = getBillableDate(year, month - 1, billable_day)

        // Insertar preInvoice
        const insertData = {
            client_id: action.payload.client_id,
            contact_id: action.payload.contact_id,
            month: action.payload.month,
            year: action.payload.year
        };
        
        const result = yield call(() => client.from('PreInvoice').insert(insertData as Record<string, unknown>).execute());
        const [preInvoice] = result.data
       
        const { data } = yield call(() => client.from('People').select('*').eq('client_id', action.payload.client_id).execute());
        const smarters: People[] = data
        
        console.log('start', previousDate.toISOString())
        console.log('end', currentDate.toISOString())

        for (const smart of smarters) {
         
            console.log('smart id', smart.id)

            const leaveDaysResult = yield call(() => fetchLeaveData(currentDate.toISOString(), previousDate.toISOString(), smart.id));
            
            console.log('result', leaveDaysResult)

            const leaveDaysTotal = (leaveDaysResult.data && leaveDaysResult.data.length > 0) ? 
                leaveDaysResult.data.reduce((cur: number, acc: any) => cur + calcularDiasHabiles(new Date(acc.start_date), new Date(acc.end_date)), 0) : 0;
                
            const billable_days = 30 
            const total_consume_days = 30 - leaveDaysTotal
        
            const preInvoiceDetailPayload = {
                preinvoice_id: preInvoice.id,
                smarter_id: smart.id, 
                status: "NO_ASSIGN",
                value: smart.fee,
                billable_days: billable_days,
                total_consume_days,
                leave_days: leaveDaysTotal
            };

            yield call(() => client.from('PreInvoiceDetail').insert(preInvoiceDetailPayload as Record<string, unknown>).execute());
        }

       
        yield put(ReducerPreInvoices.createSuccessfull())
    }catch(e){
        console.log('error', e)
    }
}

function* fetchPreinvoicesAction(){
    yield takeLatest([
        ReducerPreInvoices.fetch, 
        ReducerPreInvoices.createSuccessfull,
        ReducerPreInvoices.updateSuccessfull
    ], fetchPreinvoices);
}

function* createPreinvoiceAction(){
    yield takeLatest([ReducerPreInvoices.create], addPreinvoice);
}

function* updatePreinvoiceAction(){
    yield takeLatest([ReducerPreInvoices.update], updatePreinvoice);
}


export default function* preInvoicesActions() {
    yield all([
        fetchPreinvoicesAction(),
        createPreinvoiceAction(),
        updatePreinvoiceAction(),
    ])
 }