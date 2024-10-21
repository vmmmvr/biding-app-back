
## Project setup
1- create create a `.env` and add these variables to it:


```
PORT=
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
```
for example `PORT`, `REDIS_HOST`, `REDIS_PORT` can be the default values
```
PORT=3000
REDIS_HOST="localhost"
REDIS_PORT=6379
```

2- mysql database: you must have mysql insannce running in your computer or have it via docker `go for setup no.3 to set it up via docker`.

here you can access your mysql on you pc:
```
mysql -u root -p
```
create a database:
```
CREATE DATABASE database_name;
```

then add `username` `eg:root` + `password`, and `database_name` here:

```
DATABASE_URL="mysql://username:password@127.0.0.1:3306/databse_name"
```

3- to create mysql instance via docker `must have docker running in your machine`

run:
```
docker-compose up -d 
```
then take the root password from the `docker-compose.yml` file and modify the `.env` file based on that 
eg:
```
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/livebiding"
```

now you setup

then run these command to install packages:

```bash
$ npm install
```

run the migrations 
```
npx prisma migrate deploy 
```

and start the project

```
npm run start:dev
```
if you followed every step you should see green logs in your terminal.