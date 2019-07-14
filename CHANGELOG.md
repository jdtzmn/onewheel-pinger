# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.8] - 2019-07-14

### Changed

- Dockerfile command from `yarn start` to instead use pm2
- Removed pm2 as dependency (since it will only be used in docker)

## [0.1.7] - 2019-07-14

### Added

- Dockerfile as well as .dockerignore

### Removed

- Unnecessary `@types/axios` package

## [0.1.6] - 2019-07-14

### Added

- Debug namespace for the `checkDeliveryDates.ts` file
- pm2 for monitoring and scaling

### Changed

- The way certain errors were handled in the model and delivery dates CRON

### Removed

- A response for the `STOP` command

## [0.1.5] - 2019-07-13

### Fixed

- A bug where `Invalid Date` would be returned by the ping function if the Onewheel server was rate-limiting requests
- An issue with npm package type definitions not being read correctly

## [0.1.4] - 2019-06-30

### Changed

- Removed `s from message commands

## [0.1.3] - 2019-06-30

### Added

- Note in welcome message about the help command

## [0.1.2] - 2019-06-30

### Changed

- Server so that it responds with the reply instead of sending messages separately

- Removed @types/twilio since it is deprecated

- Now uses TwiML to respond to texts

- `HELP` command to `?`

### Fixed

- A bug where messages with excess spaces would not be sent the right responses

## [0.1.1] - 2019-06-30

### Changed

- Moved typescript to a dependency instead of a devDependency
- Moved some devDependencies to their correct place

## [0.1.0] - 2019-06-30

### Added

- A README.md
- License file
- eslint for linting typescript files
- npm script for linting
- vscode settings to enable eslint on typescript files
- Basic unit tests using jest
- Travis integration
- Husky and lint-staged for precommit testing

### Fixed

- Code that did not match coding style

### Changed

- env.ts file to add default values

### Removed

- Unnecessary dependency

## [0.0.1] - 2019-06-30

### Added

- Initial project setup
