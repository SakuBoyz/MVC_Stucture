var DB = require("../models/STUDENTS.json");//import model
const fs = require("fs");// for writing file => save data
const student = DB;

class logic {
  CheckIn(sid, temp) {
    console.log(sid);
    console.log(temp);
    var FunctionName = "[CheckIn]";
    let msg; // object for respond
    let data; //data for insert to DB
    let date = new Date();
    let tempType; // for filter temperature type
    try {
      if (temp > 37.5) {
        // check High Temperature
        tempType = "High";
      } else if (temp < 35) {
        // check Low Temperature
        tempType = "Low";
      } else {
        //Data for Normal Temperature keep float
        tempType = temp;
      }
      data = {
        //Data for High or Low Temperature
        date: date,
        sid: sid,
        temp: tempType,
      };
      //push to temp data
      student.push(data);

      //Convert Value to JSON
      let result = JSON.stringify(student, null, 2);

      //Write data to JSON file => Save data
      fs.writeFileSync("./models/STUDENTS.json", result, (err) => {
        if (err) {
          console.log(" Write file fail ", err);
        } else {
          console.log(" Write file success");
        }
      });

      msg = {
        StatusCode: 201,
        Data: student,
      };

      return msg;
    } catch (error) {
      let messageError = {
        statusCode: error.statusCode || 400,
        massage: error.massage || `${FunctionName} failed [Error] ${error}`,
      };

      console.log(messageError);
      return messageError;
    }
  }
  GetTempInfo() {
    try {
      //counter for output
      let data = []; //data for student with float temperature
      let AvgTemp = 0; // average temperature
      let count = 0; // amount of student

      for (let i = 0; i < student.length; i++) {//getstudent
        if (student[i].temp != "High" && student[i].temp != "Low") {//get only float temperature
          data.push(student[i]);
          count++;
          AvgTemp += student[i].temp;
        }
      }
      AvgTemp = Math.floor((AvgTemp / count) * 10) / 10;//round down to 1 place decimal temperature
      let Top10TempList = this.GetTop10Temp(data); // find top 10 student's temperature

      let msg = {//message for respond
        StatusCode: 200,
        AvgTemp: AvgTemp,
        Top10TempList: Top10TempList,
      };
      return msg;
    } catch (error) {
      let messageError = {
        statusCode: error.statusCode || 400,
        massage: error.massage || `${FunctionName} failed [Error] ${error}`,
      };

      console.log(messageError);
      return messageError;
    }
  }
  GetTop10Temp(data) {
    data.sort((a, b) => {
      a = a.temp;
      b = b.temp;
      return b - a;
    });
    return data.slice(0, 10);
  }
}
module.exports = logic;
