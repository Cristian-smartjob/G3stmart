import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerContacts from '@/lib/features/contacts'
import { createClient } from '@/lib/supabaseClient';
import { ContactForm } from '@/interface/form';
import { SupabaseClient } from '@supabase/supabase-js';


const  update = async (
    client: SupabaseClient, 
    payload: Partial<ContactForm>
) => {
    return await client
                    .from('Contact')
                    .update({ ...payload })
                    .eq('id', payload.id)
  }

function* deleteItem(action: {type: string; payload: ContactForm}){
    try{
        const client = createClient()
    
        const { error } = yield call(update, client, {
            is_delete: 1,
            id: action.payload.id
        })

        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerContacts.deleteSuccessfull(action.payload))

    }catch(e){

    }
}

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

function* updateContact(action: {type: string; payload: ContactForm}){
    try{

        const client = createClient()
    
        const { error } = yield call(update, client, action.payload)
    
        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerContacts.updateSuccessfull(action.payload))
    }catch(e){
        console.log('e', e)
    }
}


function* fetchContacts(){
    try {
       
        const client = createClient()
        const query = client
        .from('Contact')
        .select(`
          id,
          name,
          last_name,
          email,
          phone,
          Client (
            id,
            name
          )
        `)
        .eq('is_delete', 0); 

        const { data, error } = yield call(() => query);

       
        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerContacts.fetchSuccessfull(data))
    } catch(e) {
        console.log('error', e)
        yield put(ReducerContacts.fetchError())
    }
 }

function* fetchContactsAction(){
    yield takeLatest([
        ReducerContacts.fetch, 
        ReducerContacts.createSuccessfull,
        ReducerContacts.updateSuccessfull,
        ReducerContacts.deleteSuccessfull
    ], fetchContacts);
 }

function* addNewContactAction(){
    yield takeLatest([ReducerContacts.create], addNewContact);
}

function* updateContactAction(){
    yield takeLatest([ReducerContacts.update], updateContact);
}

function* deleteItemAction(){
    yield takeLatest([ReducerContacts.deleteItem], deleteItem);
}

export default function* contactsActions() {
    yield all([
        fetchContactsAction(),
        addNewContactAction(),
        updateContactAction(),
        deleteItemAction(),
    ])
 }