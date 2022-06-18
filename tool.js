token_list = {
	"student": {
		"id":"00128", 
		"role":"student"
	},
	"teacher": {
		"id":"10101", 
		"role":"teacher"
	},
	"admin": {
		"id":"123",
		"role":"admin"
	}
}

function get_role_info(role) {
	if (role == "student") {
		return ["student", "SID"]
	}
	if (role == "teacher") {
		return ["instructor", "IID"]
	}
	if (role == "admin") {
		return ["admin", "AID"]
	}
	return [null, null]
}

module.exports = {
	"token_list": token_list,
	"get_role_info": get_role_info
}