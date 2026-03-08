export type ConnectionQueryParams = Record<string, any> | any[];

export abstract class DatabaseConnection {
  abstract connect(): Promise<any>;

  abstract query<T>(sql: string, params?: ConnectionQueryParams, transaction?: any): Promise<T>;

  abstract transaction<T>(callback: (transaction: any) => Promise<T>): Promise<T>;

  abstract createTransaction<T>(): Promise<T>;
}
