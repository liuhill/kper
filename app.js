
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var weixin = require('./models/weixin.js'),
Photo = require('./models/photo.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


weixin.text( function (data){
	console.log('hillock');
	var msg = {
	  FromUserName : data.ToUserName,
	  ToUserName : data.FromUserName,
	  //MsgType : "text",
	  Content : "我们只接收图片",
	  //FuncFlag : 0
	}

	//回复信息
	weixin.send(msg);
});

//监听图片消息
weixin.image(function (data) {
	//保存照片
	var photo = new Photo();
	photo.save(data.PicUrl,data.FromUserName);
	//*/
	var msg = {
	  FromUserName : data.ToUserName,
	  ToUserName : data.FromUserName,
	  //MsgType : "text",
	  Content : "图片正在上墙~~~[胜利]",
	  //FuncFlag : 0
	}

	//回复信息
	weixin.send(msg);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



routes(app);