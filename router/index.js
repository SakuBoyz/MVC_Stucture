const express = require('express')
const app = express()
const request = require('../controller/handle');
const logger = require('../util/logger.js');

//login
app.post('/login', async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().login(req.body)
        res.status(200)
        res.json(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})
//getTotal
app.get('/getTotal', async (req, res) => {
    try {
        var result = await new request().getTotal()
        res.status(200)
        res.json(result)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})
module.exports = app