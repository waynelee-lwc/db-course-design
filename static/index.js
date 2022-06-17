document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

$('.role-radio').click(function(e){
    console.log(e)
    console.log($(e).attr('id'))
})

$('.login-submit').on('click',function(){
    let userid = $('.ID').val()
    let password = $('.password').val()
    let role = $("input:radio:checked").val()

    alert(userid + password + role)
})