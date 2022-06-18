var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function search_student_take_score_list(req, res) {
	var token = req.headers.token
    var raw_data = tool.token_list[token]
    if (!raw_data) {
    	res.send({
            "message": "token 错误",
            "code": 400
        })
        return
    }
    if (raw_data.role != 'student') {
    	res.send({
			"message": "您并非学生",
            "code": 400
    	})
    }
    
}
module.exports = search_student_take_score_list

