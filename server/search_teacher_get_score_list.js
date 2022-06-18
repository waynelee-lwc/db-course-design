var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

async function search_teacher_get_score_list(req, res) {
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
    
    var sql = mysql.format("select * from section join course on course.course_id = section.course_id left join (select IID , sec_id as teaches_sec_id from teaches) as b on section.sec_id = b.teaches_sec_id and b.IID = ? where section.status in (4,5) ", raw_data.id)    
    console.log(sql)
    var result = await query(sql)
    res.send({
        "message": "", 
        "code": 200,
        "data": result
    })
}
module.exports = search_teacher_get_score_list

