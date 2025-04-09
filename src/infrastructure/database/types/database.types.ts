export type FilterCondition = {
  column: string;
  operator: string;
  value: unknown;
};

export interface DatabaseError {
  message: string;
  code?: string;
}

export interface QueryResult<T> {
  data: T | null;
  error: DatabaseError | null;
}
