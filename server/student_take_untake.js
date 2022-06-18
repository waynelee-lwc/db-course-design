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
    var sql = mysql.format("select count(*) as count from section where section.sec_id = ? and status = 2", data.sec_id)
    var result = await query(sql)
    if(result.length == 0 || result[0].count == 0) {
    	res.send({
    		"message": "不存在开放选课的section",
    		"code": 400
    	})
    	return 
    }

    sql = mysql.format("select count(*) as count from section join takes on takes.sec_id = section.sec_id where section.sec_id = ? and takes.SID = ? and section.status = 2 ", [data.sec_id, raw_data.id])
   	result = await query(sql)
   	    if(result.length == 0) {
    	res.send({
    		"message": "查询 error",
    		"code": 400
    	})
    	return 
    }

    var count = result[0].count
    if(data.operation == 'take') {
    	if(count > 0) {
    		res.send({
    			"message": "你已经选了该课程",
    			"code": 400
    		})
    		return
    	}
    	sql = mysql.format("insert into takes(SID, sec_id, grade) VALUES (?,?,?)", [raw_data.id, data.sec_id, ""])
    	result = await query(sql)
    	res.send({
    		"message": "",
    		"code": 200
    	})
    	return 
    }
    
    if(data.operation == 'untake') {
    	if(count == 0) {
     		res.send({
    			"message": "你没有选该课程",
    			"code": 400
    		})
    		return   		
    	}
    	sql = mysql.format("delete from takes where takes.SID = ? and takes.sec_id = ?", [raw_data.id, data.sec_id])
		result = await query(sql)
    	res.send({
    		"message": "",
    		"code": 200
    	})
    	return 
    }
   	return 
}
module.exports = search_student_section_list_takable

