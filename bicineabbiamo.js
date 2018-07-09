/**
 * Created by massimilianocannarozzo on 11/03/17.
 */
const request = require('request-promise').defaults({
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
    , _ = require('lodash')
    , distance = require('gps-distance');


const cleanData = data => {
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

const sortByDistance = (data, { latitude, longitude }) => _.sortBy(data.map(item => ({
    distance: distance(item.latitude, item.longitude, latitude, longitude) * 1000,
    ...item,
})), 'distance');

const getOnlyWithBikesAvailable = data => _.filter(data, item => _.sumBy(item.bikes, 'count') > 0);

class bicineabbiamo {

    static getData({ onlyAvailable, onlyWithParking, sortByDistanceFrom, onlyFirstResult }, callback) {
        return request()
            .then(body => {
                let data = cleanData(JSON.parse(body.trim()));

                if (onlyAvailable) {
                    data = getOnlyWithBikesAvailable(data);
                }
                if (sortByDistanceFrom) {
                    data = sortByDistance(data, sortByDistanceFrom);
                }
                if (onlyFirstResult) {
                    [data] = data;
                }

                callback(null, data);
            })
            .catch(callback);
    }
}

module.exports = bicineabbiamo;
