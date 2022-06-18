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
    

    if(data.dept_name != "")
        sql += mysql.format(" and course.dept_name like ? ", `%${data.dept_name}%`)

    if(data.course_name != ""){

        console.log(data)
        sql += mysql.format(" and course.title like ? ", `%${data.course_name}%`)
    }
    
    if(data.teacher_name != "")
        sql += mysql.format(" and a.teacher_names like ? ", `%${data.course_name}`)
    
    if(data.year != "")
        sql += mysql.format(" and section.year = ? ", data.year)

    if(data.semester != "")
        sql += mysql.format(" and section.semester = ? ", data.semester)

    console.log(sql)
    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = search_student_section_list_takable

