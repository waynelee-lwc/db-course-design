var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

async function search_teacher_take_score_list(req, res) {
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

    var data = req.query 
    var sql = mysql.format("select * from takes join section on section.sec_id = takes.sec_id join student on student.SID = takes.SID where section.sec_id = ? ", data.sec_id)
    // console.log(sql)
    var result = await query(sql)
    res.send({
        "message": "", 
        "code": 200,
        "data": result
    })
}
module.exports = search_teacher_take_score_list

