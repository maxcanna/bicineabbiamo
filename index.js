const newrelic = require('newrelic') // eslint-disable-line
    , express = require('express')
    , api = require('./routes_api')
    , assistant = require('./routes_assistant')
    , logger = require('./logger')
    , Rollbar = require('rollbar')
    , morgan = require('morgan')
    , { env: { PORT: port = 3000, ROLLBAR_KEY } } = process
    , rollbar = new Rollbar(ROLLBAR_KEY)
    , app = express();

app.use(require('compression')());
app.use(morgan('combined', { stream: logger }));
app.use('/api', api);
app.use('/assistant', assistant);
app.use(express.static(__dirname + '/public'));
app.use(rollbar.errorHandler());
app.disable('x-powered-by');
app.enable('trust proxy');

app.listen(port, () => logger.log(`bicineabbiamo listening on port ${port}`));
