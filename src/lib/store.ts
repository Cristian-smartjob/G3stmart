'use client'
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import users from "./features/users";
import clients from "./features/clients"
import projects from "./features/projects"
import preInvoices from "./features/preinvoices"
import data from "./features/data"
import preInvoicesDetail from './features/preinvoicesdetail'
import contacts from './features/contacts'
import leaveDays from './features/leaveDays'
import rootSaga from "@/sagas";

export const sagaMiddleWare = createSagaMiddleware();

export const makeStore = () => {

  const store =  configureStore({
    reducer: {
        users,
        data,
        clients,
        projects,
        preInvoices,
        preInvoicesDetail,
        contacts,
        leaveDays
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleWare),
  });

  sagaMiddleWare.run(rootSaga);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']