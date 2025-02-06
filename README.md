# Basic info

This repo contains the basic infrastructure for a nestjs backend project. This includes: 
- Docker and docker-compose
- .env template
- Sequelize
- Passport -> local and jwt strategies
- Http
- Migrations
- Uses of Guards, like Jwt and Roles
- Unit and e2e testing


After this , you have an explanation of how to work in dev environment and add/do some generic tasks. 

## Dev

1- Create `.env` file with the variables in the `.env.template` file.
2- Run `npm install` to install the dependencies.
3- Run `npm run dev` to start the development server.
4- open http://localhost:3000 to see health check page

## Docker

1- docker compose up --build -d
4- Wait and open http://localhost:3000 to see health check page

## Migrations

### Only in first iteration of the project

1- In the installation phase it will install sequelize-cli
2- Run `npx sequelize-client init`
3- Create a folder in the root of the project called `config` and create a `config.json` with the next setup:

```.json
module.exports = {
   development: {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'dev',
   },
   test: {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'test',
   },
   production: {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'prod',
   },
}
```

### Commands useful

[Sequelize documentation](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration)

#### new tables

<!-- require more test to check the use of this step  -->
<!-- 1- Change the .entity file and rename it to .model, using the Decorator @Column with information inside to declare which type expect, null, pk, etc -->

1- Run the next command to create a migration: `npx sequelize-cli migration:generate --name <name-of-migration>`

3- Run the migration to db: `npx sequelize-cli db:migrate`

**_WARNING:_** In case of a rollback from the db, use the command "undo": `npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js`. _Don't recommended_ If you drop the table from pgadmin, go to the table `SequelizeMeta` and delete the register of the migration with the same name than the /migrations folder

#### Connection with docker db:

##### .env

Use the name of the service in host and the docker port defined like `container_port` in the `.env` file. In this case the service is called `db` and the port is `5432`

##### config.js

But in the `config.js` file use `localhost` and the port you define like `host_port`, in this case `5433`

## Creation of new resource

At the moment of a creation of a new resource, if this res will be a representation of a table in the DB, you must:
1- Go to the new module <new-res>.module.ts and add an import with: `imports: [SequelizeModule.forFeature([<new-res>])],`

2- Add this export: `exports: [SequelizeModule],`

3- Go to `db.module.ts` and add the new entity to the array of `models`
