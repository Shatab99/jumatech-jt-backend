declare module "oracledb" {
  interface PoolAttributes {
    user?: string;
    password?: string;
    connectString?: string;
    poolMin?: number;
    poolMax?: number;
    poolIncrement?: number;
    poolTimeout?: number;
  }

  interface Connection {
    close(forceClose?: boolean): Promise<void>;
    execute(
      sql: string,
      bindParams?: any[],
      options?: any
    ): Promise<any>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
  }

  interface Pool {
    getConnection(): Promise<Connection>;
    close(forceClose?: boolean): Promise<void>;
  }

  interface OracleDB {
    createPool(attributes: PoolAttributes): Promise<void>;
    getPool(): Pool;
    getConnection(): Promise<Connection>;
  }

  const oracledb: OracleDB;
  export default oracledb;
}
