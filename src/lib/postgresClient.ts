export type PostgresResult = {
  data: Record<string, unknown>[] | null;
  error: Error | null;
};

type FilterCondition = {
  column: string;
  operator: string;
  value: unknown;
};

export const createClient = () => {
  const baseUrl = "/api/db";

  return {
    from: (table: string) => {
      const conditions: FilterCondition[] = [];
      let selectColumns = "*";
      let includeAllJoins = false;

      const tableMethods = {
        select: (columns: string) => {
          selectColumns = columns;
          return {
            eq: (column: string, value: unknown) => {
              conditions.push({ column, operator: "=", value });
              return tableWithFilters;
            },

            gt: (column: string, value: unknown) => {
              conditions.push({ column, operator: ">", value });
              return tableWithFilters;
            },

            lt: (column: string, value: unknown) => {
              conditions.push({ column, operator: "<", value });
              return tableWithFilters;
            },

            withAllJoins: () => {
              includeAllJoins = true;
              return tableWithFilters;
            },

            async execute(): Promise<PostgresResult> {
              try {
                const response = await fetch(`${baseUrl}/select`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    table,
                    columns: selectColumns,
                    conditions,
                    includeAllJoins,
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Error executing query");
                }

                const result = await response.json();
                return {
                  data: result.data,
                  error: null,
                };
              } catch (error) {
                return {
                  data: null,
                  error: error instanceof Error ? error : new Error(String(error)),
                };
              }
            },
          };
        },

        insert: (data: Record<string, unknown>) => {
          return {
            async execute(): Promise<PostgresResult> {
              try {
                const response = await fetch(`${baseUrl}/insert`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    table,
                    data,
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Error inserting data");
                }

                const result = await response.json();
                return {
                  data: result.data,
                  error: null,
                };
              } catch (error) {
                return {
                  data: null,
                  error: error instanceof Error ? error : new Error(String(error)),
                };
              }
            },
          };
        },

        update: (data: Record<string, unknown>) => {
          if ("id" in data) {
            conditions.push({ column: "id", operator: "=", value: data.id });
            const dataWithoutId = { ...data };
            delete dataWithoutId.id;
            data = dataWithoutId;
          }

          return {
            eq: (column: string, value: unknown) => {
              conditions.push({ column, operator: "=", value });
              return {
                async execute(): Promise<PostgresResult> {
                  return updateData();
                },
              };
            },
            async execute(): Promise<PostgresResult> {
              return updateData();
            },
          };

          async function updateData(): Promise<PostgresResult> {
            try {
              const response = await fetch(`${baseUrl}/update`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  table,
                  data,
                  conditions,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error updating data");
              }

              const result = await response.json();
              return {
                data: result.data,
                error: null,
              };
            } catch (error) {
              return {
                data: null,
                error: error instanceof Error ? error : new Error(String(error)),
              };
            }
          }
        },
      };

      const tableWithFilters = {
        ...tableMethods,

        eq: (column: string, value: unknown) => {
          conditions.push({ column, operator: "=", value });
          return tableWithFilters;
        },

        gt: (column: string, value: unknown) => {
          conditions.push({ column, operator: ">", value });
          return tableWithFilters;
        },

        lt: (column: string, value: unknown) => {
          conditions.push({ column, operator: "<", value });
          return tableWithFilters;
        },

        withAllJoins: () => {
          includeAllJoins = true;
          return tableWithFilters;
        },

        async execute(): Promise<PostgresResult> {
          try {
            const response = await fetch(`${baseUrl}/select`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                table,
                columns: selectColumns,
                conditions,
                includeAllJoins,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Error executing query");
            }

            const result = await response.json();
            return {
              data: result.data,
              error: null,
            };
          } catch (error) {
            return {
              data: null,
              error: error instanceof Error ? error : new Error(String(error)),
            };
          }
        },
      };

      return tableWithFilters;
    },
  };
};
