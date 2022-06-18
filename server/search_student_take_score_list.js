var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')

function calc_first_grade(grades) {
    if (grades == undefined) {
        return null
    }
    grades = grades.split(',')
    if (grades.length == 0) {
        return null
    }

    function calc(l_year, l_set, r_year, r_set) {
        // console.log(parseInt(l_year), l_set, parseInt(r_year), r_set)
        if(parseInt(l_year) == parseInt(r_year)) {
            return l_set > r_set
        } 
        else return parseInt(l_year) < parseInt(r_year)
    }

    var j = 0;
    for (var i=1; i<grades.length; i++) {
        var tmp = grades[i].split('-')
        var nmp = grades[j].split('-')
        if(calc(tmp[0], tmp[1], nmp[0], nmp[1])) 
            j = i
    }
    return grades[j].split('-')[2]
}

async function search_student_take_score_list(req, res) {
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

    var sql = mysql.format("select * from course_history join course on course.course_id = course_history.course_id where course_history.SID = ? ", raw_data.id)
    var result = await query(sql)
    // console.log(result)
    for (let i=0; i<result.length; i++) {
        result[i].first_grade = calc_first_grade(result[i].grades)
    }
    res.send({
        "message": "", 
        "code": 200,
        "data": result
    })
}
module.exports = search_student_take_score_list

