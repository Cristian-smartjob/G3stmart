import { takeLatest, all, put, call, CallEffect, PutEffect } from "redux-saga/effects";
import * as ReducerContacts from "@/lib/features/contacts";
import { Contact } from "@/lib/features/contacts";
import { createClient } from "@/lib/postgresClient";
import { ContactForm } from "@/interface/form";

const update = async (payload: Partial<ContactForm>) => {
  const client = createClient();
  return await client.from("Contact").update(payload).execute();
};

function* deleteItem(action: { type: string; payload: ContactForm }) {
  try {
    const { error } = yield call(() =>
      update({
        id: action.payload.id,
      })
    );

    if (error) {
      throw new Error(error.message);
    }

    yield put(ReducerContacts.deleteSuccessfull(action.payload));
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

function* addNewContact(action: { type: string; payload: ContactForm }) {
  try {
    const client = createClient();

    const { error } = yield call(() => client.from("Contact").insert(action.payload as Record<string, unknown>));

    if (error) {
      throw new Error(error.message);
    }

    yield put(ReducerContacts.createSuccessfull());
  } catch (e) {
    console.log("e", e);
  }
}

function* updateContact(action: { type: string; payload: ContactForm }) {
  try {
    const { error } = yield call(() => update(action.payload));

    if (error) {
      throw new Error(error.message);
    }

    yield put(ReducerContacts.updateSuccessfull(action.payload));
  } catch (e) {
    console.log("e", e);
  }
}

function* fetchContacts(): Generator<CallEffect<Response | any> | PutEffect<any>, void, any> {
  try {
    console.log("Fetching Contacts data...");

    const fetchEffect = yield call(() =>
      fetch("/api/db/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Contact",
          conditions: [],
        }),
      })
    );

    const response: Response = fetchEffect;

    const jsonEffect = yield call(() => response.json());
    const responseData: { data: Contact[] } = jsonEffect;

    if (!response.ok) {
      console.log("Error fetching Contacts data:", responseData);
      yield put(ReducerContacts.fetchError());
      return;
    }

    console.log("Contacts data fetched successfully:", responseData?.data?.length || 0, "records");

    yield put(ReducerContacts.fetchSuccessfull(responseData?.data || []));
  } catch (e) {
    console.log("error", e);
    yield put(ReducerContacts.fetchError());
  }
}

function* fetchContactsAction() {
  yield takeLatest(
    [
      ReducerContacts.fetch,
      ReducerContacts.createSuccessfull,
      ReducerContacts.updateSuccessfull,
      ReducerContacts.deleteSuccessfull,
    ],
    fetchContacts
  );
}

function* addNewContactAction() {
  yield takeLatest([ReducerContacts.create], addNewContact);
}

function* updateContactAction() {
  yield takeLatest([ReducerContacts.update], updateContact);
}

function* deleteItemAction() {
  yield takeLatest([ReducerContacts.deleteItem], deleteItem);
}

export default function* contactsActions() {
  yield all([fetchContactsAction(), addNewContactAction(), updateContactAction(), deleteItemAction()]);
}
