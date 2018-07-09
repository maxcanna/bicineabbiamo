/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const router = require('express').Router()
    , bicineabbiamo = require('./bicineabbiamo')
    , cors = require('cors');

router.use(cors({ origin: true, methods: 'GET' }));

router.get('/api', ({ query: { onlyAvailable, lat, lon, onlyFirstResult } }, res) => {
    const options = {};

    if (onlyAvailable === 'true') {
        options.onlyAvailable = true;
    }

    if (lat > 0 && lon > 0) {
        options.sortByDistanceFrom = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
        };
    }

    if (onlyFirstResult === 'true') {
        options.onlyFirstResult = true;
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