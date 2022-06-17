

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