import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerContacts from '@/lib/features/contacts'
import { createClient } from '@/lib/supabaseClient';
import { ContactForm } from '@/interface/form';



function* addNewContact(action: {type: string; payload: ContactForm}){
    try{
       
        const client = createClient()
       
        // @ts-expect-error: 'call'
        const { error } = yield call([client.from('Contact'), 'insert'], action.payload);
    
        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerContacts.createSuccessfull())
    }catch(e){
        console.log('e', e)
    }
}


function* fetchContacts(){
    try {
       
        const client = createClient()

        const { data } = yield call([client.from('Contact'), 'select'], 
        `
        id,
        name,
        last_name,
        email,
        phone,
         Client (
                id,
                name
            )
       `);

        yield put(ReducerContacts.fetchSuccessfull(data))
    } catch(e) {
        console.log('error', e)
        yield put(ReducerContacts.fetchError())
    }
 }

function* fetchContactsAction(){
    yield takeLatest([ReducerContacts.fetch, ReducerContacts.createSuccessfull], fetchContacts);
 }

  function* addNewContactAction(){
     yield takeLatest([ReducerContacts.create], addNewContact);
  }

export default function* contactsActions() {
    yield all([
        fetchContactsAction(),
        addNewContactAction(),
    ])
 }