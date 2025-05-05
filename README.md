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

**Warning**: maybe you need to install cross-env locally to do the sync.

After this , you have an explanation of how to work in dev environment and add/do some generic tasks.

## Dev

1- Create `.env` file with the variables in the `.env.template` file.

2- Run `npm install` to install the dependencies.

3- Run `npm run start:dev` to start the development server.

4- open http://localhost:3000 to see health check page

## Docker

1- docker compose up --build -d.

2- Check if in service `db` in `environment`: `POSTGRES_DB` value it's the same in your app service, in this case organization-monolith, `environment`: `DATABASE_URL`

3- Wait and open http://localhost:3000 to see health check page.

## Migrations

#### New tables

1- Define the entities in the module.

2- Run the command npm run sync:alter.

**Warning**: maybe you need to install cross-env locally to do the sync.

#### Connection with docker db:

##### .env

Use the name of the service in host and the docker port defined like `container_port` in the `.env` file. In this case the service is called `db` and the port is `5432`.

##### config.js

But in the `config.js` file use `localhost` and the port you define like `host_port`, in this case `5433`.

#### Visualize DB in pgadmin

1- Go to http://localhost:8080

2- Login with the credentials hardcoded in docker-compose.yml.

3- Create a new server with the name of the service in docker-compose environment: `POSTGRES_DB`. The Host name/address must be the `container_name`

## Creation of new resource

At the moment of a creation of a new resource, if this res will be a representation of a table in the DB, you must:

1- Go to the new module <new-res>.module.ts and add an import with: `imports: [SequelizeModule.forFeature([<new-res>])],`.

2- Go to `db.module.ts` and add the new entity to the array of `models`.
