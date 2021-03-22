const express = require("express");
const app = express();
const logic = require("./logic");

app.post("/CheckIn", (req, res) => {
  try {
    let sid = req.body.sid;//student id
    let InputTemp = Math.floor(req.body.temp * 10) / 10; // round down 1 place decimal temperature
    let result = new logic().CheckIn(sid, InputTemp); // parse Input to Logic
    res.status(201).json(result);
  } catch (error) {
    let messageError = {
      statusCode: error.statusCode || 400,
      message: error.message || error,
    };
    res.status(messageError.statusCode);
    res.json(messageError);
  }
});

app.get("/GetTempInfo", (req, res) => {
  try {
    let result = new logic().GetTempInfo(); // call logic
    res.status(200).json(result);
  } catch (error) {
    let messageError = {
      statusCode: error.statusCode || 400,
      message: error.message || error,
    };
    res.status(messageError.statusCode);
    res.json(messageError);
  }
});

module.exports = app;
