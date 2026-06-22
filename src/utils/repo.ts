import { AppDataSource } from "../app/DB/database.config";

// Use AppDataSource for TypeORM operations
export const getRepo = (entityClass: any) => {
  return AppDataSource.getRepository(entityClass);
};