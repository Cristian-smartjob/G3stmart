import { CallEffect, PutEffect } from 'redux-saga/effects';
import { AnyAction } from 'redux';

/**
 * Tipo genérico para respuestas de API
 */
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

/**
 * Tipo genérico para errores de API
 */
export type ApiError = {
  message: string;
  status?: number;
};

/**
 * Tipo genérico para generadores de saga
 * @template T - Tipo de datos con los que trabaja el generador
 * @template A - Tipo de acción que recibe el generador
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SagaGenerator<T = unknown, A = unknown> = Generator<
  CallEffect<unknown> | PutEffect<AnyAction>,
  void,
  unknown
>;

/**
 * Tipo para un generador de saga que recupera datos
 * @template T - Tipo de datos a recuperar
 */
export type FetchSagaGenerator<T = unknown> = SagaGenerator<T>;

/**
 * Tipo para un generador de saga que crea datos
 * @template T - Tipo de datos a crear
 * @template A - Tipo de acción que recibe el generador
 */
export type CreateSagaGenerator<T = unknown, A = unknown> = SagaGenerator<T, A>;

/**
 * Tipo para un generador de saga que actualiza datos
 * @template T - Tipo de datos a actualizar
 * @template A - Tipo de acción que recibe el generador
 */
export type UpdateSagaGenerator<T = unknown, A = unknown> = SagaGenerator<T, A>;

/**
 * Tipo para un generador de saga que elimina datos
 * @template T - Tipo de datos a eliminar
 * @template A - Tipo de acción que recibe el generador
 */
export type DeleteSagaGenerator<T = unknown, A = unknown> = SagaGenerator<T, A>; 