/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const router = require('express').Router()
    , bicineabbiamo = require('./bicineabbiamo');

router.get('/api', ({ query: { onlyAvailable, lat, lon, onlyFirstResult, onlyWithParking } }, res) => {
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

    bicineabbiamo.getData(options, (err, data) => {
        if (err) {
            console.error(err);
            return res.send(err);
        }

        res.json(data);
    });
});

module.exports = router;