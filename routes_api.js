/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const router = require('express').Router();
const bicineabbiamo = require('./bicineabbiamo');

router.get('/', ({ query: { lat: latitude, lon: longitude }, query }, res) => {
    query.sortByDistanceFrom = {
        latitude,
        longitude
    };

    bicineabbiamo
        .getData(query)
        .then(data => res.json(data))
        .catch(err => console.error(err) || res.send(err));
});

module.exports = router;