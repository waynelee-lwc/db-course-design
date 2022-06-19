var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function admin_create_course(req, res) {
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
    var data = req.body
    var sql = mysql.format("insert into course(course_id, title, dept_name, credits, course_type) values (?,?,?,?,?)",[data.course_id, data.title, data.dept_name, data.credits, data.course_type])
    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200
   	})
   	return 
}
module.exports = admin_create_course