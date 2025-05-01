export interface FilterCondition {
  column: string;
  operator: string;
  value: string | number | boolean | unknown[];
}

export interface DatabaseError {
  message: string;
  code?: string;
}

export interface QueryResult<T> {
  data: T | null;
  error: DatabaseError | null;
}
