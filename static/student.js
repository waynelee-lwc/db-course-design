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
    //分数
    loadGrades()
    //已选课程time slot
    loadSchedule()
    
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
                            <td>${course.course_type}</td>
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

let takable = []
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
                takable = res.data
                $('.section-table tbody').empty()
                for(let idx in res.data){
                    sec = res.data[idx]
                    $('.section-table tbody').append(
                        $(`
                        <tr>
                            <td>${sec.course_id}</td>
                            <td>${sec.sec_id}</td>
                            <td>${sec.title}</td>
                            <td>${sec.course_type}</td>
                            <td>${sec.dept_name}</td>
                            <td>${sec.credits}</td>
                            <td>${sec.year} ${sec.semester}</td>
                            <td>${sec.teacher_names}</td>
                            <td><button class="btn btn-primary check-schedule" id="${idx}-${sec.sec_id}">查看</button></td>
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
                reloadTakable()
                loadSchedule()
                alert(operation == 'take' ? '选课成功!' : '退选成功!')
            }
        }
    })
}

function checkSchedule(){
    let id = $(this).attr('id')
    let sec_id = id.split('-')[1]
    let idx = id.split('-')[0]
    sec = takable[idx]
    console.log(sec)

    $.ajax({
        url:`${address}/search/get_time_slog_by_sec_id`,
        type:'get',
        data:{
            sec_id:sec_id
        },
        success:function(res){
            timeslot = res.data.timeSlot
            table = parseSchedule(timeslot)
            setCurrTable(table)
            initHistoryTable(table)
            refreshView()
            showShadow()

            $('.schedule-title').empty()
            $('.schedule-title').append($(`
                <div class="name">${sec.title}</div>
                <div class="teachers">${sec.teacher_names}</div>
                <div class="type">${sec.course_type}</div>
                <div class="dept">${sec.dept_name}</div>
                <div class="semester">${sec.year} ${sec.semester}</div>
            `))

            $('.schedule-panel').empty()
            $('.schedule-panel').append($(`
                <div class="begin-week">从第<b>${timeslot.begin_week}</b>周开始</div>
                <div class="end-week">到第<b>${timeslot.end_week}</b>周结束</div>
                <div class="building">教学楼:<b>${sec.building}</b></div>
                <div class="classroom">教室:<b>${sec.room_number}</b></div>
                <button class="btn btn-primary show-history">展示已选课程</button>
            `))
            $('.show-history').click(loadHistory)
        }
    })
}

function loadHistory(){
    let val = $(this).text()
    if(val == '展示已选课程'){
        initHistoryTable()
        for(sec of historyTakes){
            table = parseSchedule(sec)
            for(let i = 1;i <= 7;i++){
                for(let j = 1;j <= 11;j++){
                    historyTable[i][j] += table[i][j]
                }
            }
        }
        refreshView()
        $(this).text('隐藏已选课程')
    }else{
        initHistoryTable()
        refreshView()
        $(this).text('展示已选课程')
    }
    
}