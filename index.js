const express = require('express')
    , routes = require('./routes')
    , { env: { PORT: port = 3000 } } = process
    , app = express();

app.use(routes);
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');
app.enable('trust proxy');
app.use(require('compression')());
app.use(require('morgan')('combined'));
app.set('port', port);

app.listen(app.get('port'), () => console.log(`bicineabbiamo listening on port ${app.get('port')}`));
