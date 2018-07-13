/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const router = require('express').Router()
    , bicineabbiamo = require('./bicineabbiamo');

router.get('/', ({ query: { onlyAvailable, lat, lon, onlyFirstResult, onlyWithParking } }, res) => {
    const options = {
        onlyAvailable: onlyAvailable === 'true',
        onlyFirstResult: onlyFirstResult === 'true',
        onlyWithParking: onlyWithParking === 'true',
    };

    if (lat > 0 && lon > 0) {
        options.sortByDistanceFrom = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
        };
    }

    bicineabbiamo.getData(options)
        .then(data => res.json(data))
        .catch(err => console.error(err) || res.send(err));
});

module.exports = router;