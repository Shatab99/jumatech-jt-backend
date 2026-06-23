import {
  ILike,
  FindOptionsWhere,
  Repository, // Ensure Repository is imported
} from "typeorm";

type QueryBuilderOptions<T> = {
  repository: any;
  query: any; // You should define a proper type for this based on your query structure
  searchableFields?: string[];
  forcedFilters?: FindOptionsWhere<T>;
  relations?: any; // Define a proper type for relations if possible
  includeSelects?: string[];
  excludeSelects?: string[];
}

export const dynamicQueryBuilder = async <T>({
  repository,
  query,
  searchableFields = [],
  forcedFilters = {},
  relations = {},
  includeSelects = [],
  excludeSelects = []
}: QueryBuilderOptions<T>) => {
  const {
    page = 1,
    limit,
    search,
    sortBy = "createdAt",
    order = "desc",
    ...filters
  } = query;

  const numericLimit = limit ? parseInt(limit as string, 10) : undefined;
  const numericPage = parseInt(page as string, 10);
  const skip = numericLimit ? (numericPage - 1) * numericLimit : 0;

  // Prepare Base Filters
  const baseFilters = {
    ...filters,
    ...forcedFilters,
  } as FindOptionsWhere<T>;

  let whereConditions: FindOptionsWhere<T> | FindOptionsWhere<T>[] = baseFilters;

  if (search && searchableFields.length > 0) {
    whereConditions = searchableFields.map((field: any) => {
      const keys = field.split(".");
      const value = ILike(`%${search}%`);

      const searchObject = keys.reduceRight(
        (acc: any, key: any) => ({ [key]: acc } as any),
        value
      );

      return {
        ...baseFilters,
        ...searchObject,
      } as FindOptionsWhere<T>;
    });
  }

  // --- SELECT LOGIC ---

  let selectObject: any = undefined;

  // 1. Handle Include (Whitelist)
  if (includeSelects && includeSelects.length > 0) {
    selectObject = {};
    includeSelects.forEach((field: string) => {
      selectObject[field] = true;
    });
  }

  // 2. Handle Exclude (Blacklist) - Only runs if we haven't already built a select object
  if (excludeSelects && excludeSelects.length > 0 && !selectObject) {
    selectObject = {};

    // ✅ FIX: Use TypeORM Metadata to get the real column names
    const metadata = repository.metadata;

    // metadata.columns contains all the columns defined in your Entity
    metadata.columns.forEach((column: any) => {
      const propertyName = column.propertyName;

      // If this column is NOT in the exclude list, add it to the select
      if (!excludeSelects.includes(propertyName)) {
        selectObject[propertyName] = true;
      }
    });
  }

  const [data, total] = await repository.findAndCount({
    where: whereConditions,
    take: numericLimit,
    skip: skip,
    order: {
      [sortBy]: order.toUpperCase() as "ASC" | "DESC",
    } as any,
    relations: relations,
    // Add select for including/excluding fields
    ...(selectObject && { select: selectObject }),
  });

  const totalPages = numericLimit ? Math.ceil(total / numericLimit) : 1;

  return {
    meta: {
      currentPage: numericPage,
      totalPages,
      totalItems: total,
      perPage: numericLimit || total,
    },
    data,
  };
};