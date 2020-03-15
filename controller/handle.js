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
    async createStudent(req) {
        let functionName = '[createStudent]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var FName = req.FName;
                var LName = req.LName;
                var faculty_id = req.faculty_id;
                var gender = req.gender;
                var grade = req.grade;
                var student_status = req.student_status;
                var create_by = req.create_by;
                var currentDate = moment().format();
                logger.debug(currentDate);
                var update_by = req.update_by;
                var work_status = req.work_status;
                // sql command
                var commandCreate = `INSERT INTO STUDENT_PROFILE
                (FName, LName, faculty_id, gender, admission_date, grade, student_status, create_by, create_date, update_by, update_date, work_status)
                VALUES('${FName}', '${LName}', '${faculty_id}', '${gender}', '${currentDate}', '${grade}', '${student_status}', 
                '${create_by}', '${currentDate}', '${update_by}', '${currentDate}', '${work_status}');`
                var resultCreate = await request.query(commandCreate); //ยิง command เข้าไปใน DB
                let massage = {
                    statusCode: 201,
                    status: `create success`
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
    async getStudent(req) {
        let functionName = '[getStudent]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var id = req.id || reject`${functionName} id is required`
                var checkId = await isNaN(id) //เช็ค type id ว่าส่งมาเป็น int ไหม
                if (checkId == true) {
                    logger.error(`${functionName} Please use Integer(Type of Number)`);
                    resolve`${functionName} Please use Integer(Type of Number)`
                } else {
                    var command = `SELECT * FROM STUDENT_PROFILE WHERE id = ${id}`// sql command
                    var result = await request.query(command); //ยิง command เข้าไปใน DB
                    let message = {
                        statusCode: 200,
                        message: result.recordset
                    }
                    if (result.recordset.length != 0) resolve(message)//เช็คหา id
                    else {
                        let messageError1 = {
                            statusCode: 400,
                            message: `${functionName} id not found`
                        }
                        logger.error(messageError1.message)
                        reject(messageError1)
                    }
                }
            } catch (error) { //ดัก error
                let messageError2 = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} query failed [Error] ${error}`
                }
                logger.error(messageError2.message)
                reject(messageError2)
            }
        })
    }
    async updateGrade(req) {
        let functionName = '[updateGrade]' //ชื่อ function
        return new Promise(async function (resolve, reject) {
            try {
                var request = new sql.Request();
                var current_date = moment().format()
                var id = req.id || reject`${functionName} id is required`
                var grade = req.grade || reject`${functionName} grade is required`
                var update_by = req.update_by || reject`${functionName} update_by is required`
                var checkId = await isNaN(id) //เช็ค type id ว่าส่งมาเป็น int ไหม
                if (checkId == true) {
                    logger.error(`${functionName} Please use Integer(Type of Number)`);
                    resolve`${functionName} Please use Integer(Type of Number)`
                } else {
                    var commandCheckId = `SELECT * FROM STUDENT_PROFILE WHERE id = ${id}`
                    var resultCheckId = await request.query(commandCheckId); //ยิง command เข้าไปใน DB
                    if (resultCheckId.recordset.length != 0) {
                        var command = `UPDATE STUDENT_PROFILE SET 
                        grade = ${grade}, 
                        update_by = '${update_by}',
                        update_date = '${current_date}'
                        WHERE id = ${id}`// sql command
                        var result = await request.query(command); //ยิง command เข้าไปใน DB
                        let message = {
                            statusCode: 200,
                            message: `update success`
                        }
                        resolve(message);
                    }
                    else {
                        let messageError1 = {
                            statusCode: 400,
                            message: `${functionName} id not found`
                        }
                        logger.error(messageError1.message)
                        reject(messageError1)
                    }
                }
            } catch (error) { //ดัก error
                let messageError2 = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} query failed [Error] ${error}`
                }
                logger.error(messageError2.message)
                reject(messageError2)
            }
        })
    }
}
module.exports = request


