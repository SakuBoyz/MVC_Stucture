const express = require('express')
const app = express()
const request = require('../controller/handle');
const logger = require('../util/logger.js');

//DEPOSIT
app.post('/deposit', async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().deposit(req.body)
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
//WITHDRAW
app.post('/withdraw', async (req, res) => {
    try {
        logger.debug(req.body);
        var result = await new request().withdraw(req.body);
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
//TRANSFER
app.post('/transfer', async (req, res) => {
    try {
        logger.debug(req.body);
        var result = await new request().transfer(req.body);
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
//CHECK BALANCE
app.post('/checkBalance', async (req, res) => {
    try {
        logger.debug(req.body);
        var result = await new request().checkBalance(req.body);
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