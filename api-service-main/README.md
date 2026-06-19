<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is Insect Trap API service. It use [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

The goal of this service is collect **Environment Detail** and **Capture Result** data from **Trap Node** so can be displayed on the dashboard.

The data is collected through **Task Scheduller** using **MQTT**.

It also can be collected by **Manual Trigger (Task)**


## Installation

```bash
$ npm install
```

## Running the service
This service depends on :
- Redis, for storing whitelisted jwt token
- PostgresDB, for stroring data

so make make sure that the configuration configured properly on **.env**

### Fresh Installation
If you run this service for the first time you need to run migration and seeder


```bash
$ npm run typeorm:run-migrations
$ npm run seed:run
```

Finally you can run the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Now you can login to this service using default user
```bash
u : superadmin@email.com
p : !234Lima
```

### Running on Docker
If you prefer run this project using docker please update the db host on **.env**

Then you can run this project using :
```bash
$ docker-compose up
```

## Migrations
You can create a new migration file using this commad :
```bash
$ npm run typeorm:create-migration --name=CreateTableName
```

## Test
To run the test for this service using
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

For static code analysis using SonarQube, please edit the **sonar-project.properties**
then run
```bash
$ sonar-scanner
```


## Additional Note
- This project using **NodeJS  v18.13.0**
- For **Windows** user, if you find difficulties running nest commad just run this command before :
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
- Postman collection service name is "Insect Trap"
- MQTT Payload sample can be accessed [here](https://docs.google.com/document/d/1azpm988JFNOHewlwBxeIXm3sGsw8BZO2BFz8orz2xLI/view)
- ERD can be accessed [here](https://azimutt.tlabdemo.com/b86eb909-cafc-4e91-b285-892faa6038cc/2cc2cbd7-b3c9-4f6f-8cc3-8d8e890899ee)

This project is still on development process. Any feedback are welcome and we really appreciate it.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

If you find any difficulties running this project, contact your team member : )

## License

Nest is [MIT licensed](LICENSE).
