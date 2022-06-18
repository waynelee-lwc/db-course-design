var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function user_update_profile(req,res) {
    var data = req.body
    var token = req.headers.token
    var raw_data = tool.token_list[token]
    if (!raw_data) {
    	res.send({
            "message": "token 错误",
            "code": 400
        })
        return
    }

    var role_info = tool.get_role_info(raw_data.role)
    var table = role_info[0], table_id = role_info[1]
    if (table == null) {
        res.send({
            "message": "角色不存在",
            "code": 400
        })
        return
    }
    var sql = ""
    if (data.password == "")
    	sql = mysql.format('update ' +  table + ' set phone = ?, email = ?  where ' + table_id + ' = ?',
    	[data.phone, data.email, raw_data.id])
	else 
		sql = mysql.format('update ' +  table + ' set phone = ?, email = ?, password = ? where ' + table_id + ' = ?',
    	[data.phone, data.email, data.password, raw_data.id])
	var result = await query(sql)
	sql = mysql.format('select * from ' +  table + ' where ' + table_id + ' = ?',raw_data.id)
    result = await query(sql)
    if(result.length == 0) {
    	res.send({
			"message": "用户不存在",
    		"code": 400	
    	})
        return 
    }
    result = result[0]
    result.password = ""
    res.send({
    	"message": null,
    	"code": 200,
    	"data": {
    		"user": result, 
    	}
    })
    return
}
module.exports = user_update_profile
