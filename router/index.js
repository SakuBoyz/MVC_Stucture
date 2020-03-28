const express = require('express')
const app = express()
const services = require('../controller/handle');
const logger = require('../util/logger.js');

//login
app.get('/ShowPatientsData', async (req, res) => {
    try {
        var result = await new services().ShowPatientsData(req.body)
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