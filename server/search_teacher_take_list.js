var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

async function search_teacher_take_list(req, res) {
	var token = req.headers.token
    var raw_data = tool.token_list[token]
    if (!raw_data) {
    	res.send({
            "message": "token 错误",
            "code": 400
        })
        return
    }
    if (raw_data.role != 'teacher') {
    	res.send({
			"message": "您并非教师",
            "code": 400
    	})
    }

    var data = req.body 
    var sql = mysql.format("select * from section join teaches on teaches.sec_id = section.sec_id join time_slot on time_slot.time_slot_id = section.time_slot_id where teaches.IID = ? and section.status in (1,2,3) ", raw_data.id)
    var result = await query(sql)
    res.send({
        "message": "", 
        "code": 200,
        "data": result
    })
}
module.exports = search_teacher_take_list

