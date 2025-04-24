// Este archivo ya no se utiliza, toda su funcionalidad ha sido migrada a server actions
// Se mantiene para evitar errores de compilación en importaciones existentes
import { takeLatest, all, put } from 'redux-saga/effects'
import * as ReducerPreInvoices from '@/lib/features/preinvoices'

// Función vacía ya que se usa server actions ahora
function* fetchPreinvoices(){
  try {
    // La implementación real está ahora en /app/actions/preInvoices.ts
    yield put(ReducerPreInvoices.fetchSuccessfull([]))
  } catch (e) {
    console.error("Error:", e);
    yield put(ReducerPreInvoices.fetchError())
  }
}

// Las siguientes funciones y acciones son placeholders. Si las necesitas, agrégalas al slice.
// function* addPreinvoice(action: {type: string; payload: any}){
//   try {
//     yield put(ReducerPreInvoices.createSuccessfull())
//   } catch(e) {
//     console.log('error', e)
//   }
// }
//
// function* updatePreinvoice(action: {type: string; payload: any}) {
//   try {
//     yield put(ReducerPreInvoices.updateSuccessfull());
//   } catch (e) {
//     console.log('error', e);
//   }
// }

function* fetchPreinvoicesAction(){
  yield takeLatest([
    ReducerPreInvoices.fetch.type
    // Si agregas más acciones al slice, puedes añadirlas aquí usando .type
    // ReducerPreInvoices.createSuccessfull?.type,
    // ReducerPreInvoices.updateSuccessfull?.type
  ], fetchPreinvoices);
}

// function* createPreinvoiceAction(){
//   yield takeLatest([ReducerPreInvoices.create.type], addPreinvoice);
// }
//
// function* updatePreinvoiceAction(){
//   yield takeLatest([ReducerPreInvoices.update.type], updatePreinvoice);
// }

export default function* preInvoicesActions() {
  yield all([
    fetchPreinvoicesAction(),
    // createPreinvoiceAction(),
    // updatePreinvoiceAction(),
  ])
}