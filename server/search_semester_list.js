var tool = require('../tool.js')
function search_semester_list(req, res) {
	let list = []
	for(let i=2010;i<=2022;i++)
	{
		list.push({
			"semester":"Spring",
			"year":i
		})
		list.push({
			"semester":"Fall",
			"year":i
		})
	}
	res.send({
		"message":"",
		"code": 200,
		"semesterList":list 
	})
	return 
}
module.exports = search_semester_list