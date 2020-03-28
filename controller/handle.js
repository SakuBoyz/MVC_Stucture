const logger = require('../util/logger.js');
const moment = require('moment');
const fs = require('fs');
const sql = require('mssql')

// config for your database
const config = {
    user: 'sa',
    password: 'P@d0rU123',
    server: '167.71.200.91',
    database: 'ohmDB'
};

// connect to your database
var err = sql.connect(config)
if (err) console.log(err);

class services {
    async services (){return}
    async ShowPatientsData(req) {
        let functionName = '[ShowPatientsData]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return await new Promise(async function (resolve, reject) {
            try {
                var CovidData = await new services().getCovidData();
                var TotalPatient = await new services().getTotalPatient();
                var TopThreeHospital = await new services().getTopThreeHospital();
                var message = {
                    statusCode: 200,
                    PatientCovidData: CovidData,
                    TotalCovidPatient: TotalPatient,
                    TopThreeHospital: TopThreeHospital
                }
                logger.info(message);
                resolve(message);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async getCovidData() {// reuse method
        let functionName = '[getCovidData]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var commandCheckCovid = `SELECT p.HNID, Firstname, Lastname
                FROM ohmDB.dbo.PATIENTS p LEFT JOIN ohmDB.dbo.PATIENT_COVID_STATUS pcs 
                ON p.HNID = pcs.HNID
                WHERE pcs.COVID_19_Status  = 'Positive';`// sql command
                var resultCovid = await request.query(commandCheckCovid); //ยิง command เข้าไปใน DB
                var covidData = resultCovid.recordset;
                logger.debug(`covidData = ${JSON.stringify(covidData)}`);
                resolve(covidData);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} GET failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async getTotalPatient() {
        let functionName = '[getTotalPatient]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var commandGetTotal = `SELECT h.Title, COUNT(pcs.HNID) AS Total
                FROM ohmDB.dbo.PATIENTS p LEFT JOIN ohmDB.dbo.HOSPITALS h ON p.HID = h.HID LEFT JOIN ohmDB.dbo.PATIENT_COVID_STATUS pcs ON pcs.HNID = p.HNID 
                WHERE pcs.COVID_19_Status = 'Positive'
                GROUP BY h.Title `// sql command
                var resultTotal = await request.query(commandGetTotal); //ยิง command เข้าไปใน DB
                var Total = resultTotal.recordset
                resolve(Total);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async getTopThreeHospital() {
        let functionName = '[getTopThreeHospital]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var commandGetTop3 = `SELECT top(3)h.Title, COUNT(pcs.HNID) AS Total
                FROM ohmDB.dbo.PATIENTS p LEFT JOIN ohmDB.dbo.HOSPITALS h ON p.HID = h.HID
                LEFT JOIN ohmDB.dbo.PATIENT_COVID_STATUS pcs ON pcs.HNID = p.HNID
                WHERE pcs.COVID_19_Status = 'Positive'
                GROUP BY h.Title
                ORDER BY Total DESC`// sql command
                var resultTop3 = await request.query(commandGetTop3); //ยิง command เข้าไปใน DB
                var Top3 = resultTop3.recordset
                console.log(Top3)
                resolve(Top3);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
}
module.exports = services