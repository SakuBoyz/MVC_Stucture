const logger = require('../util/logger.js');
const moment = require('moment');
const fs = require('fs');
const user = require('../model/user.json');

class request {
    async login(req) {
        let functionName = '[login]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return await new Promise(async function (resolve, reject) {
            try {
                var id = req.id || reject `${functionName} id is required`;
                var password = req.password || reject `${functionName} password is required`;
                var getUser = await user.find(user => user.id === id, user.password === password);//เช็ค id กับ password ของ User ในระบบถ้ามีก็ดึงออกมา
                if(getUser.id == null) {//id ไม่ตรง
                    reject `User does not exist`
                    return
                }
                if(getUser.password == null) {//password ไม่ตรง
                    reject `Please enter the correct information`
                    return
                } 
                var findIndex = user.findIndex(user => user.id === id, user.password === password);//หาตำเเหน่งของข้อมูล User
                if(user[findIndex].checkIn == true) {//ดัก User ที่เคยลงชื่อเเล้ว
                    reject `user already check in !!!`
                    return
                }
                user[findIndex].checkIn = true; // เช็คชื่อว่าเข้าร่วมงานเเล้ว
                var jsonString = JSON.stringify(user); //parse value to JSON String
                fs.writeFile('./model/user.json', jsonString, err =>{// UPDATE JSON to file(overwrite files)
                    if (err) logger.error('Error writing file', err)
                    else logger.info('Successfully wrote file')
                })
                var message = {
                    statusCode: 200,
                    message: `Check in complete!!!`,
                }
                logger.info(message.message);
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
    async getTotal() {
        let functionName = '[getTotal]' //ชื่อ function
        logger.info(`Function${functionName}`)
        return new Promise(async function (resolve, reject) {
            try {
                var count = 0;
                for (let i = 0; i < user.length; i++) {//loop check status การเข้าร่วม
                    if(user[i].checkIn == true)  count++;//ถ้า true เพิ่มจำนวนคน 1 คน
                }
                var message = {
                    statusCode: 200,
                    Total: `${count}`
                }
                logger.info(`Total = ${message.Total}`);
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