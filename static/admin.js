document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
    // console.log("当前尺寸为：" + window.innerWidth);
    document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}
let address = 'http://60.205.211.19:3011'

$(document).ready(()=>{

    
    let user = JSON.parse(localStorage.getItem('userinfo'))
    let data={
        status:'0'
    }

    $('.table-status').val(data["status"])

    $('.userinfo').empty()
    $('.userinfo').html(
        `<b>${user.dept_name}</b>&nbsp;学院<br>&nbsp;<b>${user.name}</b>&nbsp;老师`
    )

    $('.phone input').val(user.phone)
    $('.email input').val(user.email)

    loadSectionList()
    //学期列表
    loadSemesters()
    //课程列表
    loadCourseList()
})

$('.profile-submit').on('click',function(){

    let user = JSON.parse(localStorage.getItem('userinfo'))
    let phone = $('.phone input').val()
    let email = $('.email input').val()
    let password = $('.password input').val()
    let passwordrpt = $('.passwordrpt input').val()

    if(password != passwordrpt){
        alert('两次密码不一致!')
        return
    }
    // alert('id ' + id + '\nphone ' + phone + '\nemail ' + email + '\npassword ' + password + '\npasswordrpt ' + passwordrpt) 
    $.ajax({
        url:`${address}/user/update_profile`,
        headers:{
            token:JSON.parse(localStorage.getItem('token'))
            // token:'teacher'
        },
        type:'post',
        data:{
            phone:phone,
            email:email,
            password:password
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                localStorage.setItem('userinfo',JSON.stringify(res.data.user))
                alert('修改成功!')
                location.reload()
            }
        }
    })
})

$('.search-submit').click(loadSectionList)
$('.create-course-submit').click(createCourse)
$('.cross').click(hideShadow)


function hideShadow(){
    $('.shadow').hide()
    $('.schedule').hide()
    $('.shadow-section').hide()
}

function showSchedule(){
    $('.shadow').show()
    $('.schedule').show()
}

function showShadowSection(){
    $('.shadow').show()
    $('.shadow-section').show()
}

function createCourse(){
    let course_id = $('.create_course_id input').val()
    let course_name = $('.create_course_name input').val()
    let dept_name = $('.create_dept_name select').val()
    let credits = $('.create_credits select').val()
    let course_type = $('.create_course_type select').val()

    if(!dept_name || !credits || !course_type){
        alert('请完整填写！')
    }

    $.ajax({
        url:`${address}/admin/create_course`,
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'admin'
        },
        type:'post',
        data:{
            course_id:course_id,
            title:course_name,
            dept_name:dept_name,
            credits:credits,
            course_type:course_type
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                alert('添加成功!')
                loadCourseList()
                $('.create_course_id input').val('')
                $('.create_course_name input').val('')
                $('.create_dept_name select').val('')
                $('.create_credits select').val(0)
                $('.create_course_type select').val('')
            }
        }
    })
}

let sectionList = []
function loadSectionList(){
    
    let course_name = $('.course_name input').val()
    let dept_name = $('.dept_name input').val()
    let sec_id = $('.sec_id input').val()
    let semester = $('.semester select').val()
    let year = semester.split('-')[0]
    semester = semester.split('-')[1]
    let status = $('.status select').val()
    if(status == '-1'){
        status = ''
    }
    console.log(status)


    //学生可选课程列表
    $.ajax({
        url:`${address}/admin/section_list`,
        type:'get',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'admin'
        },
        data:{
            course_name:course_name,
            sec_status:status,
            sec_id:sec_id,
            dept_name:dept_name,
            year:year,
            semester:semester
        },
        success:function(res){
            console.log(res)
            if(res.code != 200){
                alert('表单加载错误！')
            }else{
                sectionList = res.data
                
                $('.section-table tbody').empty()
                for(idx in res.data){
                    sec = res.data[idx]
                    $('.section-table tbody').append($(`
                        <tr>
                            <td>${sec.course_id}</td>
                            <td>${sec.sec_id}</td>
                            <td>${sec.title}</td>
                            <td>${sec.course_type}</td>
                            <td>${sec.dept_name}</td>
                            <td>${sec.credits}</td>
                            <td>${sec.year} ${sec.semester}</td>
                            <td><button class="btn btn-primary check-schedule" id="${idx}-${sec.sec_id}">查看</button></td>
                            <td>
                                <select class="table-status" id="status-${sec.sec_id}"  name="status">
                                    <option value="0">不可见</option>
                                    <option value="1">绑定授课</option>
                                    <option value="2">学生选课</option>
                                    <option value="3">授课中</option>
                                    <option value="4">登录成绩</option>
                                    <option value="5">课程结束</option>
                                </select>
                            </td>
                            <td><button class="btn btn-info update-status" id="update-status-${sec.sec_id}">更新</button></td>
                        </tr>
                    `))
                    $(`#status-${sec.sec_id}`).val(sec.status)
                }
            }
            // $('.update_status').click(takeUntake)
            // $('.check-schedule').click(checkSchedule)
        }
    })
}

let semesterList = []
function loadSemesters(){
    $.ajax({
        url:`${address}/search/semester_list`,
        type:'get',
        success:function(res){
            semesterList = res.semesterList
            $('.semester select').empty()
            $('.semester select').append($(`<option value="-" selected>开课学期</option>`))
            for(let semester of semesterList){
                $('.semester select').append($(`
                    <option value="${semester.year}-${semester.semester}">${semester.year} ${semester.semester}</option>
                `))
            }
        }
    })
}

let courseList = []
function loadCourseList(){
    $.ajax({
        url:`${address}/admin/course_list`,
        type:'get',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'admin'
        },
        data:{
            course_name:'',
            course_id:'',
            dept_name:''
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                courseList = res.data
                $('.course-table tbody').empty()
                for(let idx in res.data){
                    course = res.data[idx]
                    $('.course-table tbody').append($(`
                        <tr>
                            <td>${course.course_id}</td>
                            <td>${course.title}</td>
                            <td>${course.course_type}</td>
                            <td>${course.dept_name}</td>
                            <td>${course.credits}</td>
                            <td><button class="btn btn-primary create-section" id="create-section-${idx}-${course.course_id}">开设课程</button></td>
                        </tr>
                    `))
                }
                $('.create-section').click(createSection)
            }
        }
    })
}

function createSection(){
    let id = $(this).attr('id')
    let idx = id.split('-')[2]
    let course_id = id.split('-')[3]
    let course = courseList[idx]

    $('.schedule-title').empty()
    $('.schedule-title').append(`
        <div class="name">${course.title}</div>
        <div class="type">${course.course_type}</div>
        <div class="dept">${course.dept_name}</div>
        <div class="form-group create-section-semester">
            <select class="form-select" id="status_select" name="status">
                <option value="-" selected disabled>开课学期</option>
                <!-- <option value="2022-Fall">2022 Fall</option> -->
            </select>
        </div>
    `)
    for(let semester of semesterList){
        $('.create-section-semester select').append(`
            <option value="${semester.year}-${semester.semester}">${semester.year} ${semester.semester}</option>
        `)
    }
    
    $('.schedule-panel').empty()
    $('.schedule-panel').append($(`
        <div class="begin-week create-section-begin-week">从第<b><input type="number" value="1"></b> 周开始</div>
        <div class="end-week create-section-end-week">到第<b><input type="number" value="20"></b>周结束</div>
        <div class="building create-section-building">教学楼:<b><input type="text" placeholder="教学楼"></b></div>
        <div class="classroom create-section-classroom">教室:<b><input type="text" placeholder="教室"></b></div>
        <button class="btn btn-danger create-section-submit">确认添加</button>
    `))

    showShadowSection()
    initCurrTable()
    initHistoryTable()
    refreshView()

    $('.schetab-cell').click(selectCell)
}

function selectCell(){
    let id = $(this).attr('id')
    let i = id.split('-')[1]
    let j = id.split('-')[2]
    
    currTable[i][j] = 1 - currTable[i][j]
    refreshView()
    $('.schetab-cell').click(selectCell)
}