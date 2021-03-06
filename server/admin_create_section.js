var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function admin_create_section(req, res) {
	var token = req.headers.token
    var raw_data = tool.token_list[token]
    if (!raw_data) {
    	res.send({
            "message": "token 错误",
            "code": 400
        })
        return
    }
    if (raw_data.role != 'admin') {
    	res.send({
			"message": "您并非管理员",
            "code": 400
    	})
        return 
    }
    
    // time_slot_id, 
    // begin_week, end_week, monday, tuesday, wednesday, thursday, friday, saturday, sunday
    
    // course_id, sec_id, semester, year, building, room_number, status, time_slot_id

    var data = req.body
    var time_slot = data.time_slot
    var sql = mysql.format("insert into time_slot(begin_week, end_week, monday, tuesday, wednesday, thursday, friday, saturday, sunday) values(?,?,?,?,?,?,?,?,?) ", 
        [time_slot.begin_week, time_slot.end_week, time_slot.monday, time_slot.tuesday, time_slot.wednesday, time_slot.thursday, time_slot.friday, time_slot.saturday, time_slot.sunday])
    var result = await query(sql)
    var time_slot_id = result.insertId
    // console.log(result)
    sql = mysql.format("insert into section(course_id, sec_id, semester, year, building, room_number, status, time_slot_id) values(?,?,?,?,?,?,?,?) ",
        [data.course_id, data.sec_id, data.semester, data.year, data.building, data.room_number, data.status, time_slot_id])
    result = await query(sql)
   	
    res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = admin_create_section