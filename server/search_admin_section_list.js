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
    if (raw_data.role != 'admin') {
    	res.send({
			"message": "您并非管理员",
            "code": 400
    	})
        return 
    }
    var data = req.query
    var sql = ("select * from section join course on course.course_id = section.course_id where 1=1 ")
    
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

    if(data.sec_status != "")
        sql += mysql.format(" and section.sec_status = ? ", data.sec_status)

    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200,
   		"data": result
   	})
   	return 
}
module.exports = search_get_time_slog_list_by_teacher