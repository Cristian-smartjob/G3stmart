import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerPreInvoices from '@/lib/features/preinvoices'
import { createClient } from '@/lib/supabaseClient';
import { PreinvoiceForm } from '@/interface/form';
import { People, PreInvoiceUpdate } from '@/interface/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { calcularDiasHabiles, getBillableDate } from '@/utils/date';


const fetch = async (
    current_start_date: string, 
    current_end_date: string,
    id: number
)  => {
    const client = createClient()
   
    return await client.from("LeaveDays").select(`
        start_date,
        end_date
    `)
    .gt('start_date', current_end_date) 
    .lt('end_date', current_start_date)
    .eq("smarter_id",id)
}


const  update = async (
    client: SupabaseClient, 
    payload: PreInvoiceUpdate
) => {

    return await client
                    .from('PreInvoice')
                    .update({ ...payload })
                    .eq('id', payload.id)
  }

  function* updatePreinvoice(action: {type: string; payload: PreInvoiceUpdate}) {

      try {
          const client = createClient();
          yield call(update, client, action.payload)
          yield put(ReducerPreInvoices.updateSuccessfull())
      } catch (e) {
         console.log('error', e)
      }
  }
  
  
function* fetchPreinvoices(){

    try {
        const client = createClient()
        const { data, error } = yield call([client.from('PreInvoice'), 'select'], `
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
           `)

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

        const year = action.payload.year || 0
        const month = (action.payload.month || 1) - 1
        const billable_day = action.payload.billable_day || 0

        const currentDate = getBillableDate(year, month, billable_day)
        const previousDate = getBillableDate(year, month - 1, billable_day)

        // @ts-ignore: 'call'
        const result = yield call([client.from('PreInvoice').insert({
            client_id: action.payload.client_id,
            contact_id: action.payload.contact_id,
            month: action.payload.month,
            year: action.payload.year
        }), "select"])
        const [preInvoice] =  result.data
       
        const { data } = yield call([client.from('People').select("*"), 'eq'], 'client_id', action.payload.client_id);
        const smarters: People[] = data
        
        console.log('start', previousDate.toISOString())
        console.log('end', currentDate.toISOString())

        for (const smart of smarters) {
         
            console.log('smart id', smart.id)

            const result = yield call(fetch, currentDate.toISOString(), previousDate.toISOString(), smart.id)
            
            console.log('result', result)

            const leaveDaysTotal = (result.data.length > 0) ? result.data.reduce((cur: number, acc) => cur + calcularDiasHabiles(new Date(acc.start_date), new Date(acc.end_date)), 0) : 0
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

           

            yield call([client.from('PreInvoiceDetail').insert(preInvoiceDetailPayload), 'select']);
        }

       
/*
        if (error) {
            throw new Error(error.message);
        }*/
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