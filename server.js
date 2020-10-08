const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./util/logger.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//swagger
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./router/index'));

const port = 8080;
const server = app.listen(port, () => {
    logger.info(`Server ready at localhost:${port}`);
    logger.info('[Swagger] http://localhost:' + port + '/api-docs/')
})


