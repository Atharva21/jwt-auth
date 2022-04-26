# Server

## Start

`yarn install`
`yarn start`
http://localhost:4000/graphql

## Steps

By Ben Awad :
[JWT Authentication Node.js Tutorial with GraphQL and React](https://www.youtube.com/watch?v=25GS0MLT8JU)

-   JWT, Oauth and cross-site-scripting(XSS) and cross-site-resource-forgery (CSRF): <br>
    -   [How to Store JWT for Authentication](https://youtu.be/iD49_NIQ-R4)
    -   [Why LocalStorage is Vulnerable to XSS (and cookies are too)](https://youtu.be/M6N7gEZ-IUQ)

[GraphQL N+1 Problem](https://www.youtube.com/watch?v=uCbFMZYQbxE)

#### Used Typeorm to init a project

`typeorm init --name server --database postgres`

[Create postgress docker Image](https://www.youtube.com/watch?v=G3gnMSyX-XM)

`docker run -p 5432:5432 -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=stripe-example -v pgdata:/var/lib/postgresql/data postgres`

[Create table inside docker container](https://stackoverflow.com/questions/19674456/run-postgresql-queries-from-the-command-line)

1. `docker exec -it 1f7961b5333a bash`
2. `psql -U postgres`
3. `CREATE DATABASE "jwt-auth-example";`

## Dependencies:

**TypeORM already added in init**

**Apollo GraphQL server :**

`yarn add express apollo-server-express graphql`

**Type-GraphQL :**

`yarn add type-graphql`

**Dev dependencies:**

`yarn add -D @types/express @types/graphql`
`yarn add -D nodemon`

# Web

## Steps

`npx create-react-app web --template typescript`
`yarn start`

`yarn add @apollo/client graphql`
`yarn add -D @types/graphql`

`yarn add -D @graphql-codegen/cli` [graphql-codegen](https://www.youtube.com/watch?v=25GS0MLT8JU&t=5634s)

`yarn add formik` [Formik by Ben Awad](https://www.youtube.com/watch?v=FD50LPJ6bjE)

`yarn add jwt-decode`
`yarn add -D @types/jwt-decode`
