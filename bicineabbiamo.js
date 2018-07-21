/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const request = require('request-promise').defaults({
        method: 'POST',
        uri: 'http://89.251.178.41:8080/BikeMiService/api',
        body: {
            'Version': '2.0',
            'Action': 'GetStations',
            'Parameters': {
                'Culture': 'it-IT',
            },
            'Hash': '8275DD31B51C959DFF7B8A66B336F454',
        },
        json: true,
    })
    , {
        filter,
        path,
        sortBy,
        sum,
        pluck,
        compose,
        map,
        fromPairs,
        toPairs,
        adjust,
        toLower,
        merge,
        pick,
        omit,
        trim,
    head,
    always,
    when,
    curry,
    } = require('ramda')
    , distance = require('gps-distance');

const lowerCaseKeys = compose(
    fromPairs,
    map(
        adjust(toLower, 0),
    ),
    toPairs
);

const setBikes = map(
    compose(
        pick(['count', 'id', 'name']),
        lowerCaseKeys,
        obj => merge(path(['VehicleType'], obj), obj),
    )
);

const cleanData = compose(
    filter(path(['active'])),
    map(
        compose(
            omit(['availabilities', 'number', 'iconcolor']),
            lowerCaseKeys,
            item => ({
                ...item,
                Id: path(['Number'], item),
                emptyslotcount: path(['Availabilities', 0, 'EmptySlotCount'], item),
                bikes: setBikes(path(['Availabilities'], item)),
            }),
        )
    ),
    path(['Result', 'Stations']),
);

const sortByDistance = curry(({ latitude, longitude }) => compose(
    sortBy(
        path(['distance'])
    ),
    map(a => ({
        ...a,
        distance: distance(a.latitude, a.longitude, latitude, longitude) * 1000,
        })
    )
));

const getOnlyWithBikesAvailable = filter(
    compose(
        sum,
        pluck('count'),
        path(['bikes']),
    )
);

const getOnlyWithParkingAvailable = filter(path(['emptyslotcount']));

class bicineabbiamo {
    static getData({
                       onlyAvailable = false,
                       onlyWithParking = false,
                       sortByDistanceFrom = false,
                       onlyFirstResult = false,
                   }) {
        return request()
            .then(compose(
                when(always(onlyFirstResult), head),
                when(always(sortByDistanceFrom), sortByDistance(sortByDistanceFrom)),
                when(always(onlyWithParking), getOnlyWithParkingAvailable),
                when(always(onlyAvailable), getOnlyWithBikesAvailable),
                cleanData,
                JSON.parse,
                trim,
            )
        )
    }
}

module.exports = bicineabbiamo;
