var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function search_get_time_slog_by_sec_id(req, res) {
    var data = req.query
    // console.log(data)
    var sql = mysql.format('select time_slot_id from section where sec_id = ?', data.sec_id) 
    var result = await query(sql)
	var resp = {
    	"message": "",
    	"code": 200	
    }
    // console.log(result)
    if(result.length == 0) {
    	res.send({
			"message": "section: " + data.sec_id + " 不存在",
    		"code": 400	
    	})
        return 
    }
    result = result[0]
    var id = result.time_slot_id
    sql = mysql.format("select * from time_slot where time_slot_id = ?", id)
    result = await query(sql)
    // console.log(result)
    if(result.length == 0) {
		res.send({
			"message": "time_slot: " + id + " 不存在",
    		"code": 400	
    	})
    }
    result = result[0]
    res.send({
    	"message": "",
    	"code": "200",
    	"data": {
    		"timeSlot":result
    	}
    })
}
module.exports = search_get_time_slog_by_sec_id