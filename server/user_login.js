var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function user_login(req,res){
    var data = req.body
    console.log(data)
    var table = "", sql = ""
    if(data.role == "student") {
    	sql = mysql.format('select * from student where SID = ?', data.id)
    	table = "student"
    } 
    else {
    	res.end("error role")
    }
    var result = await query(sql)
    var resp = {
    	"message": "",
    	"code": 200	
    }
    console.log(result)
    if(result.length == 0) {
    	res.send({
			"message": "用户不存在",
    		"code": 400	
    	})
    	res.end()
    }
    result = result[0]
    if(result.passward != data.passward) {
        res.send({
			"message": "密码错误",
    		"code": 400	
    	})
    	res.end()	
    }

    let token = random_string(16)
    // console.log(token)
    tool.token_list[token] = {
    	"role": data.role,
    	"id": data.id
    }
    res.send({
    	"message": null,
    	"code": 200,
    	"data": {
    		"token": token,
    		"user": result, 
    	}
    })
   	res.end()
}
module.exports = user_login