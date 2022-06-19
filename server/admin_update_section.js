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

    // status

    var data = req.body
    var sql = mysql.format("update section set status = ? where section.sec_id = ? ", [data.status, data.sec_id])
    var result = await query(sql)
   	res.send({
   		"message":"",
   		"code":200
   	})
   	return 
}
module.exports = admin_update_section