# Onewheel-pinger

Onewheel-pinger is an SMS application that allows users to send their order number and delivery email address to a phone number and receive notifications as to if/when their [onewheel](https://onewheel.com/) delivery changes.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project is a [node.js](https://nodejs.org) application.

Before installing, [download and install node.js](https://nodejs.org/en/download/).

This project uses [mongodb](https://mongodb.com) to store user data. For use in development, it is highly recommended that you [install mongodb locally](https://docs.mongodb.com/manual/installation/).

### Installing

Clone the repo

```bash
$ git clone https://github.com/jdtzmn/onewheel-pinger
Cloning into onewheel-pinger...
```

Run `npm install`

```bash
npm install
```

Or using yarn

```bash
yarn
```

Once the dependencies are installed, environment variables need to be set:

### Environment variables

This project uses twilio to send and receive texts as well as mongo to store user data.

---

To find the twilio sid and auth_token, [read their docs here](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them).

To learn about the mongo connection string, [read their docs here](https://docs.mongodb.com/manual/reference/connection-string/).

#### Required

- `ENCRYPTION_KEY` - a 32 byte key for encrypting the user data before sending it to the mongo database

- `TWILIO_SID` - the SID that is given by [twilio](https://twilio.com)
- `TWILIO_TOKEN` - the auth_token that is given by [twilio](https://twilio.com)

#### Optional

- `PORT` - a port to run the web server on

> Default: `3000`

- `MONGO_STRING` - the connection string used to connect to a mongo database

> Default: `'mongodb://localhost'`

- `MONGO_DB` - the database name to use after connecting

> Default: `'test'`

## Running the tests

### Unit tests

These unit tests test each individual component of the app

```bash
npm test
```

### And coding style tests

These coding style tests ensure that the code matches the expected coding style

```bash
npm run lint
```

### A note about these tests

These tests are also run before every commit as a git `precommit` script

## Deployment

To deploy, a [paid twilio account](https://www.twilio.com/sms/pricing) as well as [a mongo database](https://www.mongodb.com/products/how-to-buy) are required.

## Built With

- [express](http://expressjs.com/) - The web server used

- [twilio](https://twilio.com/) - SMS integration

- [mongo](https://www.mongodb.com/) - Used to store user data

- [cron](https://npmjs.com/cron/) - Used to run scheduled daily jobs

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jdtzmn/onewheel-pinger/tags).

## Authors

* **Jacob Daitzman** - *Initial work* - [jdtzmn](https://github.com/jdtzmn)

See also the list of [contributors](https://github.com/jdtzmn/onewheel-pinger/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [PurpleBooth](https://github.com/PurpleBooth/) for this README.md template
