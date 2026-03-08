# RADENCY Intren Project
## Backend

For run db application from  Docker Compose.yaml file, with database execute next command rebuild containers from folder Backend :
```
docker compose up -d --build
```
For stops application  Docker Compose.yaml file execute:
```
docker compose down
```

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