var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function teacher_take_untake(req, res) {
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
    var sql = mysql.format("select count(*) as count from section where section.sec_id = ? and status = 1", data.sec_id)
    var result = await query(sql)
    if(result.length == 0 || result[0].count == 0) {
    	res.send({
    		"message": "不存在开放选课的section",
    		"code": 400
    	})
    	return 
    }

    sql = mysql.format("select count(*) as count from section join teaches on teaches.sec_id = section.sec_id where section.sec_id = ? and teaches.IID = ? and section.status = 1 ", [data.sec_id, raw_data.id])
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
    	sql = mysql.format("insert into teaches(IID, sec_id) VALUES (?,?)", [raw_data.id, data.sec_id])
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
    	sql = mysql.format("delete from teaches where teaches.IID = ? and teaches.sec_id = ?", [raw_data.id, data.sec_id])
		result = await query(sql)
    	res.send({
    		"message": "",
    		"code": 200
    	})
    	return 
    }
   	return 
}
module.exports = teacher_take_untake

