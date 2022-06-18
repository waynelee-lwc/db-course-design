var tool = require('../tool.js')
function user_logout(req,res) {
	var token = req.headers.token
	delete tool.token_list[token]
	res.send({
		"message":null,
		"code":200
	})
	res.end()
}
module.exports = user_logout