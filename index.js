const express = require('express')
    , routes = require('./routes')
    , app = express();

app.use(routes);
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');
app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
    console.log('bicineabbiamo listening on port ' + app.get('port'));
});
