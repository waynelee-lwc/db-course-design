var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function admin_update_section(req, res) {
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
    var sql = ("select * from course where 1=1 ")
    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200
   	})
   	return 
}
module.exports = admin_update_section