var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function search_student_section_list_takable(req, res) {
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

    var data = req.body
    var sql = mysql.format("select count(*) as count from section where section.sec_id = ? ", data.sec_id)
    var result = await query(sql)
    if(result.length == 0 || result[0].count == 0) {
    	res.send({
    		"message": "section 不存在",
    		"code": 400
    	})
    	return 
    }

    // sql = mysql.format("select count(*) as count from section join takes ")
   	res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = search_student_section_list_takable

