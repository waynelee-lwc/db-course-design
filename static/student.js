document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

$(document).ready(()=>{
    
    let user ={
        name:'大明明',
        dept_name:'环境工程',
        email:'123456789@jlu.edu.cn',
        phone:'12345678901'
    }

    $('.userinfo').empty()
    $('.userinfo').html(
        `<b>${user.dept_name}</b>&nbsp;学院<br>&nbsp;<b>${user.name}</b>&nbsp;同学`
    )

    $('.phone input').val(user.phone)
    $('.email input').val(user.email)
    
})

$('.profile-submit').on('click',function(){

    let id = '3123123123'
    let phone = $('.phone input').val()
    let email = $('.email input').val()
    let password = $('.password input').val()
    let passwordrpt = $('.password input').val()

    alert('id ' + id + '\nphone ' + phone + '\nemail ' + email + '\npassword ' + password + '\npasswordrpt ' + passwordrpt) 
})