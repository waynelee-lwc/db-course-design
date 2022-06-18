var express = require('express')
var bodyParser = require('body-parser')
var multiparty = require('connect-multiparty')

let app = express()
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

let server = app.listen(3011,()=>{
    console.log('The server is listening on port : 3011')
})
