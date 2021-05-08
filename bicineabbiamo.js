/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const axios = require('axios');
const {
    filter,
    path,
    propOr,
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
    head,
    always,
    when,
    curry,
} = require('ramda');
const distance = require('gps-distance');

const BIKE_TYPE_NORMAL = 'NORMAL';
const BIKE_TYPE_ELECTRIC = 'ELECTRIC';
const BIKE_TYPE_BABY = 'BABY';
const BIKE_TYPE_CHILD_SEAT = 'CHILD_SEAT';

const BIKE_TYPES = {
    2: BIKE_TYPE_NORMAL,
    3: BIKE_TYPE_ELECTRIC,
    4: BIKE_TYPE_CHILD_SEAT,
    5: BIKE_TYPE_BABY,
};

const setBikeType = bike => ({
    ...bike,
    type: propOr(BIKE_TYPE_NORMAL, propOr(2, 'id', bike), BIKE_TYPES),
});

const lowerCaseKeys = compose(
    fromPairs,
    map(
        adjust(toLower, 0),
    ),
    toPairs
);

const setBikes = map(
    compose(
        pick(['count', 'type', 'name']),
        setBikeType,
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
    path(['data', 'Result', 'Stations']),
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
    } = {}) {
        return axios.post('http://app.bikemi.com:8888/BikeMiService/api', {
            Version: '2.0',
            Action: 'GetStations',
            Parameters: {
                Culture: 'it-IT',
            },
            Hash: '8275DD31B51C959DFF7B8A66B336F454',
        })
            .then(compose(
                when(always(onlyFirstResult), head),
                when(always(sortByDistanceFrom), sortByDistance(sortByDistanceFrom)),
                when(always(onlyWithParking), getOnlyWithParkingAvailable),
                when(always(onlyAvailable), getOnlyWithBikesAvailable),
                cleanData,
            ))
    }
}

module.exports = bicineabbiamo;
