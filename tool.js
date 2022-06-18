token_list = {}

function get_role_info(role) {
	if (role == "student") {
		return ["student", "SID"]
	}
	if (role == "teacher") {
		return ["instructor", "IID"]
	}
	return [null, null]
}

module.exports = {
	"token_list": token_list,
	"get_role_info": get_role_info
}