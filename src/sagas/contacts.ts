import { takeLatest, all, put, call } from "redux-saga/effects";
import * as ReducerContacts from "@/lib/features/contacts";
import { ContactForm } from "@/interface/form";
import { ApiResponse, DeleteSagaGenerator, CreateSagaGenerator, UpdateSagaGenerator, FetchSagaGenerator } from "@/types/saga";
import type { Contact, Client } from "@prisma/client";

// Tipo para contactos con relaciones
type ContactWithRelations = Contact & {
  client: Client | null;
};

function* deleteItem(action: { type: string; payload: ContactForm }): DeleteSagaGenerator<Contact> {
  try {
    const response = yield call(() =>
      fetch(`/api/contacts/${action.payload.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error((errorData as ApiResponse<unknown>).message || "Error deleting contact");
    }

    yield put(ReducerContacts.deleteSuccessfull(action.payload));
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

function* addNewContact(action: { type: string; payload: ContactForm }): CreateSagaGenerator<Contact> {
  try {
    const response = yield call(() => 
      fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload)
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error((errorData as ApiResponse<unknown>).message || "Error creating contact");
    }

    yield put(ReducerContacts.createSuccessfull());
  } catch (e) {
    console.log("e", e);
  }
}

function* updateContact(action: { type: string; payload: ContactForm }): UpdateSagaGenerator<Contact> {
  try {
    const response = yield call(() => 
      fetch(`/api/contacts/${action.payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload)
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error((errorData as ApiResponse<unknown>).message || "Error updating contact");
    }

    yield put(ReducerContacts.updateSuccessfull(action.payload));
  } catch (e) {
    console.log("e", e);
  }
}

function* fetchContacts(): FetchSagaGenerator<ContactWithRelations[]> {
  try {
    console.log("Fetching Contacts data...");

    const response = yield call(() =>
      fetch("/api/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
    );

    const result = yield call(() => (response as Response).json());

    if (!(response as Response).ok) {
      throw new Error((result as ApiResponse<unknown>).message || "Error fetching contacts");
    }

    console.log("Contacts data fetched successfully:", (result as ApiResponse<ContactWithRelations[]>)?.data?.length || 0, "records");

    yield put(ReducerContacts.fetchSuccessfull((result as ApiResponse<ContactWithRelations[]>).data || []));
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
