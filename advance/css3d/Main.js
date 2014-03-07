var canvas;

var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var themes = [ [ "#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0" ],
		[ "#362C2A", "#732420", "#BF734C", "#FAD9A0", "#736859" ],
		[ "#0D1114", "#102C2E", "#695F4C", "#EBBC5E", "#FFFBB8" ],
		[ "#2E2F38", "#FFD63E", "#FFB54B", "#E88638", "#8A221C" ],
		[ "#121212", "#E6F2DA", "#C9F24B", "#4D7B85", "#23383D" ],
		[ "#343F40", "#736751", "#F2D7B6", "#BFAC95", "#8C3F3F" ],
		[ "#000000", "#2D2B2A", "#561812", "#B81111", "#FFFFFF" ],
		[ "#333B3A", "#B4BD51", "#543B38", "#61594D", "#B8925A" ] ];
var theme;

var worldAABB, world, iterations = 1, timeStep = 1 / 15;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var bodies, elements, text ,imageObj;

var createMode = false;
var destroyMode = false;

var isMouseDown = false;
var mouseJoint;
var mouse = { x: 0, y: 0 };
var gravity = { x: 0, y: 1 };

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;

init();
play();

function init() {

	canvas = document.getElementById( 'canvas' );

	document.onmousedown = onDocumentMouseDown;
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;
	document.ondblclick = onDocumentDoubleClick;

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d

	worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );

	setWalls();
	reset();
}


function play() {

	setInterval( loop, 1000 / 40 );
}

function reset() {

	var i;

	if ( bodies ) {

		for ( i = 0; i < bodies.length; i++ ) {

			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}

	// color theme
	theme = themes[ Math.random() * themes.length >> 0 ];
	document.body.style[ 'backgroundColor' ] = theme[ 0 ];

	bodies = [];
	elements = [];

//	welcome = '<span style="color:' + theme[0] + ';font-size:12px;">欢饮光临!</span><br /><br /><span style="font-size:5px;"><strong>你可以如下操作:</strong><br /><br />1. 拖拽小球.<br />2.单击背景.<br />3. 晃动你的浏览器.<br />4. 双击.<br />5. 点击首页</span>';
//	createInstructions( 'text' ,welcome);
	home = '<a href="/index.php"><span style="color:' + theme[0] + ';font-size:35px;">首页</span></a>';
	createInstructions(home);
	about = '<a href="http://www.pper.com.cn"><span style="color:' + theme[0] + ';font-size:35px;">拍拍客</span></a>';
	createInstructions(about);
	
	var photos = [{"name":"20140224~231323~24634400-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":15.15,"time":"2014-02-24 23:13:23"},{"name":"20140223~092232~50860900-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":12.19,"time":"2014-02-23 09:22:32"},{"name":"20140223~092227~84986800-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":9.27,"time":"2014-02-23 09:22:28"},{"name":"20140223~092223~46160600-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":12.94,"time":"2014-02-23 09:22:23"},{"name":"20140223~092215~45153200-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":11.34,"time":"2014-02-23 09:22:15"},{"name":"20140223~092210~65745100-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":16.81,"time":"2014-02-23 09:22:10"},{"name":"20140223~092202~76813000-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":8.22,"time":"2014-02-23 09:22:03"},{"name":"20140222~141609~82729300-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":7.76,"time":"2014-02-22 14:16:10"},{"name":"20140222~141519~24850600-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":7.45,"time":"2014-02-22 14:15:19"},{"name":"20140222~141447~53970400-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":7.82,"time":"2014-02-22 14:14:47"},{"name":"20140221~225519~14933400-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":6.49,"time":"2014-02-21 22:55:19"},{"name":"20140221~224303~69615200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":11.34,"time":"2014-02-21 22:43:03"},{"name":"20140221~190011~24880900-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-21 19:00:11"},{"name":"20140221~184513~02337600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-21 18:45:13"},{"name":"20140221~182047~40130300-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.23,"time":"2014-02-21 18:20:47"},{"name":"20140219~155442~96286600-ozKfgjuyJOyO90-1P7Fl6V0LdQpw.jpg","size":13.57,"time":"2014-02-19 15:54:43"},{"name":"20140217~171703~84422200-ozKfgjqf8WZnckqhbhiE8UbfBJ9o.jpg","size":22.82,"time":"2014-02-17 17:17:04"},{"name":"20140217~171652~51523600-ozKfgjqf8WZnckqhbhiE8UbfBJ9o.jpg","size":11.79,"time":"2014-02-17 17:16:52"},{"name":"20140217~121518~33588700-ozKfgjoT5WSTGfSqRMt1vvAP-C6Q.jpg","size":22.81,"time":"2014-02-17 12:15:18"},{"name":"20140216~195046~96488600-ozKfgjkYX4Lu3hGzZUN__22v9Ka4.jpg","size":20.29,"time":"2014-02-16 19:50:47"},{"name":"20140212~191905~89242200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.43,"time":"2014-02-12 19:19:06"},{"name":"20140212~173301~68292700-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.68,"time":"2014-02-12 17:33:02"},{"name":"20140212~172828~52781300-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.28,"time":"2014-02-12 17:28:28"},{"name":"20140212~172827~47292200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.48,"time":"2014-02-12 17:28:27"},{"name":"20140212~172620~89648600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.23,"time":"2014-02-12 17:26:21"},{"name":"20140212~172400~48668000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":11.64,"time":"2014-02-12 17:24:00"},{"name":"20140212~172146~75001400-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:21:47"},{"name":"20140212~171818~12495100-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.33,"time":"2014-02-12 17:18:18"},{"name":"20140212~171644~88172800-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:16:46"},{"name":"20140212~171628~63195500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:16:42"},{"name":"20140212~171606~83386000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:16:26"},{"name":"20140212~171558~73138700-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:16:13"},{"name":"20140212~170916~29488600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 17:09:16"},{"name":"20140212~170625~97793200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":12.45,"time":"2014-02-12 17:06:26"},{"name":"20140212~170230~36544600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 17:02:30"},{"name":"20140212~170145~98722100-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":12.58,"time":"2014-02-12 17:01:46"},{"name":"20140212~170038~92334000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 17:00:39"},{"name":"20140212~165251~59629100-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 16:53:03"},{"name":"20140212~165302~99824600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 16:53:03"},{"name":"20140212~165220~39829500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 16:52:49"},{"name":"20140212~165232~59538200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 16:52:46"},{"name":"20140212~145537~71253000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.8,"time":"2014-02-12 14:55:37"},{"name":"20140212~145036~41408600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 14:50:36"},{"name":"20140212~132159~42525200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 13:21:59"},{"name":"20140212~132121~16650700-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 13:21:21"},{"name":"20140212~132045~48382900-ozKfgjkYX4Lu3hGzZUN__22v9Ka4.jpg","size":20.93,"time":"2014-02-12 13:20:45"},{"name":"20140212~131907~87486500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 13:19:08"},{"name":"20140212~131145~95314200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 13:11:46"},{"name":"20140212~130850~44208300-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 13:08:50"},{"name":"20140212~130620~01411600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 13:06:20"},{"name":"20140212~130458~21958200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":17.8,"time":"2014-02-12 13:04:58"},{"name":"20140212~130202~65979400-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 13:02:02"},{"name":"20140212~125943~94359400-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 12:59:44"},{"name":"20140212~125620~36905700-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 12:56:20"},{"name":"20140212~125339~60215800-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":15.21,"time":"2014-02-12 12:53:39"},{"name":"20140212~124622~90364500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":12.58,"time":"2014-02-12 12:46:23"},{"name":"20140212~124143~30762400-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":17.8,"time":"2014-02-12 12:41:43"},{"name":"20140212~124024~08966300-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":19.51,"time":"2014-02-12 12:40:24"},{"name":"20140212~123850~52908000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 12:38:50"},{"name":"20140212~123611~54946800-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 12:36:11"},{"name":"20140212~123446~48811100-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":17.8,"time":"2014-02-12 12:34:46"},{"name":"20140212~123220~77563200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.47,"time":"2014-02-12 12:32:21"},{"name":"20140212~123120~64788500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":9.48,"time":"2014-02-12 12:31:20"},{"name":"20140212~123001~75823200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":19.51,"time":"2014-02-12 12:30:02"},{"name":"20140212~122757~20609000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":17.8,"time":"2014-02-12 12:27:57"},{"name":"20140212~122704~48861600-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-12 12:27:04"},{"name":"20140212~122454~85821400-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.08,"time":"2014-02-12 12:24:55"},{"name":"20140212~122325~71003200-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":7.65,"time":"2014-02-12 12:23:26"},{"name":"20140212~122325~18430000-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":18.78,"time":"2014-02-12 12:23:25"},{"name":"20140209~144950~52901900-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":12.45,"time":"2014-02-09 14:49:50"},{"name":"20140209~144827~60038500-ozKfgjrveB3dMrB53rqjPsK2gCGs.jpg","size":13.06,"time":"2014-02-09 14:48:28"},{"name":"20140208~172938~76920900-ozKfgjqWaWMwq545-ZojtMkPsvCQ.jpg","size":14.44,"time":"2014-02-08 17:29:40"}];
//	var photos = [{"name":"20140224~231323~24634400-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg","size":15.15,"time":"2014-02-24 23:13:23"},{"name":"20140223~092232~50860900-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":12.19,"time":"2014-02-23 09:22:32"},{"name":"20140223~092227~84986800-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":9.27,"time":"2014-02-23 09:22:28"},{"name":"20140223~092223~46160600-ozKfgjjnIXY6F01cpg6YVVLMcxfE.jpg","size":12.94,"time":"2014-02-23 09:22:23"},];

	for	(i =0;i<8;i++) {
		createImage(photos[i]['name']);
	}
/*
	path = '/photo/20140303~190512~87758000-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg';
	createInstructions( 'img' ,path);
	path = '/photoResize/20140303~190512~87758000-ozKfgjiHvkAQKc0d1rZotNz_vhrY.jpg';
	createInstructions( 'img' ,path);
*/	
	for( i = 0; i < 10; i++ ) {

		createBall();

	}

}

//删除一个元素
function deleteElement(index)
{
	var body = bodies[ index ];
	canvas.removeChild( body.GetUserData().element );
	world.DestroyBody( body );
	body = null;
	bodies.splice(index,1);  
}

//

function onDocumentMouseDown() {

	isMouseDown = true;
	return false;
}

function onDocumentMouseUp() {

	isMouseDown = false;
	return false;
}

function onDocumentMouseMove( event ) {

	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

function onDocumentDoubleClick() {
	deleteElement(bodies.length -1);
//	reset();
}

function onDocumentTouchStart( event ) {

	if( event.touches.length == 1 ) {

		event.preventDefault();

		// Faking double click for touch devices

		var now = new Date().getTime();

		if ( now - timeOfLastTouch  < 250 ) {

			reset();
			return;
		}

		timeOfLastTouch = now;

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;

	}

}

function onDocumentTouchEnd( event ) {

	if ( event.touches.length == 0 ) {

		event.preventDefault();
		isMouseDown = false;

	}

}

function onWindowDeviceOrientation( event ) {

	if ( event.beta ) {

		gravity.x = Math.sin( event.gamma * Math.PI / 180 );
		gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );

	}

}

//

function createInstructions(content) {
	var size = 160;

	var element = document.createElement( 'div' );
	element.width = size;
	element.height = size;	
	element.style.position = 'absolute';
	element.style.left = -100 + 'px';
	element.style.top = -100 + 'px';
	element.style.cursor = "default";

	canvas.appendChild(element);
	elements.push( element );

	var circle = document.createElement( 'canvas' );
	circle.width = size;
	circle.height = size;

	var graphics = circle.getContext( '2d' );

	graphics.fillStyle = theme[ 3 ];
	graphics.beginPath();
	graphics.arc( size * .5, size * .5, size * .5, 0, PI2, true );
	graphics.closePath();
	graphics.fill();

	element.appendChild( circle );

	text = document.createElement( 'div' );
	text.onSelectStart = null;
	text.innerHTML = content;
	text.style.color = theme[ 1 ];
	text.style.position = 'absolute';
	text.style.left = '0px';
	text.style.top = '0px';
	text.style.fontFamily = 'Georgia';
	text.style.textAlign = 'center';
	element.appendChild(text);

	text.style.left = ((160 - text.clientWidth) / 2) +'px';
	text.style.top = ((160 - text.clientHeight) / 2) +'px';	
	
	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = size / 2;
	circle.density = 1;
	circle.friction = 0.3;
	circle.restitution = 0.3;
	b2body.AddShape(circle);
	b2body.userData = {element: element};

	b2body.position.Set( Math.random() * stage[2], Math.random() * -200 );
	b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
	bodies.push( world.CreateBody(b2body) );	
}

function createImage(content) {


	
	var image=new Image();
	image.src='photoResize/' + content;
	image.onload = function() {
		var size = 160;

		var element = document.createElement( 'div' );
		element.width = size;
		element.height = size;	
		element.style.position = 'absolute';
		element.style.left = -100 + 'px';
		element.style.top = -100 + 'px';
		element.style.cursor = "default";

		canvas.appendChild(element);
		elements.push( element );

		var a = document.createElement('a');
		a.href =  'photo/' + content;
		a.setAttribute('data-lightbox','roadtrip');
		a.setAttribute('title',a.href.substr(a.href.lastIndexOf('/')+1));
		a.setAttribute('text-align','center');		
		a.appendChild(this);
		element.appendChild( a );

		var b2body = new b2BodyDef();

		var circle = new b2CircleDef();
		circle.radius = size / 2;
		circle.density = 1;
		circle.friction = 0.3;
		circle.restitution = 0.3;
		b2body.AddShape(circle);
		b2body.userData = {element: element};

		b2body.position.Set( Math.random() * stage[2], Math.random() * -200 );
		b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
		bodies.push( world.CreateBody(b2body) );

		for( i = 0; i < 2; i++ ) {

			createBall();

		}
	};
	

/*
	var image = document.createElement( 'img' );
	image.style.position = 'absolute';
	image.style.textAlign = 'center';
	image.src = content;
	image.onload = function() {
		var size = 160;

		var element = document.createElement( 'div' );
		element.width = size;
		element.height = size;	
		element.style.position = 'absolute';
		element.style.left = -100 + 'px';
		element.style.top = -100 + 'px';
		element.style.cursor = "default";

		canvas.appendChild(element);
		elements.push( element );

		element.appendChild( this );

		var b2body = new b2BodyDef();

		var circle = new b2CircleDef();
		circle.radius = size / 2;
		circle.density = 1;
		circle.friction = 0.3;
		circle.restitution = 0.3;
		b2body.AddShape(circle);
		b2body.userData = {element: element};

		b2body.position.Set( Math.random() * stage[2], Math.random() * -200 );
		b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
		bodies.push( world.CreateBody(b2body) );

		for( i = 0; i < 2; i++ ) {

			createBall();

		}
	}
*/

}

function createBall( x, y ) {
/*
	var x = x || Math.random() * stage[2];
	var y = y || Math.random() * -200;

	var size = (Math.random() * 30 >> 0) + 20;

	var element = document.createElement("canvas");
	element.width = size;
	element.height = size;
	element.style.position = 'absolute';
	element.style.left = -200 + 'px';
	element.style.top = -200 + 'px';
	element.style.WebkitTransform = 'translateZ(0)';
	element.style.MozTransform = 'translateZ(0)';
	element.style.OTransform = 'translateZ(0)';
	element.style.msTransform = 'translateZ(0)';
	element.style.transform = 'translateZ(0)';

	var graphics = element.getContext("2d");

	var num_circles = Math.random() * 10 >> 0;

	for (var i = size; i > 0; i-= (size/num_circles)) {

		graphics.fillStyle = theme[ (Math.random() * 4 >> 0) + 1];
		graphics.beginPath();
		graphics.arc(size * .5, size * .5, i * .5, 0, PI2, true); 
		graphics.closePath();
		graphics.fill();
	}

	canvas.appendChild(element);

	elements.push( element );

	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = size >> 1;
	circle.density = 1;
	circle.friction = 0.3;
	circle.restitution = 0.3;
	b2body.AddShape(circle);
	b2body.userData = {element: element};

	b2body.position.Set( x, y );
	b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
	bodies.push( world.CreateBody(b2body) );
	*/
}

//

function loop() {

	if (getBrowserDimensions()) {

		setWalls();

	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * 350 + delta[0];
	world.m_gravity.y = gravity.y * 350 + delta[1];

	mouseDrag();
	world.Step(timeStep, iterations);

	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];

		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';

		if (element.tagName == 'DIV') {
			if(element.childNodes[0].tagName == 'IMG')
			{

			}
			else
			{
				var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg) translateZ(0)';
				text.style.WebkitTransform = style;
				text.style.MozTransform = style;
				text.style.OTransform = style;
				text.style.msTransform = style;
				text.style.transform = style;			
			}
		}
	}
}


// .. BOX2D UTILS

function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {

		fixed = true;

	}

	var boxSd = new b2BoxDef();

	if (!fixed) {

		boxSd.density = 1.0;

	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);

}

function mouseDrag()
{
	// mouse press
	if (createMode) {

		createBall( mouse.x, mouse.y );

	} else if (isMouseDown && !mouseJoint) {

		var body = getBodyAtMouse();

		if (body) {

			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouse.x, mouse.y);
			md.maxForce = 30000 * body.m_mass;
			// md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();

		} else {

			createMode = true;

		}

	}

	// mouse release
	if (!isMouseDown) {

		createMode = false;
		destroyMode = false;

		if (mouseJoint) {

			world.DestroyJoint(mouseJoint);
			mouseJoint = null;

		}

	}

	// mouse move
	if (mouseJoint) {

		var p2 = new b2Vec2(mouse.x, mouse.y);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {

		if (shapes[i].m_body.IsStatic() == false) {

			if ( shapes[i].TestPoint(mousePVec) ) {

				body = shapes[i].m_body;
				break;

			}

		}

	}

	return body;

}

function setWalls() {

	if (wallsSetted) {

		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);

		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}

	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);	

	wallsSetted = true;

}

// BROWSER DIMENSIONS

function getBrowserDimensions() {

	var changed = false;

	if (stage[0] != window.screenX) {

		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;

	}

	if (stage[1] != window.screenY) {

		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;

	}

	if (stage[2] != window.innerWidth) {

		stage[2] = window.innerWidth;
		changed = true;

	}

	if (stage[3] != window.innerHeight) {

		stage[3] = window.innerHeight;
		changed = true;

	}

	return changed;

}
