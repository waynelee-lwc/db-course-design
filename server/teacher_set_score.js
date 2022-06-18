var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

async function teacher_set_score(req, res) {
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
    var sql = mysql.format('update takes set takes.grade = ? where takes.SID = ? and takes.sec_id = ?', [data.grade, data.SID, data.sec_id])
    var result = await query(sql)
    res.send({
        "message": "", 
        "code": 200
    })
}
module.exports = teacher_set_score

