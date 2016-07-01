const express = require('express')
    , request = require('request-promise')
    , app = express()
    , distance = require('gps-distance')
    , _ = require('lodash');

const getData = () => {
    const options = {
        method: 'POST',
        uri: 'http://89.251.178.41:8080/BikeMiService/api',
        body: {
            'Version': '2.0',
            'Action': 'GetStations',
            'Parameters': {
                'Culture': 'it-IT'
            },
            'Hash': '8275DD31B51C959DFF7B8A66B336F454'
        },
        json: true
    };

    return request(options);
};

const cleanData = (data) => {
    const stations = data.Result.Stations.map(item => {
        item.id = item.Number;
        item.bikes = item.Availabilities.map(avaliability => {
            avaliability = Object.assign(avaliability, avaliability.VehicleType);
            // Lower case keys
            avaliability = _.mapKeys(avaliability, (v, k) => k.toLowerCase());
            item.emptyslotcount = avaliability.emptyslotcount;
            // Cleaning
            delete avaliability.emptyslotcount;
            delete avaliability.vehicletype;

            return avaliability;
        });
        // Cleaning
        delete item.Availabilities;
        delete item.Number;
        delete item.IconColor;

        // Lower case keys
        item = _.mapKeys(item, (v, k) => k.toLowerCase());
        return item;
    });

    return _.filter(stations, 'active');
};

const sortByDistanceFrom = (data, lat, lon) => {
    return _.sortBy(data.map(item => {
        item.distance = distance(item.latitude, item.longitude, lat, lon) * 1000;
        return item;
    }), 'distance');
};

const getOnlyAvailable = (data) => {
    return _.filter(data, item => _.sumBy(item.bikes, 'count') > 0);
};

app.get('/', (req, res) => {
    getData().then(body => {
            var data = cleanData(JSON.parse(body.trim()));

            if (req.query.onlyAvailable === 'true') {
                data = getOnlyAvailable(data);
            }

            if (req.query.lat > 0 && req.query.lon > 0) {
                data = sortByDistanceFrom(data, parseFloat(req.query.lat), parseFloat(req.query.lon));
            }

            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

app.listen((process.env['PORT'] || 3000), () => {
    console.log('bicineabbiamo listening on port 3000!');
});
