# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [5.3.1] - 2021-05-09
### Changed
Bump `extend` from 3.0.1 to 3.0.2

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
Use info log level

## [4.4.0] - 2021-05-08
### Changed
- Code style
- Update code style rule

## [4.3.1] - 2021-05-08
### Changed
- Bump `lodash` from 4.17.4 to 4.17.21

## [4.3.0] - 2021-05-08
### Removed
Remove contributing.json
Remove deps
### Changed
Bump deps version
Use specific node version
Update node version

## [4.2.6] - 2021-05-08
### Changed
Split CI steps

## [4.2.5] - 2021-05-08
### Removed
Remove `eslint` dependency
### Changed
Update `eslint` config

## [4.2.4] - 2021-05-08
### Removed
Remove `dredd` dependency
### Changed
Avoid CI in master

## [4.2.3] - 2021-03-02
### Added
Automatically create a release

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
- theme color
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
### Changed
First working version. Just plain results from original API
