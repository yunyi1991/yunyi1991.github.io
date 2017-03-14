function getStyle(obj,name){
	return (obj.currentStyle||getComputedStyle(obj,null))[name];	
}

function move(obj,json,options){
	options = options || {};
	options.easing = options.easing || "ease-out";
	options.duration = options.duration || 700;

	var start = {};
	var dis = {};
	for(var name in json){
		start[name]= parseFloat(getStyle(obj,name));
		dis[name] = json[name] - start[name]; //距离 = 终点 - 起点
	}

	var count = Math.round(options.duration/30);
	var n=0;

	clearInterval(obj.timer);

	obj.timer=setInterval(function(){
		n++;
		for(var name in json){
			switch(options.easing){
				case 'linear':
				var a = n/count;
				var cur = start[name] + dis[name]*a;
				break;

				case 'ease-in':
				var a = n/count;
				var cur = start[name] + dis[name]*a*a*a;
				break;

				case 'ease-out':
				var a = 1-n/count;
				var cur = start[name] + dis[name]*(1-a*a*a);
				break;
			}

			if(name == 'opacity'){
				obj.style.opacity = cur ;
				obj.style.filter = 'alpha(opacity:'+cur*100+')' ;
			}else{
				obj.style[name] = cur + 'px';	
			}							
		}
		if(n == count){
			clearInterval(obj.timer);
			options.complete && options.complete.call(obj);
		}
	},30);
}

function setSit(obj,oEvent){
	var w = obj.offsetWidth;
	var h = obj.offsetHeight;
	var x = oEvent.clientX - (obj.offsetLeft+w/2); //长边
	var y = obj.offsetTop + h/2 - oEvent.clientY; //短边
	return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4; //tan(y/x) --> 角度转弧度
}

function navMove(obj){
		
	obj.onmouseover = function(ev){
		var oEvent = ev || event;
		var oFrom = oEvent.fromElement || oEvent.relatedTarget;
		if(this.contains(oFrom)) return;
		
		var oSpan = this.children[0];
		var flag = setSit(this,oEvent);
		switch(flag){
			case 0:
			oSpan.style.top = '0px';
			oSpan.style.left = '-200px';
			break;

			case 1:
			oSpan.style.top = '200px';
			oSpan.style.left = '0px';
			break;

			case 2:
			oSpan.style.top = '0px';
			oSpan.style.left = '200px';
			break;

			case 3:
			oSpan.style.top = '-200px';
			oSpan.style.left = '0px';
			break;
		}

		move(oSpan,{left:0, top:0},{easing:'ease-out'});
	};

	obj.onmouseout = function(ev){
		var oEvent = ev || event;
		var oTo = oEvent.toElement || oEvent.relatedTarget;
		if(this.contains(oTo)) return;
		
		var oSpan = this.children[0];
		var flag = setSit(this,oEvent);

		switch(flag){
			case 0:
			move(oSpan,{left:-200, top:0},{easing:'ease-out'});
			break;

			case 1:
			move(oSpan,{left:0, top:200},{easing:'ease-out'});
			break;

			case 2:
			move(oSpan,{left:200, top:0},{easing:'ease-out'});
			break;

			case 3:
			move(oSpan,{left:0, top:-200},{easing:'ease-out'});
			break;
		}
	};
}