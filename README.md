# Installing

1. Install dependecies

```
yarn
```

2. Make sure you have PostgreSQL running on your computer with a database called `typegraphql-example` and a user who has access to that database with the username `postgres` and password `postgres`.
   Using docker:

```bash
docker run -p 5432:5432 -d \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=typegraphql-example \
    -v pgdata:/var/lib/postgresql/data \
    postgres
```

3. Start the server

```

yarn start

```

To verified it worked, you can go to http://localhost:4000

```

```
