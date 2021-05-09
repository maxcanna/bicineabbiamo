/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const axios = require('axios');
const {
    filter,
    path,
    propOr,
    sortBy,
    compose,
    map,
    pick,
    head,
    always,
    when,
    curry,
} = require('ramda');
const distance = require('gps-distance');

const BIKE_TYPE_NORMAL = 'NORMAL';
const BIKE_TYPE_ELECTRIC = 'ELECTRIC';
// TODO const BIKE_TYPE_BABY = 'BABY';
const BIKE_TYPE_CHILD_SEAT = 'CHILD_SEAT';

const BIKE_TYPES = {
    bike: BIKE_TYPE_NORMAL,
    ebike: BIKE_TYPE_ELECTRIC,
    ebike_with_childseat: BIKE_TYPE_CHILD_SEAT,
    // TODO 5: BIKE_TYPE_BABY
};

const BIKE_NAMES = {
    bike: 'Biciclette',
    ebike: 'Biciclette elettriche',
    ebike_with_childseat: 'Biciclette elettriche con seggiolino',
    // TODO 5: BIKE_TYPE_BABY
};

const setBikeType = bike => ({
    ...bike,
    type: propOr(BIKE_TYPE_NORMAL, path(['category'], bike), BIKE_TYPES),
    name: propOr('Biciclette', path(['category'], bike), BIKE_NAMES),
});

const setBikes = map(
    compose(
        pick(['count', 'type', 'name']),
        setBikeType,
    )
);

const cleanData = compose(
    map(
        compose(
            item => ({
                id: +path(['name'], item),
                description: path(['subTitle'], item).replace(/^\d* /, ''),
                name: path(['title'], item).replace(/^.*?- /, ''),
                latitude: path(['coord', 'lat'], item),
                longitude: path(['coord', 'lng'], item),
                active: path(['enabled'], item),
                bikescount: path(['availabilityInfo', 'availableVehicles'], item),
                slotscount: path(['availabilityInfo', 'availableDocks'], item) + path(['availabilityInfo', 'availableVehicles'], item),
                emptyslotscount: path(['availabilityInfo', 'availableDocks'], item),
                bikes: setBikes(path(['availabilityInfo', 'availableVehicleCategories'], item))
            })
        )
    ),
    path(['data', 'data', 'dockGroups']),
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

const getOnlyWithBikesAvailable = filter(path(['bikescount']));

const getOnlyWithParkingAvailable = filter(path(['emptyslotscount']));

const getOnlyActive = filter(path(['active']));

class bicineabbiamo {
    static getData({
        onlyActive = true,
        onlyWithBikes = false,
        onlyWithParking = false,
        sortByDistanceFrom = {},
        onlyFirstResult = false
    } = {}) {
        const latitude = parseFloat(sortByDistanceFrom.latitude);
        const longitude = parseFloat(sortByDistanceFrom.longitude);

        const extensions = JSON.stringify({
            persistedQuery: {
                version: 1,
                sha256Hash:
                    '7fa245496fabfeae8cc14d47b58518eb6561683f6eca05ac64a00850939f818f'
            }
        });

        return axios({
            url: 'https://core.urbansharing.com/public/api/v1/graphql',
            params: {
                extensions,
                operationName: 'stationMapQuery'
            },
            headers: {
                systemid: 'milan-bikemi'
            }
        }).then(
            compose(
                when(always('' + onlyFirstResult === 'true'), head),
                when(always(latitude > 0 && longitude > 0), sortByDistance({ latitude, longitude })),
                sortBy(path(['id'])),
                when(always('' + onlyWithParking === 'true'), getOnlyWithParkingAvailable),
                when(always('' + onlyWithBikes === 'true'), getOnlyWithBikesAvailable),
                when(always('' + onlyActive === 'true'), getOnlyActive),
                cleanData,
            ))
    }
}

module.exports = bicineabbiamo;
