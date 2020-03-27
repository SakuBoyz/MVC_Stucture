const logger = require('../util/logger.js');
const moment = require('moment');
const fs = require('fs');
const user = require('../model/user.json');

class request {
    async login(req) {//ฝากเงิน
        let functionName = '[login]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var id = req.id || reject `${functionName} id is required`;
                var pass = req.pass || reject `${functionName} pass is required`;
                var getUser = await user.find(user => user.id === id, user.pass === pass);
                if(getUser == null) reject `User does not exist`
                if (id != getUser.id || pass != getUser.pass) reject `id or password are not correct`
                var findIndex = user.findIndex(user => user.id === id, user.pass === pass);
                if(user[findIndex].checkIn == true) reject `user check in already!!!`
                var updateStatus = user[findIndex].checkIn = true;
                var jsonString = JSON.stringify(user);
                fs.writeFile('/mnt/c/Users/jirap/Desktop/MVC_Stucture/model/user.json', jsonString, err =>{
                    if (err) {
                        logger.info('Error writing file', err)
                    } else {
                        logger.info('Successfully wrote file')
                    }
                })
                var message = {
                    statusCode: 200,
                    message: `Check in complete!!!`,     
                }
                logger.info(message.status);
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
    async getTotal() {//ฝากเงิน
        let functionName = '[getTotal]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var count = 0;
                for (let i = 0; i < user.length; i++) {
                    if(user[i].checkIn == true)  count++;
                }
                var message = {
                    statusCode: 200,
                    Total: `${count}`
                }
                logger.info(message.Total);
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
}
module.exports = request