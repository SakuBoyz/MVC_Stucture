const express = require('express')
const app = express()
const request = require('../controller/handle');
const logger = require('../util/logger.js');

//CREATE STUDENT
app.post('/createStudent', async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().createStudent(req.body)
        res.status(201)
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
//GET STUDENT
app.post('/getStudent', async (req, res) => {
    try {
        logger.debug(req.body);
        var result = await new request().getStudent(req.body);
        res.status(200);
        res.json(result);
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