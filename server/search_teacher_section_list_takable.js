var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

async function search_teacher_section_list_takable(req, res) {
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
    var sql = mysql.format("select * from section join course on course.course_id = section.course_id left join (select IID , sec_id as teaches_sec_id from teaches) as b on section.sec_id = b.teaches_sec_id and b.IID = ? where section.status = 1 ", raw_data.id)
    // course_name, dept_name, year, semester, sec_id 

    if(data.dept_name != "")
        sql += mysql.format(" and course.dept_name like ? ", `%${data.dept_name}%`)

    if(data.course_name != "")
        sql += mysql.format(" and course.title like ? ", `%${data.course_name}%`)
    
    if(data.year != "")
        sql += mysql.format(" and section.year = ? ", data.year)

    if(data.semester != "")
        sql += mysql.format(" and section.semester = ? ", data.semester)

    if(data.sec_id != "")
        sql += mysql.format(" and section.sec_id = ? ", data.sec_id)
    
    console.log(sql)
    var result = await query(sql)
    res.send({
        "message": "", 
        "code": 200,
        "data": result
    })
}
module.exports = search_teacher_section_list_takable

