const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./views/swagger.json');

//call swagger(ui)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

//call router
app.use('/', require("./controllers/router"));   

//Start Server at port....
const port = 3000
app.listen(port, () => {
  console.info('[Swagger] http://localhost:' + port + '/api-docs/')
  console.info('Start server at port ' + port)
})
