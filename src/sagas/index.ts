import { all } from 'redux-saga/effects';
import peopleAction from './people';
import dataActions from './data';
import clientsActions from './client';
import projectsAction from './projects';
import preInvoicesActions from './preInvoices';
import pricesActions from './prices';
import preInvoicesDetailActions from './preInvoicesDetail';
import contactsActions from './contacts';
import leaveDaysActions from './leaveDays';

export default function* rootSaga() {
    yield all([
        peopleAction(),
        dataActions(),
        clientsActions(),
        projectsAction(),
        preInvoicesActions(),
        pricesActions(),
        preInvoicesDetailActions(),
        contactsActions(),
        leaveDaysActions()
    ]);
}
