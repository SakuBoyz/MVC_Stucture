const logger = require('../util/logger.js');
const sql = require("mssql");
const moment = require('moment');
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

class request {
    async deposit(req) {
        let functionName = '[deposit]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = req.money
                if(money < 100) reject `Please put your money over 100 Baht`
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 Baht`
                else {
                    // sql command
                    var commandCheckBalance = `SELECT balance
                    FROM Banking
                    WHERE account_id = '${account_id}' AND pin = '${pin}';`
                    var resultCheckBalance = await request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                    logger.debug(`Balance = ${resultCheckBalance.recordset[0].balance}`)
                    var balance = resultCheckBalance.recordset[0].balance + money;
                    logger.debug(`RecentBalance = ${balance}`)
                    var commandUpdateBlance= `UPDATE Banking
                    SET balance = ${balance}
                    WHERE account_id = '${account_id}' AND pin = '${pin}'`
                    var resultUpdate = await request.query(commandUpdateBlance); //ยิง command เข้าไปใน DB
                    let massage = {
                        statusCode: 200,
                        status: `Transaction has been submitted`
                    }
                    logger.info(massage.status);
                    resolve(massage);
                }
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async withdraw(req) {
        let functionName = '[withdraw]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = req.money;// sql command
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 Baht`
                else {
                    var commandCheckBalance = `SELECT balance
                    FROM Banking
                    WHERE account_id = '${account_id}' AND pin = '${pin}';`
                    var resultCheckBalance = await request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                    logger.debug(`Balance = ${resultCheckBalance.recordset[0].balance}`)
                    if(money > resultCheckBalance.recordset[0].balance && money > 20000) reject `Cannot withdraw over this balance`
                    var balance = resultCheckBalance.recordset[0].balance - money;
                    logger.debug(`RecentBalance = ${balance}`)
                    var commandUpdateBlance= `UPDATE Banking
                    SET balance = ${balance}
                    WHERE account_id = '${account_id}' AND pin = '${pin}'`
                    var resultUpdate = await request.query(commandUpdateBlance); //ยิง command เข้าไปใน DB
                    let massage = {
                        statusCode: 200,
                        status: `Transaction has been submitted`
                    }
                    logger.info(massage.status);
                    resolve(massage);
                }
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async transfer(req) {
        let functionName = '[transfer]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var receive_account = req.receive_account || reject `${functionName} receive_account is required`;
                var money = req.money;// sql command
                var commandCheckBalanceP1 = `SELECT balance
                FROM Banking
                WHERE account_id = '${account_id}' AND pin = '${pin}';`
                var resultCheckBalanceP1 = await request.query(commandCheckBalanceP1); //ยิง command เข้าไปใน DB
                logger.debug(`BalanceP1 = ${resultCheckBalanceP1.recordset[0].balance}`)
                if(money > 1000000 && money > resultCheckBalanceP1.recordset[0].balance) reject `Cannot trasfer over this balance`
                var balanceP1 = resultCheckBalanceP1.recordset[0].balance - money;
                logger.debug(`RecentBalanceP1 = ${balanceP1}`)
                var commandUpdateBlanceP1 = `UPDATE Banking
                SET balance = ${balanceP1}
                WHERE account_id = '${account_id}' AND pin = '${pin}'`
                var resultUpdate = await request.query(commandUpdateBlanceP1); //ยิง command เข้าไปใน DB
                var commandCheckBalanceP2 = `SELECT balance
                FROM Banking
                WHERE account_id = '${receive_account}';`
                var resultCheckBalanceP2 = await request.query(commandCheckBalanceP2); //ยิง command เข้าไปใน DB
                logger.debug(`BalanceP2 = ${resultCheckBalanceP2.recordset[0].balance}`);
                var balanceP2 = resultCheckBalanceP2.recordset[0].balance + money;
                logger.debug(`RecentBalanceP2 = ${balanceP2}`);
                var commandUpdateBlanceP2 = `UPDATE Banking
                SET balance = ${balanceP2}
                WHERE account_id = '${receive_account}'`
                var resultUpdate = await request.query(commandUpdateBlanceP2); //ยิง command เข้าไปใน DB
                let massage = {
                    statusCode: 200,
                    status: `Transaction has been submitted`
                }
                logger.info(massage.status);
                resolve(massage);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async checkBalance(req) {
        let functionName = '[checkBalance]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var commandCheckBalance = `SELECT balance
                FROM Banking
                WHERE account_id = '${account_id}' AND pin = '${pin}';`
                var resultCheckBalance = await request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                logger.debug(`Balance = ${resultCheckBalance.recordset[0].balance}`)
                let massage = {
                    statusCode: 200,
                    status: `Balance = ${resultCheckBalance.recordset[0].balance}`
                }
                logger.info(massage.status);
                resolve(massage);
            } catch (error) { //ดัก error
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
}
module.exports = request


