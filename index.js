const express = require('express')
    , request = require('request-promise')
    , app = express();

app.get('/', (req, res) => {
    const options = {
        method: 'POST',
        uri: 'http://89.251.178.41:8080/BikeMiService/api',
        form: '{"Version":"2.0","Action":"GetStations",'+
        '"Parameters":{"Culture":"it-IT"},'+
        '"Hash":"8275DD31B51C959DFF7B8A66B336F454"}'
    };

    request(options)
        .then(function (body) {
            res.set('Content-Type', 'application/json').send(body);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen((process.env['PORT'] || 3000), () => {
    console.log('bicineabbiamo listening on port 3000!');
});
