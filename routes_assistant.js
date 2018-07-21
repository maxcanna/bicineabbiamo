const router = require('express').Router()
    , bodyParser = require('body-parser').json()
    , bicineabbiamo = require('../bicineabbiamo')
    , { pathOr } = require('ramda')
    , { env: { NODE_ENV = 'development', MAPS_API_KEY: mapApiKey } } = process
    , development = NODE_ENV === 'development';
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

const REQUEST_TYPE_BIKES = 'REQUEST_TYPE_BIKES';
const REQUEST_TYPE_PARKING = 'REQUEST_TYPE_PARKING';
const DEFAULT_LATITUDE = 45.4642107;
const DEFAULT_LONGITUDE = 9.1900141;

const isBikesRequest = requestType => requestType === REQUEST_TYPE_BIKES;
const isParkingRequest = requestType => requestType === REQUEST_TYPE_PARKING;

const getStationMapImageUrl = (latitude, longitude) => `https://maps.googleapis.com/maps/api/staticmap?` +
    `autoscale=true` +
    `&size=330x192`+
    `&maptype=roadmap`+
    `&format=png&scale=2` +
    `&markers=size:large%7Ccolor:green%7C${latitude},${longitude}`;

const getStationDirectionUrl = (latitude, longitude) => `https://www.google.com/maps/dir/?` +
    `api=1` +
    `&travelmode=walking` +
    `&destination=${latitude},${longitude}`;

const getStationCard = (title, text, latitude, longitude) => new BasicCard({
    text,
    title,
    buttons: new Button({
        title: 'Indicazioni',
        url: getStationDirectionUrl(latitude, longitude),
    }),
    image: new Image({
        url: getStationMapImageUrl(latitude, longitude),
        alt: 'Mappa',
    }),
});

const getBikesText = bikes => bikes
    .filter(bike => bike.count > 0)
    .map(({ count, name }) => `${count} ${name}`)
    .join(' e ').toLocaleLowerCase();

const getParkingText = count => `${count} posti liberi`;

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

            const distanceText = showDistance ? ` a ${Math.round(distance)}m da te` : '';

            conv.close(`Ci sono ${text}${distanceText} nella stazione ${name}`);
            conv.close(getStationCard(name, text, stationLatitude, stationLongitude));
        })
};

const getCoordinatesForAddress = address => googleMapsClient.geocode({ address: `${address}, Milano, italia`})
    .asPromise()
    .then(res => ({
        latitude: pathOr(undefined, ['json', 'results', 0, 'geometry', 'location', 'lat'], res),
        longitude: pathOr(undefined, ['json', 'results', 0, 'geometry', 'location', 'lng'], res),
    }));

const handleSearchIntent = (conv) => {
    const address = pathOr('', ['parameters', 'address'], conv);
    const queryText = pathOr('', ['body', 'queryResult', 'queryText'], conv);

    if (address.length > 0) {
        return getCoordinatesForAddress(address)
            .then(location => {
                const { latitude, longitude } = location;
                if(latitude && longitude) {
                    conv.data.location = location;
                    return getAnswerForSearch(conv);
                } else {
                    return conv.ask(`Non ho capito bene l'indirizzo che mi hai chiesto, puoi ripetere?`);
                }
            })
            .catch(err => console.log(err)||conv.ask('Mi spiace, si è verificato un errore. Puoi riprovare?'));
    } else if (queryText.indexOf(' casa') >= 0) {
        //TODO Get indirizzo casa IF AVAILABLE
        // Simulate casa is 'piazza cinque giornate'
        // conv.data.location = { latitude: 45.4622553, longitude: 9.20674 };
        // return getAnswerForSearch(conv);
        return conv.ask('Purtroppo non so dove abiti ma sto imparando ogni giorno di più. Altro che posso fare?');
    } else {
        askForPermission(conv);
    }
};

const askForPermission = conv => conv.ask(new Permission({
    context: `per trovare ${isBikesRequest(conv.data.requestType) ? 'le bici' : 'i posti liberi'} intorno a te`,
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
            conv.ask(`Purtroppo non riesco ad ottenere la tua posizione. Per favore riprova.`);
        }
    } else {
        conv.ask(`Mi spiace ma ho bisogno di sapere la tua posizione per aiutarti. Posso fare altro?`);
    }
};

const handleWelcomeIntent = conv => conv.ask('Ciao, benvenuto in Bici Milano. Cosa posso fare per te?');

app.intent('welcome', handleWelcomeIntent);

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
        conv.ask('Mi spiace ma non so come aiutarti. Posso fare altro?');
    }
});

router.use(bodyParser, app);

module.exports = router;