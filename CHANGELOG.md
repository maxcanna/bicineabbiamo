# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [5.6.0] - 2023-01-29
### Changed
- Improve conversation object logging

## [5.5.3] - 2022-12-12
### Changed 
- Bump `express` from 4.17.1 to 4.17.3

## [5.5.2] - 2022-12-03
### Changed 
- Bump `decode-uri-component` from 0.2.0 to 0.2.2

## [5.5.1] - 2022-11-15
### Changed
- Bump `minimatch` from 3.0.4 to 3.1.2

## [5.5.0] - 2022-11-14
### Removed
- logentries logging

## [5.4.6] - 2022-10-15
### Removed
- References to heroku

## [5.4.5] - 2022-10-15
### Changed
- Use node 16

## [5.4.4] - 2022-10-15
### Added
- Push docker image on merge

## [5.4.3] - 2022-06-06
### Changed
- Bump `protobufjs` from 6.11.2 to 6.11.3

## [5.4.2] - 2022-04-12
### Changed
- Bump `minimist` from 1.2.5 to 1.2.6

## [5.4.1] - 2022-02-10
### Changed
- Bump `undefsafe` from 2.0.2 to 2.0.5

## [5.4.0] - 2021-10-02
### Changed
- Improve `id` computation to handle alphanumeric IDs in the original API


## [5.3.7] - 2021-10-02
### Changed
- Bump `axios` from 0.21.1 to 0.21.2

## [5.3.6] - 2021-10-02
### Changed
- Fix `CHANGELOG` formatting

## [5.3.5] - 2021-09-01
### Changed
- Bump `tar` from 4.4.15 to 4.4.19

## [5.3.4] - 2021-08-04
### Changed
- Bump `minimist` from 1.2.0 to 1.2.5

## [5.3.4] - 2021-08-04
### Changed
- Bump `color-string` from 1.5.4 to 1.6.0

## [5.3.2] - 2021-08-04
### Changed
- Bump `tar` from 4.4.4 to 4.4.15

## [5.3.1] - 2021-05-09
### Changed
- Bump `extend` from 3.0.1 to 3.0.2

## [5.3.0] - 2021-05-09
### Changed
- `onlyAvailable` filter is now `onlyWithBikes` to be coherent with `onlyWithParking`
- `bikesnumber` field is now `bikescount` to be coherent with `emptyslotcount`
- `slotsnumber` field is now `slotscount` to be coherent with `emptyslotcount`
- `emptyslotcount` field is now `emptyslotscount` to be coherent with `slotsnumber` and `bikesnumber`

## [5.2.0] - 2021-05-09
### Added
- Add `onlyActive` filter

## [5.1.0] - 2021-05-09
### Added
- Add `bikesnumber` field

## [5.0.0] - 2021-05-09
### Changed
- Use new bikemi API

## [4.8.1] - 2021-05-08
### Changed
- Cast options to string

## [4.8.0] - 2021-05-08
### Changed
- Improve query params parsing

## [4.7.0] - 2021-05-08
### Changed
- Use `axios`

## [4.6.0] - 2021-05-08
### Changed
- Improve map display

## [4.5.0] - 2021-05-08
### Changed
- Use `detectLocale`

## [4.4.1] - 2021-05-08
### Changed
- Use info log level

## [4.4.0] - 2021-05-08
### Changed
- Code style
- Update code style rule

## [4.3.1] - 2021-05-08
### Changed
- Bump `lodash` from 4.17.4 to 4.17.21

## [4.3.0] - 2021-05-08
### Removed
- Remove `contributing.json`
- Remove deps
### Changed
- Bump deps version
- Use specific `node` version
- Update `node` version

## [4.2.6] - 2021-05-08
### Changed
- Split CI steps

## [4.2.5] - 2021-05-08
### Removed
- Remove `eslint` dependency
### Changed
- Update `eslint` config

## [4.2.4] - 2021-05-08
### Removed
- Remove `dredd` dependency
### Changed
- Avoid CI in `master`

## [4.2.3] - 2021-03-02
### Added
- Automatically create a release

## [4.2.2] - 2021-01-19
### Changed
- Bump `dot-prop` from 4.2.0 to 4.2.1
- Fix version bump check

## [4.2.1] - 2018-12-19
### Added
- Add `onlyWithParking` filter
### Changed
- Use latest ubuntu version in CI
- Upgrade deps
- Use `localizify`
- Use `ramda`

## [4.2.0] - 2018-12-15
### Added
- Add GH actions
### Removed
- Remove now
### Changed
- Upgrade deps

## [4.1.0] - 2018-10-27
### Changed
- `getData` options are now optional

## [4.0.0] - 2018-07-21
### Added
- `type` field in `bike` object
### Removed
- `id` field in `bike` object

## [3.1.1] - 2018-07-13
### Changed
- Use `Promise`

## [3.1.0] - 2018-07-09
### Changed
- Code refactor
- Updated `package.json` so the lib is usable in external projects

## [3.0.0] - 2017-03-11
### Added
- Web UI is now available at `/`
### Changed
- API are now available at `/api`

## [2.2.0] - 2017-02-05
### Added
- Docker support

## [2.2.0] - 2016-07-24
### Added
- Favicon
- Home screen support
- Theme color
- API blueprint
- API test
- Documentation
- Heroku deploy

## [2.2.0] - 2016-07-01
### Added
- CORS support

## [2.1.0] - 2016-07-01
### Added
- `onlyFirstResult` filter

## [2.0.0] - 2016-07-01
### Added
- `onlyAvailable` filter
- `lat`/`lon` sorting

### Changed
- Cleaned and normalized data format

## [1.0.0] - 2016-07-01
### Added
- First working version. Just plain results from original API
