 var http = require('http'),
	gm = require('gm').subClass({ imageMagick: true });
    fs = require('fs');
	
//从微信下载图片保存到Photo文件夹，同时等比例缩小保存到PhotoResize文件夹。
var width = 120,
    length = 160;

function Photo() {

}

module.exports = Photo;

/*
Photo.prototype.save = function(url,user){
 var hostName = url.split('/')[2];
 var path = url.substring(url.indexOf(hostName) + hostName.length);
 var options = {
     host:hostName,
     port:80,
     path:path
 };
 
 var imageName = 
 http.get(options, function (res) {
     res.setEncoding('binary');
     var imageData = "";
     res.on('data', function (data) {//图片加载到内存变量
         imageData += data;
     }).on('end', function () {//加载完毕保存图片
             var fileType = res.headers["content-type"];
             var buffer=new Buffer(imageData,"Binary");
             var fileTypeArray=fileType.split("/");
             fs.writeFile("./photo/weixin."+fileTypeArray[1],buffer,function(err,data){
                 if(err){
                    console.log("err");
                 }else{
                    console.log('success');
                 }
             })
         });
 });	
}

// 说明：用 JavaScript 实现网页图片等比例缩放 
function resizeImg(image,distWidth,distHeight) 
{ 
	srcWidth = image.width;
	srcHeight = image.height;
	var ratio = 1;
	if(srcWidth>0 && srcHeight>0) 
	{ 
		if(srcWidth/srcHeight>= distWidth/distHeight) 
		{ 
			if(srcWidth>distWidth) 
			{ 
				ratio = distWidth/srcWidth; 
			} 
		} 
		else 
		{ 
			if(srcHeight>distHeight) 
			{ 
				ratio = distHeight/srcHeight; 
			} 
		} 
	} 
	var width = srcWidth*ratio;
	var heigh = srcHeight*ratio;
	
	image.style.width = width.toString() + 'px';
	image.style.height = heigh.toString() + 'px';

	if(width < distWidth)
		image.style.paddingLeft = ((distWidth - width)/2).toString() + 'px';
		
	if(heigh < distHeight)
		image.style.paddingTop = ((distHeight - heigh)/2).toString() + 'px';
} 	
*/

Photo.prototype.save = function(url,fromName){

	var st = new Date();
	
	
	var imageName = st.getFullYear() + pad(st.getMonth()+1,2) +  pad(st.getDate() ,2) + '-'
	                    + pad(st.getHours(),2) + pad(st.getMinutes(),2) + pad(st.getSeconds(),2) + '-'
						+ pad(st.getMilliseconds(),4) + 
							'@' + fromName + '.jpg';
	var image = gm(url);
	image.autoOrient()  
    .write('./public/photo/'+imageName, function(err){  
		if (err) {  
            console.log(err); 
		}
		image.resize(120,160) //缩略图
		.autoOrient() 
		.write('./public/photoResize/'+imageName, function(err){  
			if (err) {  
				console.log(err);  
			}
		});
		
	});

}

//填充位数
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}