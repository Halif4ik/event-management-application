# RADENCY Intren Project
## Backend

### Environment Setup

Before running the application, make sure to configure your environment variables in the `.env` file located in the `packages/backend/` directory:

**For Docker Development:**
```bash
DATABASE_URL="postgresql://postgres:admin@postgredb:5432/event_manag?schema=public"
```

**For Local Development:**
```bash
DATABASE_URL="postgresql://postgres:admin@localhost:5433/event_manag?schema=public"
```

### Running with Docker

For run db application from Docker Compose.yaml file, with database execute next command rebuild containers from folder Backend:
```
docker compose up -d --build
```
For stops application Docker Compose.yaml file execute:
```
docker compose down
```

### Running Locally

If you want to run the application locally (without Docker), make sure to:
1. Set the DATABASE_URL in your `.env` file to use `localhost:5433`
2. Have PostgreSQL running locally on port 5433
3. Run `yarn start:dev` from the `packages/backend/` directory

## Creating an Initial Migration:
To create an initial migration, execute the following command:
```
init create folder prisma
```
For create empty migration for handler contains execute next command:
```
yarn prisma generate
prisma db push  
```
This will generate a new migration file in the "migrations" directory named {TIMESTAMP}_name_of_migration. You can then
run this migration to create the necessary tables:
```
prisma migrate dev --name customer-email-dontreq

```
Applying Migrations:
Apply the migrations and create the tables in the database, execute in automatically if deployed all project in hosting :
```
npx prisma migrate deploy
```
Reverting Migrations:
If needed, you can revert the migrations and remove the tables by running:
```
prisma  migrate diff 
```