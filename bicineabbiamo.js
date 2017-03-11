/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const request = require('request-promise')
    , _ = require('lodash')
    , distance = require('gps-distance');

class bicineabbiamo {

    static getData(options, callback) {
        return request({
            method: 'POST',
            uri: 'http://89.251.178.41:8080/BikeMiService/api',
            body: {
                'Version': '2.0',
                'Action': 'GetStations',
                'Parameters': {
                    'Culture': 'it-IT',
                },
                'Hash': '8275DD31B51C959DFF7B8A66B336F454',
            },
            json: true,
        })
            .then(body => {
                var data = bicineabbiamo._cleanData(JSON.parse(body.trim()));

                if (options.onlyAvailable) {
                    data = bicineabbiamo._getOnlyAvailable(data);
                }
                if (options.sortByDistanceFrom) {
                    data = bicineabbiamo._sortByDistanceFrom(
                        data,
                        options.sortByDistanceFrom
                    )
                }

                callback(null, data);
            })
            .catch(callback);
    }

    static _cleanData(data) {
        const stations = data.Result.Stations.map(item => {
            item.id = item.Number;
            item.bikes = item.Availabilities.map(availability => {
                availability = Object.assign(availability, availability.VehicleType);
                // Lower case keys
                availability = _.mapKeys(availability, (v, k) => k.toLowerCase());
                item.emptyslotcount = availability.emptyslotcount;
                // Cleaning
                delete availability.emptyslotcount;
                delete availability.vehicletype;

                return availability;
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

    static _sortByDistanceFrom(data, origin) {
        return _.sortBy(data.map(item => {
            item.distance = distance(item.latitude, item.longitude, origin.latitude, origin.longitude) * 1000;
            return item;
        }), 'distance');
    };

    static _getOnlyAvailable(data) {
        return _.filter(data, item => _.sumBy(item.bikes, 'count') > 0);
    };
}

module.exports = bicineabbiamo;