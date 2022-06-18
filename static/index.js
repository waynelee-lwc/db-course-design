document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

let address = 'http://60.205.211.19:3011'

$('.role-radio').click(function(e){
    console.log(e)
    console.log($(e).attr('id'))
})

$('.login-submit').on('click',function(){
    let userid = $('.ID').val()
    let password = $('.password').val()
    let role = $("input:radio:checked").val()

    $.ajax({
        url:`${address}/user/login`,
        type:'post',
        data:{
            id:userid,
            password:password,
            role:role
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                localStorage.setItem('userinfo',JSON.stringify(res.data.user))
                localStorage.setItem('token',JSON.stringify(res.data.token))
                if(role == 'student'){
                    location.href = '/student.html'
                }
                if(role == 'teacher'){
                    location.href = '/teacher.html'
                }
                if(role == 'admin'){
                    location.href = '/admin.html'
                }
            }
        }
    })
})