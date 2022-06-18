document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
    // console.log("当前尺寸为：" + window.innerWidth);
    document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}
let address = 'http://60.205.211.19:3011'


$(document).ready(()=>{
    let user = JSON.parse(localStorage.getItem('userinfo'))

    $('.userinfo').empty()
    $('.userinfo').html(
        `<b>${user.dept_name}</b>&nbsp;学院<br>&nbsp;<b>${user.name}</b>&nbsp;老师`
    )

    $('.phone input').val(user.phone)
    $('.email input').val(user.email)

    //选课列表
    reloadTakable()
    //历史任课
    loadSchedule()
    //
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
            // token:JSON.parse(localStorage.getItem('token'))
            token:'teacher'
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

$('.search-submit').on('click',function (){
    let course_id=$('.course_id input').val();
    let dept_name=$('.dept_name input').val();
    let semester=$('.semester input').val();
    let status=$('.status select').val();
    alert('cid ' + course_id + '\ndeptname ' + dept_name + '\nsemester ' + semester + '\nstatus ' + status)
})


function hideShadow(){
    $('.shadow').hide()
    $('.schedule').hide()
}

function showShadow(){
    $('.shadow').show()
    $('.schedule').show()
}

let historyTakes = []
function loadSchedule(){
    $.ajax({
        url:`${address}/teacher/take_list`,
        type:'get',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'teacher'
        },
        success:function(res){
            historyTakes = res.data
        }
    })
}

let takable = []
function reloadTakable(){
    
    // let course_name = $('.course_name input').val()
    // let dept_name = $('.dept_name input').val()
    // let teacher_name = $('.teacher_name input').val()
    // let semester = $('.semester select').val()
    // let year = semester.split('-')[0]
    // semester = semester.split('-')[1]

    //学生可选课程列表
    $.ajax({
        url:`${address}/teacher/section_list_takable`,
        type:'get',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'teacher'
        },
        data:{
            sec_id:'',
            course_name:'',
            dept_name:'',
            year:'',
            semester:''
        },
        success:function(res){
            console.log(res)
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
                            <td><button class="btn btn-primary check-schedule" id="${idx}-${sec.sec_id}">查看</button></td>
                            <td><button class="btn btn-${sec.IID ? 'success' : 'danger'} take-untake" id="${sec.IID ? 'untake' : 'take'}-${sec.sec_id}">${sec.IID ? '退选' : '选课'}</button></td>
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
        url:`${address}/teacher/take_untake`,
        type:'post',
        headers:{
            // token:JSON.parse(localStorage.getItem('token'))
            token:'teacher'
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
                alert(operation == 'take' ? '选择授课成功!' : '退选成功!')
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