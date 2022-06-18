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
    var data = req.query
    var sql = "select * from section join course on section.course_id = course.course_id join (select sec_id, group_concat(instructor.name) as teacher_names from teaches join instructor on teaches.IID = instructor.IID group by teaches.sec_id) as a on section.sec_id = a.sec_id where section.status = 2 "

    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = search_student_section_list_takable

