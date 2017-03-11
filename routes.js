/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const router = require('express').Router()
    , bicineabbiamo = require('./bicineabbiamo')
    , cors = require('cors');

router.use(cors({origin: true, methods: 'GET'}));

router.get('/api', (req, res) => {
    var options = {};

    if (req.query.onlyAvailable === 'true') {
        options.onlyAvailable = req.query.onlyAvailable;
    }

    if (req.query.lat > 0 && req.query.lon > 0) {
        options.sortByDistanceFrom = {
            latitude: parseFloat(req.query.lat),
            longitude: parseFloat(req.query.lon),
        };
    }

    bicineabbiamo.getData(options, (err, data) => {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }

        if (req.query.onlyFirstResult === 'true') {
            data = data[0];
        }

        res.json(data);
    });
});

module.exports = router;