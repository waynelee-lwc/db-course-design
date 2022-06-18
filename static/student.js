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
    
    // let user ={
    //     name:'大明明',
    //     dept_name:'环境工程',
    //     email:'123456789@jlu.edu.cn',
    //     phone:'12345678901'
    // }
    let user = JSON.parse(localStorage.getItem('userinfo'))


    $('.userinfo').empty()
    $('.userinfo').html(
        `<b>${user.dept_name}</b>&nbsp;学院<br>&nbsp;<b>${user.name}</b>&nbsp;同学`
    )

    $('.phone input').val(user.phone)
    $('.email input').val(user.email)
    
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

function hideShadow(){
    $('.shadow').hide()
}

function showShadow(){
    $('.shadow').show()
}