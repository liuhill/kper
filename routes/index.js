var crypto = require('crypto'),
	weixin = require('../models/weixin.js');


	//监听微信消息
	
module.exports = function(app) {

	app.get('/', function (req, res) {
		console.log("ip:"+req.connection.remoteAddress);
		res.render('index', { title: '快拍客' });
	});

  //微信消息
	app.post('/weixin', function (req, res) {
		
	  //预处理
		weixin.handler(req, res);
	});

	//微信验证
	app.get('/weixin',function(req,res){
		weixin.token = 'hillock';
		weixin.checkSignature(req, res);
	});
};



