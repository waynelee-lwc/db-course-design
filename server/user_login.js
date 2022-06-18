var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function user_login(req,res){
    var data = req.body
    var role_info = tool.get_role_info(data.role)
    var table = role_info[0], table_id = role_info[1]
    if (table == null) {
    	res.send({
            "message": "角色不存在",
            "code": 400
        })
        res.end()
        return
    }

    var sql = mysql.format('select * from ' +  table + ' where ' + table_id + ' = ?',data.id)
    var result = await query(sql)
    var resp = {
    	"message": "",
    	"code": 200	
    }
    // console.log(result)
    if(result.length == 0) {
    	res.send({
			"message": "用户不存在",
    		"code": 400	
    	})
    	res.end()
        return 
    }
    result = result[0]
    if(result.password != data.password) {
        res.send({
			"message": "密码错误",
    		"code": 400	
    	})
    	res.end()	
        return
    }

    let token = random_string(16)
    // console.log(token)
    tool.token_list[token] = {
    	"role": data.role,
    	"id": data.id
    }
    result.password = ""
    res.send({
    	"message": null,
    	"code": 200,
    	"data": {
    		"token": token,
    		"user": result, 
    	}
    })
   	res.end()
    return 
}
module.exports = user_login