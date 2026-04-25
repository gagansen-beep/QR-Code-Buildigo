import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
declare const pool: Pool;
export declare function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
export declare function getClient(): Promise<PoolClient>;
export declare function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
export declare function healthCheck(): Promise<boolean>;
export declare function closePool(): Promise<void>;
export { pool };
//# sourceMappingURL=connection.d.ts.map