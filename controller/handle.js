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
    async addFormatAccountId (account_id){ //add (-) to account_id จัด format ของเลขบัญชี
        var setNumA1 = account_id.substring(0,4);
        var setNumA2 = account_id.substring(4,6);
        var setNumA3 = account_id.substring(6,8);
        var setNumA4 = account_id.substring(8,13);
        return `${setNumA1}-${setNumA2}-${setNumA3}-${setNumA4}`
    }
    async deposit(req) {
        let functionName = '[deposit]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var Request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = req.money;
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                if(money < 100) reject `Please put your money over 100 BAHT`
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 BAHT`
                else {
                    var accountId = await new request().addFormatAccountId(account_id);//จัด format ของเลขบัญชี
                    // var commandCheckBalance = `SELECT balance
                    // FROM Banking
                    // WHERE account_id = '${accountId}' AND pin = '${pin}';`// sql command
                    // var resultCheckBalance = await Request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                    // logger.debug(`Balance = ${resultCheckBalance.recordset[0].balance}`)
                    // var balance = resultCheckBalance.recordset[0].balance + money;
                    // logger.debug(`RecentBalance = ${balance}`)
                    var commandUpdateBlance= `UPDATE Banking
                    SET balance += ${money}
                    WHERE account_id = '${accountId}' AND pin = '${pin}'`// sql command
                    var resultUpdate = await Request.query(commandUpdateBlance); //ยิง command เข้าไปใน DB
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
                var Request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = req.money;
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 BAHT`
                else {
                    var accountId = await new request().addFormatAccountId(account_id); //จัด format ของเลขบัญชี
                    var commandCheckBalance = `SELECT balance
                    FROM Banking
                    WHERE account_id = '${accountId}' AND pin = '${pin}';`// sql command
                    var resultCheckBalance = await Request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                    logger.debug(`Balance = ${resultCheckBalance.recordset[0].balance}`)
                    if(money > resultCheckBalance.recordset[0].balance) reject `Cannot withdraw over your balance`
                    if(money > 20000) reject `Cannot withdraw over 20,000 BAHT`
                    var balance = resultCheckBalance.recordset[0].balance - money;
                    logger.debug(`RecentBalance = ${balance}`)
                    var commandUpdateBlance= `UPDATE Banking
                    SET balance = ${balance}
                    WHERE account_id = '${accountId}' AND pin = '${pin}'`
                    var resultUpdate = await Request.query(commandUpdateBlance); //ยิง command เข้าไปใน DB
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
                var Request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var receive_account = req.receive_account || reject `${functionName} receive_account is required`;
                var money = req.money;
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                var accountId = await new request().addFormatAccountId(account_id); //จัด format ของเลขบัญชี
                var receiverAccountId = await new request().addFormatAccountId(receive_account); //จัด format ของเลขบัญชี
                var commandCheckBalanceP1 = `SELECT balance
                FROM Banking
                WHERE account_id = '${accountId}' AND pin = '${pin}';`// sql command
                var resultCheckBalanceP1 = await Request.query(commandCheckBalanceP1); //ยิง command เข้าไปใน DB
                logger.debug(`BalanceP1 = ${resultCheckBalanceP1.recordset[0].balance}`)
                if(money > 1000000) reject `Cannot transfer over 1,000,000 BAHT`
                if(money > resultCheckBalanceP1.recordset[0].balance)reject `Cannot transfer over your balance`
                var balanceP1 = resultCheckBalanceP1.recordset[0].balance - money;
                logger.debug(`RecentBalanceP1 = ${balanceP1}`)
                var commandUpdateBlanceP1 = `UPDATE Banking
                SET balance = ${balanceP1}
                WHERE account_id = '${accountId}' AND pin = '${pin}'`// sql command
                var resultUpdate = await Request.query(commandUpdateBlanceP1); //ยิง command เข้าไปใน DB
                // var commandCheckBalanceP2 = `SELECT balance
                // FROM Banking
                // WHERE account_id = '${receiverAccountId}';`
                // var resultCheckBalanceP2 = await Request.query(commandCheckBalanceP2); //ยิง command เข้าไปใน DB
                // logger.debug(`BalanceP2 = ${resultCheckBalanceP2.recordset[0].balance}`);
                // var balanceP2 = resultCheckBalanceP2.recordset[0].balance + money;
                // logger.debug(`RecentBalanceP2 = ${balanceP2}`);
                var commandUpdateBlanceP2 = `UPDATE Banking
                SET balance += ${money}
                WHERE account_id = '${receiverAccountId}'`// sql command
                var resultUpdate = await Request.query(commandUpdateBlanceP2); //ยิง command เข้าไปใน DB
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
                var Request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                var accountId = await new request().addFormatAccountId(account_id);// จัด format ของเลขบัญชี
                var commandCheckBalance = `SELECT balance
                FROM Banking
                WHERE account_id = '${accountId}' AND pin = '${pin}';`// sql command
                var resultCheckBalance = await Request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
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


