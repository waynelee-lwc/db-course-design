document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

initCurrTable()
initHistoryTable()
refreshView()
$('.schetab-cell').click(function(e){
    let id = $(this).attr('id')
    alert(id)
})

let address = 'http://60.205.211.19:3011'

$(document).ready(()=>{
    
    let user = JSON.parse(localStorage.getItem('userinfo'))


    $('.userinfo').empty()
    $('.userinfo').html(
        `<b>${user.dept_name}</b>&nbsp;学院<br>&nbsp;<b>${user.name}</b>&nbsp;同学`
    )

    $('.phone input').val(user.phone)
    $('.email input').val(user.email)

    //选课列表
    reloadTakable()
    //已选课程time slot
    loadSchedule()
    //分数
    loadGrades()
    
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

$('.cross').click(hideShadow)
$('.search-submit').click(reloadTakable)


let historyTakes = []
function loadSchedule(){
    $.ajax({
        url:`${address}/student/take_list`,
        type:'get',
        headers:{
            token:'student'
        },
        success:function(res){
            historyTakes = res.data
        }
    })
}

function hideShadow(){
    $('.shadow').hide()
}

function showShadow(){
    $('.shadow').show()
}

function loadGrades(){
    $.ajax({
        url:`${address}/student/take_score_list`,
        type:'get',
        headers:{
            token:'student'
        },
        success:function(res){
            if(res.code != 200){
                alert('获取成绩失败!' + res.message)
            }else{
                $('.score-table tbody').empty()
                for(let course of res.data){
                    $('.score-table tbody').append($(`
                        <tr>
                            <td>${course.course_id}</td>
                            <td>${course.title}</td>
                            <td>${course.type}</td>
                            <td>${course.dept_name}</td>
                            <td>${course.credits}</td>
                            <td>${course.first_grade}</td>
                            <td>${course.max_grade}</td>
                        </tr>
                    `))
                }
            }
        }
    })
}

function reloadTakable(){
    
    let course_name = $('.course_name input').val()
    let dept_name = $('.dept_name input').val()
    let teacher_name = $('.teacher_name input').val()
    let semester = $('.semester input').val()

    //学生可选课程列表
    $.ajax({
        url:`${address}/student/section_list_takable`,
        type:'get',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'student'
        },
        data:{
            course_name:course_name,
            teacher_name:teacher_name,
            dept_name:dept_name,
            year:'',
            semester:''  
        },
        success:function(res){
            // console.log(res)
            if(res.code != 200){
                alert('表单加载错误！')
            }else{
                $('.section-table tbody').empty()
                for(let sec of res.data){
                    $('.section-table tbody').append(
                        $(`
                        <tr>
                            <td>${sec.course_id}</td>
                            <td>${sec.sec_id}</td>
                            <td>${sec.title}</td>
                            <td>${sec.type}</td>
                            <td>${sec.dept_name}</td>
                            <td>${sec.credits}</td>
                            <td>${sec.year} ${sec.semester}</td>
                            <td>${sec.teacher_names}</td>
                            <td><button class="btn btn-primary check-schedule" id="schedule-${sec.sec_id}">查看</button></td>
                            <td><button class="btn btn-${sec.SID ? 'success' : 'danger'} take-untake" id="${sec.SID ? 'untake' : 'take'}-${sec.sec_id}">${sec.SID ? '退选' : '选课'}</button></td>
                        </tr>
                        `)
                    )
                }
            }
            $('.take-untake').click(takeUntake)
            $('.check-schedule').click(checkSchedule)
        }
    })
}

function takeUntake(){
    id = $(this).attr('id')
    operation = id.split('-')[0]
    sec_id = id.split('-')[1]
    $.ajax({
        url:`${address}/student/take_untake`,
        type:'post',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'student'
        },
        data:{
            operation:operation,
            sec_id:sec_id
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                alert(operation == 'take' ? '选课成功!' : '退选成功!')
                reloadTakable()
            }
        }
    })
}

function checkSchedule(){
    let id = $(this).attr('id')
    let sec_id = id.split('-')[1]

    $.ajax({
        url:`${address}/search/get_time_slog_by_sec_id`,
        type:'get',
        data:{
            sec_id:sec_id
        },
        success:function(res){
            table = parseSchedule(res.data.timeSlot)
            setCurrTable(table)
            initHistoryTable(table)
            refreshView()
            showShadow()
        }
    })
}
