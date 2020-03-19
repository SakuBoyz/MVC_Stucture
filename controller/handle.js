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
    async deposit(req) {//ฝากเงิน
        let functionName = '[deposit]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = parseInt(req.money);
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                if(money < 100) reject `Please put your money over 100 BAHT`
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 BAHT`
                else {
                    var accountId = await new request().addFormatAccountId(account_id);//จัด format ของเลขบัญชี
                    var balance = await new msSql().getBalanceById(accountId, pin) + money;//GET ยอดเงินคงเหลือมา + กับเงินฝาก
                    logger.debug(`recentBalance = ${balance}`)
                    await new msSql().updateBalance(accountId, balance);//UPDATE ยอดเงินคงเหลือ
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
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async withdraw(req) {//ถอนเงิน
        let functionName = '[withdraw]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var money = parseInt(req.money);
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                if(money%100 != 0) reject `Please put your money without fraction => 1000, 500, 100 BAHT`
                else {
                    var accountId = await new request().addFormatAccountId(account_id); //จัด format ของเลขบัญชี
                    var balance = await new msSql().getBalanceById(accountId, pin) - money;//GET ยอดเงินคงเหลือมา - กับเงินฝาก
                    logger.debug(`recentBalance = ${balance}`)
                    await new msSql().updateBalance(accountId, balance);//UPDATE ยอดเงินคงเหลือ
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
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async transfer(req) {//โอนเงิน
        let functionName = '[transfer]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var Request = new sql.Request();
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                var receive_account = req.receive_account || reject `${functionName} receive_account is required`;
                var money = parseInt(req.money);
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                var accountId = await new request().addFormatAccountId(account_id); //จัด format ของเลขบัญชีผู้โอน
                var receiverAccountId = await new request().addFormatAccountId(receive_account); //จัด format ของเลขบัญชีผู้รับโอน
                var balance = await new msSql().getBalanceById(accountId, pin);//GET ยอดเงินคงเหลือ
                if(money > 1000000) reject `Cannot transfer over 1,000,000 BAHT`
                if(money > balance) reject `Cannot transfer over your balance`
                var recentBalanceP1 = balance - money;
                logger.debug(`recentBalanceP1 = ${recentBalanceP1}`)
                await new msSql().updateBalance(accountId, recentBalanceP1);//UPDATE ยอดเงินคงเหลือผู้โอน
                var commandUpdateBlanceP2 = `UPDATE Banking 
                SET balance += ${money}
                WHERE account_id = '${receiverAccountId}'`// sql command update ยอดเงินผู้รับโอน
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
                    message: error.message || `${functionName} UPDATE failed [Error] ${error}`
                }
                logger.error(messageError.message);
                reject(messageError);
            }
        })
    }
    async checkBalance(req) {//เช็คยอดเงิน
        let functionName = '[checkBalance]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var account_id = req.account_id || reject `${functionName} account_id is required`;
                var pin = req.pin || reject `${functionName} pin is required`;
                if(account_id.length != 13) reject `Please enter your account_id for 13 digits`
                var accountId = await new request().addFormatAccountId(account_id);// จัด format ของเลขบัญชี
                var balance = await new msSql().getBalanceById(accountId, pin) //Reuse method GET ยอดเงินคงเหลือ
                let massage = {
                    statusCode: 200,
                    status: `Balance = ${balance}`
                }
                logger.info(massage.status);
                resolve(massage);
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
}
class msSql {
    async getBalanceById(account_id, pin) {// reuse method
        let functionName = '[checkBalance]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var commandCheckBalance = `SELECT balance
                FROM Banking
                WHERE account_id = '${account_id}' AND pin = '${pin}';`// sql command
                var resultCheckBalance = await request.query(commandCheckBalance); //ยิง command เข้าไปใน DB
                var balance = resultCheckBalance.recordset[0].balance;
                logger.debug(`Balance = ${balance}`);
                resolve(balance);
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
    async updateBalance(account_id, balance) {
        let functionName = '[updateBalance]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var commandUpdateBlance = `UPDATE Banking
                SET balance = ${balance}
                WHERE account_id = '${account_id}'`// sql command
                var resultUpdate = await request.query(commandUpdateBlance); //ยิง command เข้าไปใน DB
                resolve();
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
module.exports = request