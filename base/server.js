var http = require("http");
var fs = require('fs');
var url = require('url');
exports.start = function(){
    http.createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname;
//		console.log(pathname);
//		console.log(request.url);
		
        var ext = pathname.match(/(\.[^.]+|)$/)[0];//取得后缀名
        switch(ext){
			case ".jpg":
			case ".gif":
			case ".png":
               fs.readFile("."+request.url, function (err, data) {//读取内容
                    if (err) throw err;
					response.writeHead(200, {'Content-Type': 'image/jpeg'});
                    response.write(data);
                    response.end();
				});
				break;
			case ".css":
            case ".js":
                fs.readFile("."+request.url, 'utf-8',function (err, data) {//读取内容
                    if (err) throw err;
                    response.writeHead(200, {
                        "Content-Type": {
                             ".css":"text/css",
                             ".js":"application/javascript",
                      }[ext]
                    });
                    response.write(data);
                    response.end();
                });
                break;
            default:
                fs.readFile('./index.html', 'utf-8',function (err, data) {//读取内容
                    if (err) throw err;
                    response.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    response.write(data);
                    response.end();
                });

        }

    }).listen(3000);
    console.log("server start...");
}