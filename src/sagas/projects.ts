import { takeLatest, all, put, call } from 'redux-saga/effects'
import * as ReducerProject from '@/lib/features/projects'
import { createClient } from '@/lib/postgresClient';
import { AssignedProject } from '@/interface/common';

function* addAssignedProject(action: {type: string; payload: AssignedProject}){
    try{
        const client = createClient()
        
        const { error } = yield call(() => client.from('AssignedProjects').insert(action.payload as unknown as Record<string, unknown>).execute());

        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerProject.assignSuccessfull())
      
    }catch(e){
        console.log('error', e)
    }
}


function* fetchProjects(){
    try {
        const client = createClient()

        const { data, error } = yield call(() => client.from('Project').select(`
            id,
            name,
            Client (
                id,
                name
            )
           `).execute());

        if (error) {
            throw new Error(error.message);
        }

        yield put(ReducerProject.fetchSuccessfull(data))
    } catch(e) {
        console.log('error', e)
        yield put(ReducerProject.fetchError())
    }
}

function* fetchProjectsAction(){
    yield takeLatest([ReducerProject.fetch], fetchProjects);
}


function* addAssignedProjectAction(){
    yield takeLatest([ReducerProject.assign], addAssignedProject);
}

export default function* projectsAction() {
    yield all([
        fetchProjectsAction(),
        addAssignedProjectAction(),
    ])
}