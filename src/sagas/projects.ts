import { takeLatest, all, put, call } from "redux-saga/effects";
import * as ReducerProject from "@/lib/features/projects";
import {
  ApiResponse,
  CreateSagaGenerator,
  FetchSagaGenerator,
} from "@/types/saga";
import type { Project } from "@prisma/client";

// Definir el tipo para la asignación de proyectos
interface AssignedProject {
  projectId: number;
  personId: number;
}

// Definir el tipo para proyectos con sus relaciones
type ProjectWithClient = Project & {
  client: {
    id: number;
    name: string;
  } | null;
};

function* addAssignedProject(action: {
  type: string;
  payload: AssignedProject;
}): CreateSagaGenerator<unknown> {
  try {
    const response = yield call(() =>
      fetch("/api/projects/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      })
    );

    if (!(response as Response).ok) {
      const errorData = yield call(() => (response as Response).json());
      throw new Error(
        (errorData as ApiResponse<unknown>).message || "Error assigning project"
      );
    }

    yield put(ReducerProject.assignSuccessfull());
  } catch (e) {
    console.log("error", e);
  }
}

function* fetchProjects(): FetchSagaGenerator<ProjectWithClient[]> {
  try {
    const response = yield call(() =>
      fetch("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const result = yield call(() => (response as Response).json());

    if (!(response as Response).ok) {
      throw new Error(
        (result as ApiResponse<unknown>).message || "Error fetching projects"
      );
    }

    yield put(
      ReducerProject.fetchSuccessfull(
        (result as ApiResponse<ProjectWithClient[]>).data
      )
    );
  } catch (e) {
    console.log("error", e);
    yield put(ReducerProject.fetchError());
  }
}

function* fetchProjectsAction() {
  yield takeLatest([ReducerProject.fetch], fetchProjects);
}

function* addAssignedProjectAction() {
  yield takeLatest([ReducerProject.assign], addAssignedProject);
}

export default function* projectsAction() {
  yield all([fetchProjectsAction(), addAssignedProjectAction()]);
}
