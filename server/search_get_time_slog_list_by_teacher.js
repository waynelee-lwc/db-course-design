var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function search_get_time_slog_list_by_teacher(req, res) {
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
        return 
    }
    var sql = mysql.format("select * from teaches join section on teaches.sec_id = section.sec_id join time_slot on section.time_slot_id = time_slot.time_slot_id where teaches.IID = ? and section.status = ?", [raw_data.id, 1])
    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = search_get_time_slog_list_by_teacher