const logger = require('../util/logger.js');
const st_id = require('../model/db.json')
const fs = require('fs')

class request {
    async login(req) {
        try {
            var id = req.id
            var password = req.password
            var findst = st_id.find(st_id => st_id.id === id, st_id.password === password)
            if (findst == null) return "รหัสนักศึกษาดังกล่าวไม่มีอยู่ในระบบ"
            if (id != findst.id || password != findst.password) return "กรุณาใส่ข้อมูลที่ถูกต้อง"
            var position = st_id.findIndex(st_id => st_id.id === id, st_id.password === password)
            if (st_id[position].checkin == true) return "รหัสนักษานี้เช็คชื่อไปแล้ว"
            st_id[position].checkin = true
            const jsonString = JSON.stringify(st_id)
            fs.writeFile('./model/db.json', jsonString, err => {
                if (err) {
                    console.log('การเขียนไฟล์ไม่สำเร็จ', err)
                } else {
                    console.log('การเขียนไฟล์สำเร็จ')
                }
            })
            return "เข้าสู้ระบบสำเร็จ"
        } catch (err) {
            return "{error} " + err
        }

    }

    async count(req) {
        try {
            var count = 0
            for (let i = 0; i < st_id.length; i++) {
                if (st_id[i].checkin == true)
                    count++
            }
            return "จำนวนคนเข้าร่วมทั้งหมดคือ " + count + " คน"
        } catch (err) {
            return "{error} " + err
        }

    }

}
module.exports = request