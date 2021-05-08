const router = require('express').Router();
const bodyParser = require('body-parser').json();
const bicineabbiamo = require('./bicineabbiamo');
const localizify = require('localizify');
const logger = require('./logger');
const { t } = localizify;
const { pathOr } = require('ramda');
const { env: { NODE_ENV = 'development', MAPS_API_KEY: mapApiKey } } = process;
const development = NODE_ENV === 'development';
const {
    dialogflow,
    Permission,
    BasicCard,
    Button,
    Image,
} = require('actions-on-google');

const app = dialogflow({ debug: development });

const googleMapsClient = require('@google/maps').createClient({
    key: mapApiKey,
    Promise: Promise,
});

localizify
    .add('it', require('./messages/it.json'))
    .add('en', require('./messages/en.json'));

const REQUEST_TYPE_BIKES = 'REQUEST_TYPE_BIKES';
const REQUEST_TYPE_PARKING = 'REQUEST_TYPE_PARKING';
const DEFAULT_LATITUDE = 45.4642107;
const DEFAULT_LONGITUDE = 9.1900141;

const isBikesRequest = requestType => requestType === REQUEST_TYPE_BIKES;
const isParkingRequest = requestType => requestType === REQUEST_TYPE_PARKING;

const getStationMapImageUrl = (latitude, longitude) => `https://maps.googleapis.com/maps/api/staticmap?` +
    `autoscale=true` +
    `&size=335x192`+
    `&maptype=roadmap`+
    `&format=png&scale=2` +
    `&key=${mapApiKey}` +
    `&markers=size:large%7Ccolor:green%7C${latitude},${longitude}`;

const getStationDirectionUrl = (latitude, longitude) => `https://www.google.com/maps/dir/?` +
    `api=1` +
    `&travelmode=walking` +
    `&destination=${latitude},${longitude}`;

const getStationCard = (title, text, latitude, longitude) => new BasicCard({
    text,
    title,
    buttons: new Button({
        title: t('card.directions'),
        url: getStationDirectionUrl(latitude, longitude),
    }),
    image: new Image({
        url: getStationMapImageUrl(latitude, longitude),
        alt: t('card.map'),
    }),
});

const getItemText = ({ count, description }) => t('answer.item', { count, description });

const getBikesText = bikes => {
    const items = bikes
        .filter(pathOr(0, ['count']))
        .map(({ count, type }) => count > 1 ?
            getItemText({ count, description: t(`bikes.type.${type}`) }) :
            getItemText({ count, description: t(`bike.type.${type}`) })
        );

    return [items.splice(0, items.length - 2).join(', ') , items.join(` ${t('and')} `)]
        .filter(Boolean)
        .join(', ');
};

const getParkingText = count => count > 1 ?
    getItemText({ count, description: t('parkings') }) :
    getItemText({ count, description: t('parking') });

const getStation = (requestType, latitude, longitude) => bicineabbiamo.getData({
    onlyAvailable:  isBikesRequest(requestType),
    onlyWithParking: isParkingRequest(requestType),
    onlyFirstResult: true,
    sortByDistanceFrom: {
        latitude,
        longitude,
    },
});

const getAnswerForSearch = conv => {
    const latitude = pathOr(DEFAULT_LATITUDE, ['data', 'location', 'latitude'], conv);
    const longitude = pathOr(DEFAULT_LONGITUDE, ['data', 'location', 'longitude'], conv);
    const requestType = pathOr('', ['data', 'requestType'], conv);
    const showDistance = pathOr(false, ['device', 'location'], conv);

    return getStation(requestType, latitude, longitude)
        .then(station => {
            const name = pathOr('', ['name'], station);
            const distance = pathOr(0, ['distance'], station);
            const bikes = pathOr({}, ['bikes'], station);
            const emptyslotcount = pathOr(0, ['emptyslotcount'], station);
            const stationLatitude = pathOr(0, ['latitude'], station);
            const stationLongitude = pathOr(0, ['longitude'], station);

            const text = isParkingRequest(requestType) ? getParkingText(emptyslotcount) : getBikesText(bikes);

            const distanceText = showDistance ? t('distance', { distance: Math.round(distance) }) : ' ';

            conv.close(t('answer.result', { text, distance: distanceText, name } ));
            conv.close(getStationCard(name, text, stationLatitude, stationLongitude));
        })
};

const getCoordinatesForAddress = address => googleMapsClient.geocode({ address: `${address}, Milano, Italia` })
    .asPromise()
    .then(res => ({
        latitude: pathOr(undefined, ['json', 'results', 0, 'geometry', 'location', 'lat'], res),
        longitude: pathOr(undefined, ['json', 'results', 0, 'geometry', 'location', 'lng'], res),
    }));

const handleSearchIntent = (conv) => {
    const address = pathOr('', ['parameters', 'address'], conv);
    const query = pathOr('', ['query'], conv);

    if (address.length > 0) {
        return getCoordinatesForAddress(address)
            .then(location => {
                const { latitude, longitude } = location;
                if(latitude && longitude) {
                    conv.data.location = location;
                    return getAnswerForSearch(conv);
                } else {
                    return conv.ask(t('answer.address.notFound'));
                }
            })
            .catch(err => console.log(err)||conv.ask(t('answer.address.error')));
    } else if (query.indexOf(` ${t('house')}`) >= 0) {
        //TODO Get indirizzo casa IF AVAILABLE
        // Simulate casa is 'piazza cinque giornate'
        // conv.data.location = { latitude: 45.4622553, longitude: 9.20674 };
        // return getAnswerForSearch(conv);
        return conv.ask(t('answer.house.error'));
    } else {
        askForPermission(conv);
    }
};

const askForPermission = conv => conv.ask(new Permission({
    context: t('geolocation.context.description', {
        item: isBikesRequest(pathOr(REQUEST_TYPE_BIKES, ['data', 'requestType'], conv)) ?
            t('geolocation.context.bikes') :
            t('geolocation.context.parkings'),
    }),
    permissions: ['DEVICE_PRECISE_LOCATION'],
}));

const handleConfirmationIntent = (conv, params, confirmationGranted) => {
    if (confirmationGranted) {
        const latitude = pathOr(undefined, ['device', 'location', 'coordinates', 'latitude'], conv);
        const longitude = pathOr(undefined, ['device', 'location', 'coordinates', 'longitude'], conv);

        if (latitude && longitude) {
            conv.data.location = { latitude, longitude };
            return getAnswerForSearch(conv);
        } else {
            conv.ask(t('answer.geolocation.error'));
        }
    } else {
        conv.ask(t('answer.geolocation.denied'));
    }
};

app.intent('search-bikes', conv => {
    conv.data.requestType = REQUEST_TYPE_BIKES;
    return handleSearchIntent(conv);
});

app.intent('search-parking', conv => {
    conv.data.requestType = REQUEST_TYPE_PARKING;
    return handleSearchIntent(conv);
});

app.intent('permission', handleConfirmationIntent);

app.fallback(conv => {
    const answer  = pathOr('', ['incoming', 'parsed', 0], conv);
    const action  = pathOr('', ['action'], conv);
    if (action.indexOf('smalltalk') === 0) {
        conv.close(answer);
    } else {
        conv.ask(t('answer.fallback'));
    }
});

app.middleware(conv => {
    const languageCode = pathOr('en', ['body', 'queryResult', 'languageCode'], conv);
    const [locale] = languageCode.split('-');

    localizify.setLocale(locale);

    logger.info(conv);

    return conv;
});

router.use(bodyParser, app);

module.exports = router;
