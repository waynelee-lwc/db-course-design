var express = require('express')
var bodyParser = require('body-parser')
var multiparty = require('connect-multiparty')
var cors = require('cors')

let app = express()
app.use(cors())
app.use('/',express.static('./static'))

//处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended:true
}));

//处理 application/json
app.use(bodyParser.json())

//处理 mutipart/form-data
app.use(multiparty())

app.get('/hello',(req,res)=>{
    res.end('hello world')
})

// 登录接口
user_login = require('./server/user_login.js')
app.post('/user/login',user_login)

// 登出接口
user_logout = require('./server/user_logout.js')
app.post('/user/logout',user_logout)

// 用户修改信息
user_update_profile = require('./server/user_update_profile.js')
app.post('/user/update_profile', user_update_profile)

// 获取开课学期
search_semester_list = require('./server/search_semester_list.js')
app.get('/search/semester_list', search_semester_list)

// 获取开课计划时间段
search_get_time_slog_by_sec_id = require('./server/search_get_time_slog_by_sec_id.js')
app.get('/search/get_time_slog_by_sec_id', search_get_time_slog_by_sec_id)

// 获取学生已选选课时间段
search_get_time_slog_list_by_student = require('./server/search_get_time_slog_list_by_student.js')
app.get('/search/get_time_slog_list_by_student', search_get_time_slog_list_by_student)

// 获取教师已选选课时间段
search_get_time_slog_list_by_teacher = require('./server/search_get_time_slog_list_by_teacher.js')
app.get('/search/get_time_slog_list_by_teacher', search_get_time_slog_list_by_teacher)

// 获取学生已选课程列表
search_student_take_list = require('./server/search_student_take_list.js')
app.get('/student/take_list', search_student_take_list)

// 查询学生可选开课列表
search_student_section_list_takable = require('./server/search_student_section_list_takable.js')
app.get('/student/section_list_takable', search_student_section_list_takable)

// 学生选课/退选课
student_take_untake = require('./server/student_take_untake.js')
app.post('/student/take_untake', student_take_untake)

let server = app.listen(3011,()=>{
    console.log('The server is listening on port : 3011')
})
