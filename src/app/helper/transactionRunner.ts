import { EntityManager } from "typeorm";
import { AppDataSource } from "../DB/database.config";


/**
 * A reusable wrapper for TypeORM transactions.
 * @param operation A callback function that receives the transactional EntityManager.
 */
export const runInTransaction = async <T>(
    operation: (transactionalEntityManager: EntityManager) => Promise<T>
): Promise<T> => {
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Run the business logic passed in the callback
        const result = await operation(queryRunner.manager);

        // If successful, commit
        await queryRunner.commitTransaction();
        return result;

    } catch (error) {
        // If error, rollback
        await queryRunner.rollbackTransaction();
        
        // Rethrow the error so the controller/global handler catches it
        // (Don't swallow the original error message like "Subdomain taken")
        throw error; 
    } finally {
        // Always release the connection
        await queryRunner.release();
    }
};