# Starter PostgreSQL Shatab

## Overview
A starter backend boilerplate with Express, Prisma, TypeScript, and common utilities, built with PostgreSQL Database integration.

## Features
- Built with **Node.js** and **TypeScript**
- Uses **Express.js** for handling API requests
- **Oracle Database** integration with TypeORM ORM
- **TypeORM migrations** for database versioning
- **RESTful API** structure
- **ESLint & Prettier** for code quality and formatting
- **Swagger documentation** for API documentation
- **Advanced Query Builder** for searching, filtering and pagination
- **Connection pooling** for optimized database performance

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 18.x)
- npm or yarn
- Oracle Database (or Docker with Oracle image)
- Oracle Instant Client (optional, for development)

### Setup & Run
1. Clone the repository:
   ```sh
   git clone <repository-url> project-name
   cd project-name
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   PORT=7008
   NODE_ENV=development
   ORACLE_HOST=localhost
   ORACLE_PORT=1521
   ORACLE_USER=system
   ORACLE_PASSWORD=your_oracle_password
   ORACLE_DB=XE
   ```

4. Run migrations:
   ```sh
   npm run migration:run
   ```

5. Run the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

## Scripts
| Command                    | Description                              |
|----------------------------|------------------------------------------|
| `npm run dev`              | Start development server with watch mode |
| `npm run dev:old`          | Legacy development server with ts-node  |
| `npm run build`            | Build the project for production (tsgo)  |
| `npm run build:old`        | Build with TypeScript compiler           |
| `npm start`                | Run the built application                |
| `npm run lint`             | Check code formatting with ESLint        |

## Folder Structure
```
📂 starter-oracle-shatab
├── 📂 src
│   ├── 📂 app
│   │   ├── 📂 DB
│   │   │   ├── database.config.ts      # TypeORM DataSource
│   │   │   ├── dbConnection.ts         # DB connection init
│   │   │   └── oracle.config.ts        # Oracle connection pool
│   │   ├── 📂 entities                 # TypeORM entities
│   │   │   └── User.ts
│   │   ├── 📂 migrations               # Database migrations
│   │   ├── 📂 error                    # Error handling
│   │   ├── 📂 helper                   # Utility functions
│   │   ├── 📂 middleware               # Express middleware
│   │   ├── 📂 route                    # API routes
│   │   └── 📂 subscribers              # TypeORM subscribers
│   ├── 📂 config
│   │   ├── index.ts                    # App config
│   │   └── swaggerConfig.ts            # Swagger setup
│   ├── 📂 shared                       # Shared utilities
│   ├── 📂 types                        # TypeScript definitions
│   ├── 📂 utils                        # Helper utilities
│   ├── app.ts                          # Express app setup
│   └── server.ts                       # Server entry point
├── 📂 scripts                          # Code generation scripts
├── 📂 dist                             # Compiled JavaScript
├── .env                                # Environment variables
├── ormconfig.js                        # TypeORM CLI config
├── package.json
├── tsconfig.json
├── README.md
└── MIGRATION_GUIDE.md                  # Migration documentation
```

## API Documentation 
```
http://localhost:7008/api-docs
```

## Database Migrations

This project uses TypeORM migrations for database versioning. All database changes should be made through migrations.

### Creating a New Migration

1. **Modify an entity** in `src/app/entities/`
2. **Generate migration**:
   ```sh
   npm run migration:generate -- -n MigrationName
   ```
3. **Run migration**:
   ```sh
   npm run migration:run
   ```

### Database Connection

The application connects to Oracle Database using:
- **TypeORM** for ORM and query builder
- **oracledb** driver for native connection pooling
- Environment variables for configuration

Supported Oracle versions: 11g and above

## Query Builder

The project includes a powerful `dynamicQueryBuilder` utility for advanced querying with filtering, searching, pagination, and field selection.

### Dynamic Query Builder

```typescript
export const dynamicQueryBuilder = async <T>({
  repository,              // TypeORM repository
  query,                   // Query parameters
  searchableFields = [],   // Fields to search in
  forcedFilters = {},      // Filters to always apply
  relations = {},          // Relations to load
  includeSelects = [],     // Fields to include
  excludeSelects = []      // Fields to exclude
})
```

### Usage Examples

**Basic Query with Pagination:**
```typescript
const users = await dynamicQueryBuilder({
  repository: userRepository,
  query: { page: 1, limit: 10 },
});
```

**Search with Multiple Fields:**
```typescript
const results = await dynamicQueryBuilder({
  repository: userRepository,
  query: { 
    page: 1, 
    limit: 10,
    search: "john",
    sortBy: "createdAt",
    order: "DESC"
  },
  searchableFields: ["email", "name"],
});
```

**With Field Selection:**
```typescript
// Include only specific fields
const users = await dynamicQueryBuilder({
  repository: userRepository,
  query: { page: 1, limit: 10 },
  includeSelects: ["id", "email", "name", "role"],
});

// Exclude sensitive fields
const publicUsers = await dynamicQueryBuilder({
  repository: userRepository,
  query: { page: 1, limit: 10 },
  excludeSelects: ["password"],
});
```

**Advanced Filtering:**
```typescript
const results = await dynamicQueryBuilder({
  repository: userRepository,
  query: { 
    page: 1, 
    limit: 10,
    role: "ADMIN",
    isActive: 1,
    search: "shatab"
  },
  searchableFields: ["email", "name"],
  forcedFilters: { isActive: 1 }, // Always filter active users
  relations: { department: true },
  includeSelects: ["id", "email", "name", "role"],
});
```

**Response Format:**
```json
{
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "perPage": 10
  },
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    }
  ]
}
```

## Oracle Data Types

When creating entities, use Oracle-compatible data types:
- `varchar2(255)` - for strings
- `number(10)` - for integers
- `number(10,2)` - for decimals
- `timestamp` - for dates
- `number(1)` - for booleans (1=true, 0=false)
- `clob` - for large text

See `MIGRATION_GUIDE.md` for detailed documentation.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 7008 |
| `NODE_ENV` | Environment | development |
| `ORACLE_HOST` | Oracle host | localhost |
| `ORACLE_PORT` | Oracle port | 1521 |
| `ORACLE_USER` | Oracle user | system |
| `ORACLE_PASSWORD` | Oracle password | - |
| `ORACLE_DB` | Database name | XE |


## License
This project is licensed under the **MIT License**.

