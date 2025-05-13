/***
 * 스타트이지(StartEasy)
 * leebyeungok@gmail.com 이병옥
 */

Va.DiagramLib = class extends Va {
	static checkBroswer (){
		var agent = navigator.userAgent.toLowerCase(),
			name = navigator.appName,
			browser = '';
		// MS 계열 브라우저를 구분
		if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
			browser = 'ie';
			if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
				agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
				//browser += parseInt(agent[1]);
			} else { // IE 11+
				if(agent.indexOf('trident') > -1) { // IE 11
					//browser += 11;
				} else if(agent.indexOf('edge/') > -1) { // Edge
					browser = 'edge';
				}
			}
		} else if(agent.indexOf('safari') > -1) { // Chrome or Safari
			if(agent.indexOf('opr') > -1) { // Opera
				browser = 'opera';
			} else if(agent.indexOf('chrome') > -1) { // Chrome
				browser = 'chrome';
			} else { // Safari
				browser = 'safari';
			}
		} else if(agent.indexOf('firefox') > -1) { // Firefox
			browser = 'firefox';
		}
		//console.log('browser', browser);
		browserCls  = browser;
	}
	static init(){
		window.requestAFrame = (function () { 
			//console.log('requestAFrame');
			return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) { 
				//console.log('start', 1000 / animFps);
				return window.setTimeout(callback, 1000 / animFps); // shoot for 60 fps 
			};
		})(); 
	
		window.cancelAFrame = (function () { 
			return window.cancelAnimationFrame || 
			window.webkitCancelAnimationFrame || 
			window.mozCancelAnimationFrame || 
			window.oCancelAnimationFrame ||
			function (id) { 
				//console.log('clearTimeout');
				window.clearTimeout(id); 
			};
		})();
	
	}
	//checkBroswer();
	/*
	(function() {
		if ( typeof window.CustomEvent === "function" ) return false;
	
		function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
		}
	
		CustomEvent.prototype = window.Event.prototype;
	
		window.CustomEvent = CustomEvent;
	})();
	*/
	static createFigId (type){
		var temp =  '' + type + Date.now() + Math.random();
		return temp.replace('.', '_');
	}
	static createBasic (fg, opt){
		// dots
		fg.opt.dots = [];
		var dotsInfo = setBasicDots(opt);
		fg.opt.dots = dotsInfo;
		fg.opt.rotDot = {x:0, y:fg.opt.h * (-1) -30};
		fg.g = createG(opt);
		//console.log('fg.g-------------------------------------------->', fg.g);
		fg.g.fg = fg;
		// pattern.
		if(fg.opt.ptts != undefined){
			setPatterns(fg, fg.opt.ptts);
		}
		if(fg.opt.grds != undefined){
			setGradients(fg, fg.opt.grds);
		}
		var tags = createTags(opt);
		
		/*
		for(var i=0; i < tags.g.length; i++){
			fg.g.appendChild(tags.g[i]);
		}
		*/
		for(var i=0; i < tags.g.length; i++){
			var checked = false;
			if(opt.tags[i].plyname != undefined && opt.tags[i].plyname != null && opt.tags[i].plyname != ''){
				for(var j= i-1; j >=0;j--){
					if(opt.tags[i].plyname == opt.tags[j].lyname){
						//console.log(i, j, tags.g);
						tags.g[j].appendChild(tags.g[i]);
						checked = true;
						break;
					}
				}
			}
			if(checked == false){
				fg.g.appendChild(tags.g[i]);
			}
		}
		fg.g.tags = tags.tag;
		fg.g.g = tags.g;

		if(opt.txt != undefined){
			var txt = createTxt(opt);
			fg.g.txt = txt;
			fg.g.appendChild(txt);
		} 
			
		
		var rotLine = createRotLine(opt);
		fg.g.rotLine = rotLine;
		fg.g.appendChild(rotLine);

		var rotDot = createRotDot(opt);
		fg.g.rotDot = rotDot;
		fg.g.appendChild(rotDot);

		var dots = createDots(opt, dotsInfo);
		fg.g.dots = dots;
		for(var i=0; i < dots.length; i++){
			fg.g.appendChild(dots[i]);
		}
		//console.log('opt.jdots', opt);
		
		if(opt.jdots != undefined){
			/*
			for(var i=0; i< opt.jdots.length; i++){
				if(opt.jdots[i].connId == undefined){
					opt.jdots[i].connId =[];
				}
				if(opt.jdots[i].connIndex == undefined){
					opt.jdots[i].connIndex = [];
				}
			}
			*/
			var jdots = createjDots(opt);
			// ////console.log('jdots==>', jdots);
			fg.g.jdots = jdots;
		} else {
			fg.g.jdots = [];
		}
		// ////console.log('여기는', fg.opt.dots[0].y);
		for(var i=0; i < fg.g.jdots.length; i++){
			fg.g.appendChild(fg.g.jdots[i]);
		}
		if(fg.sed.editMode == false){
			if(fg.opt.inv != undefined && fg.opt.inv == true){
				fg.g.setAttribute('visibility', 'hidden');
			}
		}
	}
	static createConnector (fg, opt){
		/*
		opt.x1 = 0;
		opt.y1 = 0;
		opt.x2 = 0;
		opt.y2 = 0;
		*/
		// dots
		fg.opt.dots = [];
		var dotsInfo = setLineDots(opt);
		//console.log('dotsInfo---->',dotsInfo)

		fg.opt.dots = dotsInfo;
		

		fg.opt.dots[0].connId = null;
		fg.opt.dots[fg.opt.dots.length-1].connId = null;
		fg.g = createG(opt);

		fg.g.fg = fg;
		if(fg.opt.ptts != undefined){
			setPatterns(fg, fg.opt.ptts);
		}
		if(fg.opt.grds != undefined){
			setGradients(fg, fg.opt.grds);
		}
		var tags = createLineTags(opt);
		
		if(opt.type != 'flowline'){
			for(var i=0; i < tags.hTags.length; i++){
				fg.g.appendChild(tags.hTags[i]);
			}
		}
		/*
		for(var i=0; i < tags.tags.length; i++){
			fg.g.appendChild(tags.tags[i]);
		}
		*/
		fg.g.appendChild(tags.path);

		for(var i=0; i < tags.tags.length; i++){
			////console.log('stags****', i);
			fg.g.appendChild(tags.tags[i]);
		}

		fg.g.path = tags.path;
		if(opt.type != 'flowline'){
			fg.g.hTags = tags.hTags;
		}
		fg.g.tags = tags.tags;
		fg.g.g = tags.g;

		var dots = createDots(opt, dotsInfo);
		fg.g.dots = dots;

		//console.log('dots', dots, fg.g);

		for(var i=0; i < dots.length; i++){
			fg.g.appendChild(dots[i]);
		}
		//if(opt.jdots == undefined){
		//console.log('11opt.jdots', opt.jdots);
		for(var i=0; i< opt.jdots.length; i++){
			if(opt.jdots[i].connId == undefined){
				opt.jdots[i].connId ='';
			}
			if(opt.jdots[i].connIndex == undefined){
				opt.jdots[i].connIndex = '';
			}
		}
		//console.log('222opt.jdots', opt.jdots);
		//}

		var jdots = createjDots(opt);
		// ////console.log('jDots==>', jdots);
		fg.g.jdots = jdots;
		for(var i=0; i < jdots.length; i++){
			fg.g.appendChild(jdots[i]);
		}

		if(opt.type == 'flowline'){
			/* 임시로 막음
			fg.opt.lineDotsPos = [];
			fg.opt.lineDotsPos.push({ x:0, y:0}); 
			fg.opt.lineDotsPos.push({ x:0, y:0});
			fg.opt.lineDotsPos.push({ x:0, y:0});
			*/
			fg.opt.lineMoveMode = 'A';
			/* 임시로 막음 */
			/*
			fg.opt.lineMoveDir = [];
			fg.opt.lineMoveDir.push('');
			fg.opt.lineMoveDir.push('');
			fg.opt.lineMoveDir.push('');
			fg.opt.lineMovePos = [];
			fg.opt.lineMovePos.push({x:0, y:0});
			fg.opt.lineMovePos.push({x:0, y:0});
			fg.opt.lineMovePos.push({x:0, y:0});
			fg.opt.lineMovePos.push({x:0, y:0});  
			*/
			/* 임시로 막음.
			var lineDots = createLineDots(opt);
			for(var i=0; i< lineDots.length; i++){
				fg.g.appendChild(lineDots[i]);
			}

			fg.g.lineDots = lineDots;
			fg.g.lineDots[0].onmousedown = function(event){
				console.log('mousedown0');
				event.stopPropagation();
				fg.sed.selectedFg = fg;
				fg.sed.selectedDownFgLineDot = fg.g.lineDots[0];
				fg.sed.selectedDownFgLineDotIndex = 0;
				fg.sed.action = 'resize';
			}
			fg.g.lineDots[1].onmousedown = function(event){
				console.log('mousedown1');
				event.stopPropagation();
				fg.sed.selectedFg = fg;
				fg.sed.selectedDownFgLineDot = fg.g.lineDots[1];
				fg.sed.selectedDownFgLineDotIndex = 1;
				fg.sed.action = 'resize';
			}
			fg.g.lineDots[2].onmousedown = function(event){
				console.log('mousedown2');
				event.stopPropagation();
				fg.sed.selectedFg = fg;
				fg.sed.selectedDownFgLineDot = fg.g.lineDots[2];
				fg.sed.selectedDownFgLineDotIndex = 2;
				fg.sed.action = 'resize';
			}
			*/
			
		}
		if(fg.sed.editMode == false){
			if(fg.opt.inv != undefined && fg.opt.inv == true){
				fg.g.setAttribute('visibility', 'hidden');
			}
		}
	}
	static createLine (fg, opt){
		// dots
		fg.opt.dots = [];

		var dotsInfo = setLineDots(opt);

		fg.opt.dots = dotsInfo;

		fg.opt.dots[0].connId = null;
		fg.opt.dots[fg.opt.dots.length-1].connId = null;
		fg.g = createG(opt);

		

		fg.g.fg = fg;
		var tags = createLineTags(opt);
		
		for(var i=0; i < tags.hTag.length; i++){
			fg.g.appendChild(tags.hTag[i]);
		}
		/*
		for(var i=0; i < tags.tag.length; i++){
			fg.g.appendChild(tags.tag[i]);
		}
		*/
		fg.g.appendChild(tags.path);

		for(var i=0; i < tags.tags.length; i++){
			fg.g.appendChild(tags.tags[i]);
		}

		fg.g.path = tags.path;
		if(opt.type != 'flowline'){
			fg.g.hTags = tags.hTag;
		}
		fg.g.tags = tags.tags;
		//fg.g.g = tags.g;

		var dots = createDots(opt, dotsInfo);
		fg.g.dots = dots;
		for(var i=0; i < dots.length; i++){
			fg.g.appendChild(dots[i]);
		}
		
		for(var i=0; i< opt.jdots.length; i++){
			opt.jdots[i].connId = ''; //[];
			opt.jdots[i].connIndex = ''; //[];
		}
		

		var jdots = createjDots(opt);
		// ////console.log('jDots==>', jdots);
		fg.g.jdots = jdots;
		for(var i=0; i < jdots.length; i++){
			fg.g.appendChild(jdots[i]);
		}
	}
	static createSelectArea (fg, opt){
		
		fg.g = createG(opt);

		fg.g.fg = fg;

		/*
		var rotLine = createRotLine(opt);
		fg.g.rotLine = rotLine;
		fg.g.appendChild(rotLine);

		var rotDot = createRotDot(opt);
		fg.g.rotDot = rotDot;
		fg.g.appendChild(rotDot);
		*/
		// ////console.log('opt.tags', opt.tags);
		var tags = createTags(opt);
		for(var i=0; i < tags.g.length; i++){
			fg.g.appendChild(tags.g[i]);
		}
		fg.g.tags = tags.tag;
		fg.g.g = tags.g;    
	}

	static createCircle = function(fg, opt){
		// dots
		fg.opt.dots = [];
		var dotsInfo = setBasicDots(opt);
		fg.opt.dots = dotsInfo;
		fg.opt.rotDot = {x:0, y:fg.opt.h * (-1) -30};
		fg.g = createG(opt);
		//console.log('fg.g-------------------------------------------->', fg.g);
		fg.g.fg = fg;
		var tags = createTags(opt);
		
		for(var i=0; i < tags.g.length; i++){
			var checked = false;
			if(opt.tags[i].plyname != undefined && opt.tags[i].plyname != null && opt.tags[i].plyname != ''){
				for(var j= i-1; j >=0;j--){
					if(opt.tags[i].plyname == opt.tags[j].lyname){
						fg.g.g[j].appendChild(tags[i].g);
						checked = true;
						break;
					}
				}
			}
			if(checked == false){
				fg.g.appendChild(tags.g[i]);
			}
		}
		fg.g.tags = tags.tag;
		fg.g.g = tags.g;

		
		var rotLine = createRotLine(opt);
		fg.g.rotLine = rotLine;
		fg.g.appendChild(rotLine);

		var rotDot = createRotDot(opt);
		fg.g.rotDot = rotDot;
		fg.g.appendChild(rotDot);

		var dots = createDots(opt, dotsInfo);
		fg.g.dots = dots;
		for(var i=0; i < dots.length; i++){
			fg.g.appendChild(dots[i]);
		}
		
		for(var i=0; i< opt.jdots.length; i++){
			if(opt.jdots[i].connId == undefined){
				opt.jdots[i].connId = ''; //[];
			}
			if(opt.jdots[i].connIndex == undefined){
				opt.jdots[i].connIndex = '';//[];
			}
		}
		var jdots = createjDots(opt);
		// ////console.log('jdots==>', jdots);
		fg.g.jdots = jdots;
		// ////console.log('여기는', fg.opt.dots[0].y);
		for(var i=0; i < jdots.length; i++){
			fg.g.appendChild(jdots[i]);
		}
	}

	static setBasicDots (opt){
		var dots = [];
		dots.push({ x:0, y:-50, xc:opt.w/2 * ( 0), yc:opt.h/2 * (-1)}); 
		dots.push({ x:50, y:-50, xc:opt.w/2 * ( 1), yc:opt.h/2 * (-1)}); 
		dots.push({ x:50, y:0 * ( 0), xc:opt.w/2 * ( 1), yc:opt.h/2 * ( 0)}); 
		dots.push({ x:50, y:50, xc:opt.w/2 * ( 1), yc:opt.h/2 * ( 1)}); 
		dots.push({ x:0, y:50, xc:opt.w/2 * ( 0), yc:opt.h/2 * ( 1)}); 
		dots.push({ x:-50, y:50, xc:opt.w/2 * (-1), yc:opt.h/2 * ( 1)}); 
		dots.push({ x:-50, y:0, xc:opt.w/2 * (-1), yc:opt.h/2 * ( 0)}); 
		dots.push({ x:-50, y:-50, xc:opt.w/2 * (-1), yc:opt.h/2 * (-1)}); 
		if(opt.bdots != undefined && opt.bdots != null){		
			dots[0].y = opt.bdots[0].y;
			dots[1].x = opt.bdots[0].x;
			dots[1].y = opt.bdots[1].y;
			dots[2].x = opt.bdots[1].x;
			dots[2].y = opt.bdots[1].y;
			dots[3].x = opt.bdots[1].x;
			dots[3].y = opt.bdots[2].y;
			dots[4].x = opt.bdots[2].x;
			dots[4].y = opt.bdots[2].y;
			dots[5].x = opt.bdots[3].x;
			dots[5].y = opt.bdots[2].y;
			dots[6].x = opt.bdots[3].x;
			dots[6].y = opt.bdots[3].y;
			dots[7].x = opt.bdots[3].x;
			dots[7].y = opt.bdots[0].y;
		}
		return dots;
	}
	createLineDots (opt){
		var lineDots = [];

		for(var i=0; i< opt.lineDotsPos.length; i++){
			var lineDot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			lineDot.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			lineDot.setAttribute('cx', 0);
			lineDot.setAttribute('cy', 0);
			lineDot.setAttribute('fill-opacity', 1);
			lineDot.setAttribute('r', 5);
			lineDot.setAttribute('stroke','black');
			lineDot.setAttribute('fill','yellow');
			lineDot.setAttribute('visibility','hidden'); //hidden;      
			lineDot.setAttribute('dotIndex', i);           
			lineDot.conn = '';
			lineDot.connIndex = '';
			lineDot.setAttribute('cx', opt.lineDotsPos[i].x);
			lineDot.setAttribute('cy', opt.lineDotsPos[i].y);
			lineDots.push(lineDot);  

			
		}    
		return lineDots;
	}
	setLineDots = function(opt){
		var dots = [];
		if(opt.fig == 'connector'){
			//if(opt.d == undefined) {
			//    return [];
			//}
			var dotsList = parsePath(opt.d);
			
				
			////console.log('dotsList***', dotsList);
			for(var i=0; i < dotsList.length; i++){
				var dotInfoList = parsePathDot(dotsList[i]);
				////console.log('dotInfoList', dotInfoList, dotsList[i]);
				for(var j=0; j < dotInfoList.length; j++){
					var dotInfo = dotInfoList[j];
					////console.log('dotInfo', dotInfo);
					dots.push(dotInfo);
				}
			}

			
		} /* else if(opt.tags[0].name == 'line'){
			dots.push({x:0, y:0});
			dots.push({x:0, y:0});
		} else if(opt.tags[0].name == 'path'){
			var dotsList = parsePath(opt.tags[0].d);
			////console.log('dotsList', dotsList);
			for(var i=0; i < dotsList.length; i++){
				var dotInfoList = parsePathDot(dotsList[i]);
				for(var j=0; j < dotInfoList.length; j++){
					var dotInfo = dotInfoList[j];
					////console.log('dotInfo', dotInfo);
					dots.push(dotInfo);
				}
			}
		}
		*/
		////console.log('dots((((', dots); 

		if(opt.type == 'flowline'){
			var dot0 = dots[0];
			var dot1 = dots[dots.length-1];
			dots = [];
			dots.push(dot0);
			dots.push(dot1);
			
		}
		return dots;
	}
	static createG (opt){
		var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
		g.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		g.setAttribute('base', true); 
		g.setAttribute('figid', opt.figid);
		g.setAttribute('fig', opt.fig);
		// key value를 찾아서 설정한다.
		if(opt.tagAttr != undefined){
			for(prop in opt.tagAttr){
				g.setAttribute('prop', opt.tagAttr[prop]);
			}
		}
		/*
		if(opt.baseRulerHor != undefined)
			g.setAttribute('baseRulerHor', opt.baseRulerHor);
		if(opt.baseRulerVer != undefined)
			g.setAttribute('baseRulerVer', opt.baseRulerVer);
		if(opt.centerSp != undefined)
			g.setAttribute('centerSp', opt.centerSp);
		*/
		if(opt.fixRatio != undefined)
			g.setAttribute('fixRatio', opt.fixRatio);
		if(opt.rotatable != undefined)
			g.setAttribute('rotatable', opt.rotatable);
		/*
		if(opt.seqFgAxis != undefined)
			g.setAttribute('seqFgAxis', opt.seqFgAxis);
		if(opt.baseRuler != undefined)
			g.setAttribute('baseRuler', opt.baseRuler);
		if(opt.seqFgAxis != undefined)
			g.setAttribute('seqFgAxis', opt.seqFgAxis);
		*/
		if(opt.d3 != undefined)
			g.setAttribute('d3', opt.d3);
		if(opt.groupAction != undefined)
			g.setAttribute('groupAction', opt.groupAction);
		
		//if(opt.fig == 'basic')
		//    g.setAttribute('basic', true);
		if(opt.ref != undefined)
			g.setAttribute('ref', opt.ref);

		if(opt.f != undefined)
			g.setAttribute('fill', opt.f);
		//else 
		//    g.setAttribute('fill', 'white');
		if(opt.s != undefined)
			g.setAttribute('stroke', opt.s);
		//else 
		//    g.setAttribute('stroke', 'black');
		if(opt.sw != undefined)
			g.setAttribute('stroke-width', opt.sw);
		else 
			g.setAttribute('stroke-width', 'black');
		return g;
	}
	static createRotLine (opt){
		var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		line.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		line.setAttribute('stroke', 'darkgray');
		line.setAttribute('stroke-width', 1); // 1로 설정함.
		line.setAttribute('fill', 'black');
		line.setAttribute('x1', 0);
		line.setAttribute('y1', opt.h * (-1/2));
		line.setAttribute('x2', 0);     // 수정필요.
		line.setAttribute('y2', opt.h * (-1/2)- 30); //opt.h * (-9/10));
		line.setAttribute('visibility', 'hidden');     // 수정필요.
		/*
		if(opt.rotatable != null && opt.rotatable != undefined && opt.rotatable == false){
			line.setAttribute('visibility', 'hidden'); 
		} else {
			line.setAttribute('visibility', 'visible'); 
		}
		*/
		return line;      
	}
	static createRotDot (opt){
		var dot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		dot.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		dot.setAttribute('cx', 0);
		dot.setAttribute('cy', opt.h * (-1/2)- 30);
		dot.setAttribute('fill-opacity', 1);
		dot.setAttribute('r', 5);
		dot.setAttribute('stroke','black');
		dot.setAttribute('stroke-width',1);
		dot.setAttribute('fill','yellowgreen');
		dot.setAttribute('visibility','hidden');
		/*
		if(opt.rotatable != null && opt.rotatable != undefined && opt.rotatable == false){
			dot.setAttribute('visibility', 'hidden'); 
		} else {
			dot.setAttribute('visibility', 'visible'); 
		} 
		*/   
		return dot;   
	}

	static createDots (opt, dotList){
		var dots = [];
		//console.log('dotList****', dotList);
		for(var i=0; i< dotList.length; i++){
			var dotInfo = dotList[i];
			var dot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			dot.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			dot.setAttribute('cx', dotInfo.x);    //
			dot.setAttribute('cy', dotInfo.y);    // 
			dot.setAttribute('kind', dotInfo.kind);
			dot.setAttribute('fill-opacity', 1);
			dot.setAttribute('r', 5);
			dot.setAttribute('stroke','black');
			dot.setAttribute('stroke-width',1);
			dot.setAttribute('visibility', 'hidden');
			
			if(dotInfo.role == 'm'){
				dot.setAttribute('role', 'm');
				dot.setAttribute('fill', 'blue');
				if(i == 0){
					dot.setAttribute('index', '1');
					dot.setAttribute('fill', 'green');
				}
			} else if(dotInfo.role == 's'){
				dot.setAttribute('role', 's');
				dot.setAttribute('fill', 'lightblue');
			} else {
				dot.setAttribute('role','n');
				dot.setAttribute('fill', 'yellow');        
			}
			if(dotInfo.kind == 'A1'){
				dot.setAttribute('xar', dotInfo.xar);
				dot.setAttribute('laf', dotInfo.laf);
				dot.setAttribute('sf', dotInfo.sf);            
			}

			if(dotInfo.z==true){
				dot.setAttribute('stroke','red');
				dot.setAttribute('stroke-width',4);
			}
			/*
			if(opt.hideDot != undefined && opt.hideDot == true){
				dot.setAttribute('visibility', 'hidden');     
			} else {
				dot.setAttribute('visibility', 'visible');     
			}
			*/
			dot.setAttribute('dotIndex', i); 

			if(opt.type == 'flowline'){
				if(i==0 || i == dotList.length-1){
					dot.setAttribute('visibility', 'hidden');
				}
			}
			
			///
			/*
			var dot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			dot.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			dot.setAttribute('cx', dotInfo.x);    
			dot.setAttribute('cy', dotInfo.y);    
			dot.setAttribute('kind', dotInfo.kind);
			dot.setAttribute('fill-opacity', 1);
			dot.setAttribute('r', 5);
			dot.setAttribute('stroke','black');
			dot.setAttribute('stroke-width',1);
			if(dotInfo.role == 'm'){
				dot.setAttribute('role', 'm');
				dot.setAttribute('fill', 'blue');
			} else if(dotInfo.role == 's'){
				dot.setAttribute('role', 's');
				dot.setAttribute('fill', 'lightblue');
			}
			
			if(mf.opt.hideDot != undefined && mf.opt.hideDot == true){
				dot.setAttribute('visibility', 'hidden');     
			} else {
				dot.setAttribute('visibility', 'visible');     
			}
			dot.setAttribute('dotIndex', index+(i+1));
			*/
			///
			
			dots.push(dot);      
		}    
		return dots;
	}
	static createjDots (opt){
		//console.log('opt.jd', opt.jdots);
		
		var jdots = [];
		if( opt.jdots == null){
			return [];
		}
		for(var i=0; i< opt.jdots.length; i++){
			//외부에서 바로 클래스를 따와서 이렇게 하는거 같은데
			//그냥 클래스를 따와서 하는 클래스를 만들어
			//그리고 거기다 함수를 넣는거지
			var dot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			dot.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			dot.setAttribute('cx', 0);
			dot.setAttribute('cy', 0);
			dot.setAttribute('type', 'jdot');
			dot.setAttribute('fill-opacity', 1);
			dot.setAttribute('r', 5);
			dot.setAttribute('stroke','black');
			dot.setAttribute('stroke-width',1);
			dot.setAttribute('fill','yellow');
			dot.setAttribute('visibility','hidden'); //hidden;      
			dot.setAttribute('dotIndex', i);           
			dot.conn = '';
			dot.connIndex = '';
			dot.setAttribute('cx', opt.jdots[i].x);
			dot.setAttribute('cy', opt.jdots[i].y);
			jdots.push(dot);    
		}    
		return jdots;
	}

	static createTags (opt){
		var tags = [];
		var gs = [];
		for(var i=0; i < opt.tags.length; i++){
			var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
			g.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			g.setAttribute('depth', i);
			var tagName = opt.tags[i].name;
			if(tagName == 'pie'){
				tagName = 'path';
			}
			if(tagName == 'frgn'){
				tagName = 'foreignObject';
			}
			var tag = document.createElementNS("http://www.w3.org/2000/svg", tagName); 
			tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			if(tagName == 'svg'){
				tag.innerHTML = opt.tags[i].src;
			} else if(tagName == 'foreignObject'){
				console.log('여기', tag, opt.tags[i].el)
				tag.innerHTML = opt.tags[i].el;
			}
			g.appendChild(tag)
			gs.push(g);
			tags.push(tag);
		}
		return {
			g:gs,
			tag:tags
		}
	}
	static createTag (tag){
		var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
		g.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		g.setAttribute('depth', i);
		var tag = document.createElementNS("http://www.w3.org/2000/svg", tag.name); 
		tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		g.appendChild(tag);
		g.tag = tag;
		return g;
	}
	static updateTags (fg, opt, clearCls){  // clearCls ==> false일 경우 
		/*
		while(fg.g.firstChild){
			////console.log(fg.g.tags);
			//fg.g.removeChild(fg.g.tags[0]);
			fg.g.removeChild(fg.g.lastChild);
		}
		*/

		// 연결되어 있지 않다..  
		if(clearCls != undefined && clearCls == false){
			for(var i= fg.g.jdots.length-1; i >=0; i--){
				fg.g.removeChild(fg.g.jdots[i]);
			}
			//console.log('opt.jdots**************', opt.jdots);
			if(opt.jdots != undefined){
				for(var i=0; i< opt.jdots.length; i++){
					if(opt.jdots[i].connId == undefined){
						opt.jdots[i].connId ='';//[];
					}
					if(opt.jdots[i].connIndex == undefined){
						opt.jdots[i].connIndex = '';//[];
					}
				}
				var jdots = createjDots(opt);
				// ////console.log('jdots==>', jdots);
				fg.g.jdots = jdots;
			} else {
				fg.g.jdots = [];
			}   
			for(var i=0; i < fg.g.jdots.length; i++){
				fg.g.appendChild(fg.g.jdots[i]);
			}
		} 
		//if(clearCls == undefined || clearCls == true){
			
			for(var i=0 ; i < fg.opt.tags.length; i++){
				try{
					fg.g.removeChild(fg.g.g[i]);
				}catch(e){}
			}
		//}
		fg.opt = opt;
		var tags = createTags(opt);
		/*
		for(var i=0; i < tags.g.length; i++){
			fg.g.appendChild(tags.g[i]);
		}
		*/
		for(var i=0; i < tags.g.length; i++){
			var checked = false;
			if(opt.tags[i].plyname != undefined && opt.tags[i].plyname != null && opt.tags[i].plyname != ''){
				for(var j= i-1; j >=0;j--){
					if(opt.tags[i].plyname == opt.tags[j].lyname){
						//console.log(i, j, tags.g);
						tags.g[j].appendChild(tags.g[i]);
						checked = true;
						break;
					}
				}
			}
			if(checked == false){
				fg.g.appendChild(tags.g[i]);
			}
		}
		fg.g.tags = tags.tag;
		fg.g.g = tags.g;    
	}
	static createPathBasic (){
		var path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
		path.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		return path;    
	}
	static createLineTags (opt){
		var hTag = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
		hTag.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

		var path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
		path.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

		var tags = [];
		if(opt.tags != undefined ){
			for(var i=0; i < opt.tags.length; i++){
				var tag = document.createElementNS("http://www.w3.org/2000/svg", opt.tags[i].name); 
				tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
				tags.push(tag);
			}
		}
		return {
			hTags:[hTag],
			path:path,
			tags:tags
		}
	}
	static createTxt(opt){
		var txt = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		txt.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		txt.setAttribute('dominant-baseline', 'baseline');
		//text.setAttribute('alignment-baseline', 'baseline');
		txt.setAttribute('x', opt.w/(-2));
		txt.setAttribute('y', opt.h/(-2));
		txt.setAttribute('width', opt.w);
		txt.setAttribute('height', opt.h);
		txt.textContent = opt.txt;
		setAttribute(txt, 'font-size', opt.fs);
		setAttribute(txt, 'font-color', opt.fc);
		setAttribute(txt, 'font-family', opt.ff);
		return txt;   
	}
	static createImg (opt){
		if(opt.src == null || opt.src == undefined || opt.src == ''){
			return null;
		}
		var img = document.createElementNS("http://www.w3.org/2000/svg", "image"); 
		img.setAttribute('xmlns', 'http://www.w3.org/2000/svg');  
		img.setAttribute('version', '1.1');
		img.setAttribute('preserveAspectRatio', 'none');
		img.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',  opt.src);
		img.setAttribute('x', opt.w/2 * (-1) + 'px');
		img.setAttribute('y', opt.h/2 * (-1) + 'px');
		img.setAttribute('width', opt.w + 'px');
		img.setAttribute('height', opt.h + 'px');    
		img.setAttribute('viewBox', '0 0 ' + opt.w + ' ' + opt.h);    
		return img;
	}
	static setGaussianBlur (fg){
		if(options.gaussianBlurStdDeviation != null && options.gaussianBlurStdDeviation != undefined && options.gaussianBlurStdDeviation != ''){
			var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", 'feGaussianBlur');
			feGaussianBlur.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			feGaussianBlur.setAttribute('filterKind', 'gaussianBlur');
			if(options.filterImage != null && options.filterImage != undefined && options.filterImage != ''){
				feGaussianBlur.setAttribute('in', 'imageBlend');
			} else {
				feGaussianBlur.setAttribute('in', 'SourceGraphic');
			}
			if(options.gaussianBlurStdDeviation == null){
				//document.getElementById('gaussianBlurStdDeviation').value = 4;
				feGaussianBlur.setAttribute('stdDeviation', 4);
			} else {
				feGaussianBlur.setAttribute('stdDeviation', options.gaussianBlurStdDeviation); 
			}
			feGaussianBlur.setAttribute('result', 'blurOut');
			filter.appendChild(feGaussianBlur);
		} 
	}
	static setShadow (fg){
		if(fg.g.defs == undefined){
			var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
			defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			fg.g.appendChild(defs);
			fg.g.defs = defs;
		}

		

		if( (fg.opt.shadx != null && fg.opt.shadx != undefined && fg.opt.shadx != '') ||
			(fg.opt.shady != null && fg.opt.shady != undefined && fg.opt.shady != '') ||
			(fg.opt.shadw != null && fg.opt.shadw != undefined && fg.opt.shadw != '')){
			var filter = document.createElementNS("http://www.w3.org/2000/svg", 'filter');
			filter.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			filter.setAttribute('id', 'filter' + fg.opt.figid);
			
			var feOffset = document.createElementNS("http://www.w3.org/2000/svg", 'feOffset');
			feOffset.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			feOffset.setAttribute('filterKind', 'shadow');
			feOffset.setAttribute('in', 'SourceAlpha');
			feOffset.setAttribute('dx', fg.opt.shadx);
			feOffset.setAttribute('dy', fg.opt.shady);
			feOffset.setAttribute('result', 'offOut');
			
			var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", 'feGaussianBlur');
			feGaussianBlur.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			feGaussianBlur.setAttribute('filterKind', 'shadow');
			feGaussianBlur.setAttribute('in', 'offOut');
			feGaussianBlur.setAttribute('stdDeviation', fg.opt.shadw);
			feGaussianBlur.setAttribute('result', 'blurOut');
			
			var feBlend = document.createElementNS("http://www.w3.org/2000/svg", 'feBlend');
			feBlend.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
			feBlend.setAttribute('filterKind', 'shadow');
			//if(imageCls == true){
			//    feBlend.setAttribute('in', 'imageBlend');
			//} else {
				feBlend.setAttribute('in', 'SourceGraphic');
			//}
			feBlend.setAttribute('in2', 'blurOut');
			feBlend.setAttribute('mode', 'normal');
			filter.appendChild(feOffset);
			filter.appendChild(feGaussianBlur);
			filter.appendChild(feBlend);   
			fg.g.defs.appendChild(filter);
		}
	}
	static createDomsPttsGrds ( figid, ptts, grds){
		var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
		defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		/*
		for(var i=0; ptts != undefined && i< ptts.length; i++){
			var p = document.createElementNS("http://www.w3.org/2000/svg", 'pattern');
			//p.setAttribute('type', ptts.name);
			p.setAttribute('id', 'ptt-' + figid + '_' + ptts[i].pttid);
			p.setAttribute('x', ptts[i].pttx);
			p.setAttribute('y', ptts[i].ptty);
			p.setAttribute('defType', 'ptt');
			p.setAttribute('width', ptts[i].pttw);
			p.setAttribute('height', ptts[i].ptth);
			p.setAttribute('patternUnits','userSpaceOnUse'); 
			
			for(var j=0; j < ptts[i].tags.length; j++){
				var tagInfo =ptts[i].tags[j];
				if(tagInfo.name == 'path'){
					var tag = document.createElementNS("http://www.w3.org/2000/svg", 'path');
					tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
					tag.setAttribute('defsType', 'ptt');
					//tag.setAttribute('id', 'pat_tag_' + fg.opt.figid + '_' + j);
					tag.setAttribute('fill', tagInfo.f);
					tag.setAttribute('stroke', tagInfo.s);
					tag.setAttribute('stroke-width', tagInfo.sw);
					tag.setAttribute('d', tagInfo.d);
					p.appendChild(tag);
				} else if(tagInfo.name == 'circle'){
					var tag = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
					tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
					//tag.setAttribute('id', 'pat_tag_' + fg.opt.figid + '_' + j);
					tag.setAttribute('fill', tagInfo.f);
					tag.setAttribute('stroke', tagInfo.s);
					tag.setAttribute('stroke-width', tagInfo.sw);
					tag.setAttribute('cx', tagInfo.cx);
					tag.setAttribute('cy', tagInfo.cy);
					tag.setAttribute('r', tagInfo.r);
					p.appendChild(tag);
				}
			}
			defs.appendChild(p);
		}
		*/
		// gradients
		for(var i=0; grds != undefined && i< grds.length; i++){
			if(grds[i].name == 'linear'){
				var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
				//p.setAttribute('type', ptts.name);
				grad.setAttribute('id', 'grd-' + figid + '_' + grds[i].grdid);
				grad.setAttribute('defType', 'grd');
				grad.setAttribute('x1', grds[i].x1 + '%');
				grad.setAttribute('y1', grds[i].y1 + '%');
				grad.setAttribute('x2', grds[i].x2 + '%');
				grad.setAttribute('y2', grds[i].y2 + '%');

				for(var j=0; j < grds[i].stops.length; j++ ){
					var stopInfo =grds[i].stops[j];
					var stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop.setAttribute('offset', stopInfo.off + '%');
					stop.setAttribute('style', 'stop-color:' + stopInfo.c + ';stop-opacity:' + stopInfo.o);
					grad.appendChild(stop);
				} 
				defs.appendChild(grad);
			} else if(grds[i].name == 'radial'){
				var grad = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradient');
				grad.setAttribute('id', 'grd-' + figid + '_' + grds[i].grdid);
				grad.setAttribute('cx', grds[i].cx + '%');
				grad.setAttribute('cy', grds[i].cy + '%');
				grad.setAttribute('fx', grds[i].fx + '%');
				grad.setAttribute('fy', grds[i].fy + '%');
				grad.setAttribute('r',  grds[i].r + '%');

				for(var j=0; j < grds[i].stops.length; j++ ){
					var stopInfo =grds[i].stops[j];
					var stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop.setAttribute('offset', stopInfo.off + '%');
					stop.setAttribute('style', 'stop-color:' + stopInfo.c + ';stop-opacity:' + stopInfo.o);
					grad.appendChild(stop);
				} 
				defs.appendChild(grad); 
			}
		}
		return defs;
	}
	/*
	setGuageGradient = function(fg, grds){
		var gradient = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
		gradient.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
		gradient.setAttribute('filterKind', 'gradient');
		gradient.setAttribute('gradientKind', 'guage');
		gradient.setAttribute('id', 'gradientGuage' + fg.options.figureId);   
	}
	*/
	static setPatterns (fg, ptts){
		return;
		if(fg.g.defs == undefined){
			var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
			defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			fg.g.appendChild(defs);
			fg.g.defs = defs;
		}
		var pttBfs = fg.g.defs.querySelectorAll('[defType=ptt]');
		//console.log('pttBfs', pttBfs);
		if(pttBfs != null){
			for(var i = pttBfs.length-1; i>=0; i--){
				fg.g.defs.removeChild(pttBfs[i]);
			}
		}

		for(var i=0; i< ptts.length; i++){
			var p = document.createElementNS("http://www.w3.org/2000/svg", 'pattern');
			//p.setAttribute('type', ptts.name);
			p.setAttribute('id', 'ptt-' + fg.opt.figid + '_' + ptts[i].pttid);
			p.setAttribute('x', ptts[i].pttx);
			p.setAttribute('y', ptts[i].ptty);
			p.setAttribute('defType', 'ptt');
			p.setAttribute('width', ptts[i].pttw);
			p.setAttribute('height', ptts[i].ptth);
			p.setAttribute('patternUnits','userSpaceOnUse'); 
			
			for(var j=0; j < ptts[i].tags.length; j++){
				var tagInfo =ptts[i].tags[j];
				if(tagInfo.name == 'path'){
					var tag = document.createElementNS("http://www.w3.org/2000/svg", 'path');
					tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
					tag.setAttribute('defsType', 'ptt');
					//tag.setAttribute('id', 'pat_tag_' + fg.opt.figid + '_' + j);
					tag.setAttribute('fill', tagInfo.f);
					tag.setAttribute('stroke', tagInfo.s);
					tag.setAttribute('stroke-width', tagInfo.sw);
					tag.setAttribute('d', tagInfo.d);
					p.appendChild(tag);
				} else if(tagInfo.name == 'circle'){
					var tag = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
					tag.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
					//tag.setAttribute('id', 'pat_tag_' + fg.opt.figid + '_' + j);
					tag.setAttribute('fill', tagInfo.f);
					tag.setAttribute('stroke', tagInfo.s);
					tag.setAttribute('stroke-width', tagInfo.sw);
					tag.setAttribute('cx', tagInfo.cx);
					tag.setAttribute('cy', tagInfo.cy);
					tag.setAttribute('r', tagInfo.r);
					
					p.appendChild(tag);
				}
			}
			fg.g.defs.appendChild(p);
		}
	}
	static setGaugeGrd (fg){
		for(var index=0; index < fg.opt.anims.length; index++){
			for(var i=0; i < fg.g.g.length; i++){
				if(fg.opt.anims[index].lyname == fg.opt.g.g[i].lyname){
					if(fg.g.g[i].defs == undefined){
						var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
						defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
						fg.g.g[i].appendChild(defs);
						fg.g.g[i].defs = defs;
					}
					var grdBfs = fg.g.g[i].defs.querySelectorAll('[defType=guage]');
					if(grdBfs != null){
						for(var j = grdBfs.length-1; j>=0; j--){
							fg.g.g[i].defs.removeChild(grdBfs[j]);
						}
					}
					var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
					//p.setAttribute('type', ptts.name);
					grad.setAttribute('id', 'guage_' + fg.opt.figid + '_' + fg.opt.tags[i].lyname); // + '_' + tagCount);
					grad.setAttribute('defType', 'guage');
					grad.setAttribute('x1', '100%');
					grad.setAttribute('y1', '100%');
					grad.setAttribute('x2', '100%');
					grad.setAttribute('y2', '0%');

					if(fg.opt.tags[i].o == undefined){
						fg.opt.tags[i].o = '1';
					}
					var stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop1.setAttribute('offset', '0%');
					stop1.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
					grad.appendChild(stop1);

					var stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop2.setAttribute('offset', '70%');
					stop2.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
					var animate2 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
					animate2.setAttribute('attributeName', 'offset');
					animate2.setAttribute('values', '0;0.7');
					animate2.setAttribute('dur', anim.dur + 's');
					animate2.setAttribute('repeatCount', '1');
					animate2.setAttribute('fill', 'freeze');
					stop2.appendChild(animate2);
					grad.appendChild(stop2);

					var stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop3.setAttribute('offset', '70%');
					stop3.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
					var animate3 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
					animate3.setAttribute('attributeName', 'offset');
					animate3.setAttribute('values', '0;0.7');
					animate3.setAttribute('dur', anim.dur + 's');
					animate3.setAttribute('repeatCount', '1');
					animate3.setAttribute('fill', 'freeze');
					stop3.appendChild(animate3);
					grad.appendChild(stop3);

					var stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop4.setAttribute('offset', '100%');
					stop4.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
					grad.appendChild(stop4);

				
					fg.g.g[i].defs.appendChild(grad);
					fg.g.g[i].setAttribute('fill', 'url(#' + 'guage_' + fg.opt.figid + '_' + fg.opt.tags[i].lyname);// + '_' + tagCount);
	
				}
			}
		}
	}
	static setGradients (fg, grds){
		if(fg.g.defs == undefined){
			var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
			defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			fg.g.appendChild(defs);
			fg.g.defs = defs;
		}
		var grdBfs = fg.g.defs.querySelectorAll('[defType=grd]');
		if(grdBfs != null){
			for(var i = grdBfs.length-1; i>=0; i--){
				fg.g.defs.removeChild(grdBfs[i]);
			}
		}
		//console.log('grds', grds);
		for(var i=0; i< grds.length; i++){
			if(grds[i].name == 'linear' && grds[i].type == 'guage'){
				var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
				//p.setAttribute('type', ptts.name);
				grad.setAttribute('id', 'grd-' + fg.opt.figid + '_' + grds[i].grdid);
				grad.setAttribute('defType', 'grd');
				grad.setAttribute('x1', '100%');
				grad.setAttribute('y1', '100%');
				grad.setAttribute('x2', '100%');
				grad.setAttribute('y2', '0%');

				for(var j=0; j < grds[i].stops.length; j++ ){
					var stopInfo =grds[i].stops[j];
					var stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop.setAttribute('offset', stopInfo.off + '%');
					stop.setAttribute('style', 'stop-color:' + stopInfo.c + ';stop-opacity:' + stopInfo.o);
					grad.appendChild(stop);
				} 
				fg.g.defs.appendChild(grad);
			} else if(grds[i].name == 'linear'){
				var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
				//p.setAttribute('type', ptts.name);
				grad.setAttribute('id', 'grd-' + fg.opt.figid + '_' + grds[i].grdid);
				grad.setAttribute('defType', 'grd');
				grad.setAttribute('x1', grds[i].x1 + '%');
				grad.setAttribute('y1', grds[i].y1 + '%');
				grad.setAttribute('x2', grds[i].x2 + '%');
				grad.setAttribute('y2', grds[i].y2 + '%');

				for(var j=0; j < grds[i].stops.length; j++ ){
					var stopInfo =grds[i].stops[j];
					var stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop.setAttribute('offset', stopInfo.off + '%');
					stop.setAttribute('style', 'stop-color:' + stopInfo.c + ';stop-opacity:' + stopInfo.o);
					grad.appendChild(stop);
				} 
				fg.g.defs.appendChild(grad);
			} else if(grds[i].name == 'radial'){
				var grad = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradient');
				//p.setAttribute('type', ptts.name);
				grad.setAttribute('id', 'grd-' + fg.opt.figid + '_' + grds[i].grdid);
				grad.setAttribute('defType', 'grd');
				grad.setAttribute('cx', grds[i].cx + '%');
				grad.setAttribute('cy', grds[i].cy + '%');
				grad.setAttribute('fx', grds[i].fx + '%');
				grad.setAttribute('fy', grds[i].fy + '%');
				grad.setAttribute('r',  grds[i].r + '%');

				for(var j=0; j < grds[i].stops.length; j++ ){
					var stopInfo =grds[i].stops[j];
					var stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
					stop.setAttribute('offset', stopInfo.off + '%');
					stop.setAttribute('style', 'stop-color:' + stopInfo.c + ';stop-opacity:' + stopInfo.o);
					grad.appendChild(stop);
				} 
				fg.g.defs.appendChild(grad); 
			}
		}
	}



	static getPosCalcLoop(parentFg, fgJDots){
		var parentFg1 = parentFg;
		for(var i=0; i< fgJDots.length; i++){
			var rotTemp = getRotatePos(parentFg1.opt.ro, fgJDots[i].x , fgJDots[i].y);
			fgJDots[i].x = rotTemp.x;
			fgJDots[i].y = rotTemp.y;
			fgJDots[i].x = parentFg1.get('x') + fgJDots[i].x;
			fgJDots[i].y = parentFg1.get('y') + fgJDots[i].y;
		}
	}

	static getParentAllRotate (fg){
		let ro = 0;//fg.opt.ro;
		let parentFg = getParentFg(fg);
		if(parentFg != null){
			ro = ro + parentFg.opt.ro;
		}
		for(let i=0; i <100; i++){
			parentFg = getParentFg(parentFg);            
			if(parentFg != null){
				ro = ro + parentFg.opt.ro;
			} else {
				break;
			}
			if(i==99){
				alert('그룹핑은 99단계까지만 가능합니다.')
			}
		}
		return ro;
	}

	static getPosCalcIndex (fg, connector, index){
		var fgJDot = {x:0, y:0};
		// 한개만 선택해서 계산.-------------
		/*
		fgJDot.x = fg.opt.jdots[index].x/100 * fg.opt.w;
		fgJDot.y = fg.opt.jdots[index].y/100 * fg.opt.h;
		
		var rotTemp = getRotatePos(fg.opt.ro, fgJDot.x , fgJDot.y);
		fgJDot.x = rotTemp.x;
		fgJDot.y = rotTemp.y;
		fgJDot.x = fg.get('x') + fgJDot.x;
		fgJDot.y = fg.get('y') + fgJDot.y;
		return fgJDot;  
		*/
		var fgJDots = [];
		//console.log('getPosCalcOnly-----------', fg);
		var ro = 0;
		if(fg.opt.ro != undefined){
			ro = fg.opt.ro;
		}
		//console.log('ro----------', ro);
		for(var i=0; i< fg.opt.jdots.length; i++ ){
			fgJDots[i] = {x:0, y:0};
			fgJDots[i].x = fg.opt.jdots[i].x /100 * fg.opt.w;
			fgJDots[i].y = fg.opt.jdots[i].y /100 * fg.opt.h;
		}
		fgJDot = getRotatePosLoop(fg, connector, fgJDots);
		return fgJDot[index];
	}
	static getRotatePosLoop (fg, connector, fgJDots){    
		console.log('fgJDots', fgJDots)
		console.log('fgJDots', fg.opt.jdots)
		for(var i=0; i< fg.opt.jdots.length; i++ ){
			console.log('i',i)
			var rotTemp = getRotatePos(fg.opt.ro, fgJDots[i].x , fgJDots[i].y);
			fgJDots[i].x = rotTemp.x;
			fgJDots[i].y = rotTemp.y;
			fgJDots[i].x = fg.get('x') + fgJDots[i].x;
			fgJDots[i].y = fg.get('y') + fgJDots[i].y;
		}

		let parentFg = getParentFg(fg);
		let parentConnectorFg = getParentFg(connector);
		if(parentFg != null && parentFg !== parentConnectorFg){
			fgJDots = getRotatePosLoop(parentFg, connector, fgJDots);
		}
		return fgJDots;
	}

	/*
		// 처리해야함..
		if(fg.parentFg != undefined && fg.parentFg != null){
			var parentFg1 = fg.parentFg;
			var ro1 = 0;
			if(parentFg1.opt.ro != undefined){
				ro1 = parentFg1.opt.ro;
			}
			for(var i=0; i< fgJDots.length; i++){
				fgJDots[i]= getRotatePos(ro1, fgJDots[i].x , fgJDots[i].y);
				fgJDots[i].x = parentFg1.get('x') + fgJDots[i].x;
				fgJDots[i].y = parentFg1.get('y') + fgJDots[i].y;
			}
			//console.log('ro1------------', ro1, fgJDots[i].x, fgJDots[i].y);
			if(parentFg1.parentFg != null){
				var parentFg2 = parentFg1.parentFg;
				var ro2 = 0;
				if(parentFg2.opt.ro != undefined){
					ro2 = parentFg2.opt.ro;
				}
				console.log('ro2----------', ro2);
				for(var i=0; i< fgJDots.length; i++){

					fgJDots[i]= getRotatePos(ro2, fgJDots[i].x , fgJDots[i].y);
					fgJDots[i].x = parentFg2.get('x') + fgJDots[i].x;
					fgJDots[i].y = parentFg2.get('y') + fgJDots[i].y;
				}
				if(parentFg2.parentFg != null){
					var parentFg3 = parentFg2.parentFg;
					var ro3 = 0;
					if(parentFg3.opt.ro != undefined){
						ro3 = parentFg3.opt.ro;
					}
					for(var i=0; i< fgJDots.length; i++){
						fgJDots[i]= getRotatePos(ro3, fgJDots[i].x , fgJDots[i].y);
						fgJDots[i].x = parentFg3.get('x') + fgJDots[i].x;
						fgJDots[i].y = parentFg3.get('y') + fgJDots[i].y;
					}
					if(parentFg3.parentFg != null){
						var parentFg4 = parentFg3.parentFg;
						var ro4 = 0;
						if(parentFg4.opt.ro != undefined){
							ro4 = parentFg4.opt.ro;
						}
						for(var i=0; i< fgJDots.length; i++){
							fgJDots[i]= getRotatePos(ro4, fgJDots[i].x , fgJDots[i].y);
							fgJDots[i].x = parentFg4.get('x') + fgJDots[i].x;
							fgJDots[i].y = parentFg4.get('y') + fgJDots[i].y;
						}
						if(parentFg4.parentFg != null){
							var parentFg5 = parentFg4.parentFg;
							var ro5 = 0;
							if(parentFg5.opt.ro != undefined){
								ro5 = parentFg5.opt.ro;
							}
							for(var i=0; i< fgJDots.length; i++){
								fgJDots[i]= getRotatePos(ro5, fgJDots[i].x , fgJDots[i].y);
								fgJDots[i].x = parentFg5.get('x') + fgJDots[i].x;
								fgJDots[i].y = parentFg5.get('y') + fgJDots[i].y;
							}
							if(parentFg5.parentFg != null){
								var parentFg6 = parentFg5.parentFg;
								var ro6 = 0;
								if(parentFg6.opt.ro != undefined){
									ro6 = parentFg6.opt.ro;
								}
								for(var i=0; i< fgJDots.length; i++){
									fgJDots[i]= getRotatePos(ro6, fgJDots[i].x , fgJDots[i].y);
									fgJDots[i].x = parentFg6.get('x') + fgJDots[i].x;
									fgJDots[i].y = parentFg6.get('y') + fgJDots[i].y;
								}
								if(parentFg6.parentFg != null){
									var parentFg7 = parentFg6.parentFg;
									var ro7 = 0;
									if(parentFg7.opt.ro != undefined){
										ro7 = parentFg7.opt.ro;
									}
									for(var i=0; i< fgJDots.length; i++){
										fgJDots[i]= getRotatePos(ro7, fgJDots[i].x , fgJDots[i].y);
										fgJDots[i].x = parentFg7.get('x') + fgJDots[i].x;
										fgJDots[i].y = parentFg7.get('y') + fgJDots[i].y;
									}
									if(parentFg7.parentFg != null){
										var parentFg8 = parentFg7.parentFg;
										var ro8 = 0;
										if(parentFg8.opt.ro != undefined){
											ro8 = parentFg8.opt.ro;
										}
										for(var i=0; i< fgJDots.length; i++){
											fgJDots[i]= getRotatePos(ro8, fgJDots[i].x , fgJDots[i].y);
											fgJDots[i].x = parentFg8.get('x') + fgJDots[i].x;
											fgJDots[i].y = parentFg8.get('y') + fgJDots[i].y;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		// ////console.log('fgJDots**********', fgJDots);
		return fgJDots;
	}
	*/

	static getPosCalcOnly (fg, fgJDots){
		//var fgJDots = [];
		if(fgJDots == null){
			fgJDots = [];
			for(var i=0; i< fg.opt.jdots.length; i++ ){
				fgJDots[i] = {x:0, y:0};
				fgJDots[i].x = fg.opt.jdots[i].x /100 * fg.opt.w;
				fgJDots[i].y = fg.opt.jdots[i].y /100 * fg.opt.h;
			}    
		}
		console.log('getPosCalcOnly', fgJDots);
		let ro = fg.opt.ro;
		for(var i=0; i< fg.opt.jdots.length; i++ ){
			var rotTemp = getRotatePos(ro, fgJDots[i].x , fgJDots[i].y);
			fgJDots[i].x = rotTemp.x;
			fgJDots[i].y = rotTemp.y;
			fgJDots[i].x = fg.get('x') + fgJDots[i].x;
			fgJDots[i].y = fg.get('y') + fgJDots[i].y;
		}

		let parentFg = getParentFg(fg);
		if(parentFg != null){
			fgJDots = getPosCalcOnly(parentFg, fgJDots);
		}
		return fgJDots;
	}
	/*
		if(fg.parentFg != undefined && fg.parentFg != null){
			var parentFg1 = fg.parentFg;
			var ro1 = 0;
			if(parentFg1.opt.ro != undefined){
				ro1 = parentFg1.opt.ro;
			}
			for(var i=0; i< fgJDots.length; i++){
				fgJDots[i]= getRotatePos(ro1, fgJDots[i].x , fgJDots[i].y);
				fgJDots[i].x = parentFg1.get('x') + fgJDots[i].x;
				fgJDots[i].y = parentFg1.get('y') + fgJDots[i].y;
			}
			if(parentFg1.parentFg != null){
				var parentFg2 = parentFg1.parentFg;
				var ro2 = 0;
				if(parentFg2.opt.ro != undefined){
					ro2 = parentFg2.opt.ro;
				}
				for(var i=0; i< fgJDots.length; i++){

					fgJDots[i]= getRotatePos(ro2, fgJDots[i].x , fgJDots[i].y);
					fgJDots[i].x = parentFg2.get('x') + fgJDots[i].x;
					fgJDots[i].y = parentFg2.get('y') + fgJDots[i].y;
				}
				if(parentFg2.parentFg != null){
					var parentFg3 = parentFg2.parentFg;
					var ro3 = 0;
					if(parentFg3.opt.ro != undefined){
						ro3 = parentFg3.opt.ro;
					}
					for(var i=0; i< fgJDots.length; i++){
						fgJDots[i]= getRotatePos(ro3, fgJDots[i].x , fgJDots[i].y);
						fgJDots[i].x = parentFg3.get('x') + fgJDots[i].x;
						fgJDots[i].y = parentFg3.get('y') + fgJDots[i].y;
					}
					if(parentFg3.parentFg != null){
						var parentFg4 = parentFg3.parentFg;
						var ro4 = 0;
						if(parentFg4.opt.ro != undefined){
							ro4 = parentFg4.opt.ro;
						}
						for(var i=0; i< fgJDots.length; i++){
							fgJDots[i]= getRotatePos(ro4, fgJDots[i].x , fgJDots[i].y);
							fgJDots[i].x = parentFg4.get('x') + fgJDots[i].x;
							fgJDots[i].y = parentFg4.get('y') + fgJDots[i].y;
						}
						if(parentFg4.parentFg != null){
							var parentFg5 = parentFg4.parentFg;
							var ro5 = 0;
							if(parentFg5.opt.ro != undefined){
								ro5 = parentFg5.opt.ro;
							}
							for(var i=0; i< fgJDots.length; i++){
								fgJDots[i]= getRotatePos(ro5, fgJDots[i].x , fgJDots[i].y);
								fgJDots[i].x = parentFg5.get('x') + fgJDots[i].x;
								fgJDots[i].y = parentFg5.get('y') + fgJDots[i].y;
							}
							if(parentFg5.parentFg != null){
								var parentFg6 = parentFg5.parentFg;
								var ro6 = 0;
								if(parentFg6.opt.ro != undefined){
									ro6 = parentFg6.opt.ro;
								}
								for(var i=0; i< fgJDots.length; i++){
									fgJDots[i]= getRotatePos(ro6, fgJDots[i].x , fgJDots[i].y);
									fgJDots[i].x = parentFg6.get('x') + fgJDots[i].x;
									fgJDots[i].y = parentFg6.get('y') + fgJDots[i].y;
								}
								if(parentFg6.parentFg != null){
									var parentFg7 = parentFg6.parentFg;
									var ro7 = 0;
									if(parentFg7.opt.ro != undefined){
										ro7 = parentFg7.opt.ro;
									}
									for(var i=0; i< fgJDots.length; i++){
										fgJDots[i]= getRotatePos(ro7, fgJDots[i].x , fgJDots[i].y);
										fgJDots[i].x = parentFg7.get('x') + fgJDots[i].x;
										fgJDots[i].y = parentFg7.get('y') + fgJDots[i].y;
									}
									if(parentFg7.parentFg != null){
										var parentFg8 = parentFg7.parentFg;
										var ro8 = 0;
										if(parentFg8.opt.ro != undefined){
											ro8 = parentFg8.opt.ro;
										}
										for(var i=0; i< fgJDots.length; i++){
											fgJDots[i]= getRotatePos(ro8, fgJDots[i].x , fgJDots[i].y);
											fgJDots[i].x = parentFg8.get('x') + fgJDots[i].x;
											fgJDots[i].y = parentFg8.get('y') + fgJDots[i].y;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		// ////console.log('fgJDots**********', fgJDots);
		return fgJDots;
	}
	*/

	static getPosArea (fg){
		var ro = 0;
		if(fg.opt.ro != undefined){
			ro = fg.opt.ro;
		}
		if(fg.opt.jdots == undefined){
			return {
				left:0,
				right:0,
				top:0,
				bottom:0
			};
		}
		let fgJDots = [];
		for(var i=0; i< fg.opt.jdots.length; i++ ){
			fgJDots[i] = {x:0, y:0};
			fgJDots[i].x = fg.opt.jdots[i].x /100 * fg.opt.w;
			fgJDots[i].y = fg.opt.jdots[i].y /100 * fg.opt.h;
		}
		console.log('fgJDots-->', fgJDots);
		fgJDots = getPosCalcOnly(fg, fgJDots);
		var left = 0;
		var right = 0;
		var top = 0;
		var bottom = 0;    
		left = fg.opt.w/(-2) + fg.opt.x;
		right = fg.opt.w/(2) + fg.opt.x;
		top = fg.opt.h/(-2) + fg.opt.y;
		bottom = fg.opt.h/(2) + fg.opt.y;
		console.log('fgJDots', fgJDots);
		for(var i=0; i< fgJDots.length; i++){
			//if(i==0){
			//    left = fgJDots[i].x;
			//    right = fgJDots[i].x;
			//    top = fgJDots[i].y;
			//    bottom = fgJDots[i].y;
			//} else 
			{
				if(left > fgJDots[i].x){
					left = fgJDots[i].x;
				}
				if(right <fgJDots[i].x){
					right = fgJDots[i].x;
				}
				if(top > fgJDots[i].y){
					top = fgJDots[i].y;
				}
				if(bottom < fgJDots[i].y){
					bottom = fgJDots[i].y;
				}
			}
		} 
		return {
			left:left,
			right:right,
			top:top,
			bottom:bottom
		};
	}
	static getGroupPosArea (fg){
		var left = 0;
		var right = 0;
		var top = 0;
		var bottom = 0;

		let childFgs = getChildFg(fg);
		// ////console.log('fg.childFg', fg.childFg);
		for(var i=0; i < childFgs.length; i++){
			if(childFgs[i].opt.ro == null){
				childFgs[i].opt.ro = 0;
			}
			if(childFgs[i].opt.fig != 'basic'){
				continue;
			}
			console.log(i, childFgs[i].opt.jdots);
			if(childFgs[i].opt.jdots == null){
				return {
					left:0,
					right:0,
					top:0,
					bottom:0
				};
			}
			var fgJDots = getPosCalcOnly(childFgs[i]);
			// ////console.log('fgJDots********************', fgJDots);
			for(var j=0; j< fgJDots.length; j++){
				if(i==0 && j==0){
					left = fgJDots[j].x;
					right = fgJDots[j].x;
					top = fgJDots[j].y;
					bottom = fgJDots[j].y;
				} else {
					if(left > fgJDots[j].x){
						left = fgJDots[j].x;
					}
					if(right <fgJDots[j].x){
						right = fgJDots[j].x;
					}
					if(top > fgJDots[j].y){
						top = fgJDots[j].y;
					}
					if(bottom < fgJDots[j].y){
						bottom = fgJDots[j].y;
					}
				}
			} 
		}
		return {
			left:left,
			right:right,
			top:top,
			bottom:bottom
		};
	}
	static getPosCalc (fg, x, y){
		//console.log('getPosCalc>>>>>>>>>>>>>>>>>', fg, x, y)
		if(fg != undefined){
			if(fg.opt.type != undefined && fg.opt.type == 'trro'){
				return;
			}
		}
		var ro = 0;
		if(fg.opt.ro != undefined){
			ro = fg.opt.ro;
		}
		if(fg.opt.jdots == undefined){
			/*
			return {
				left:0,
				right:0,
				top:0,
				bottom:0
			};
			*/
			return null;
		}
		let fgJDots = [];
		for(var i=0; i< fg.opt.jdots.length; i++ ){
			fgJDots[i] = {x:0, y:0};
			fgJDots[i].x = fg.opt.jdots[i].x /100 * fg.opt.w;
			fgJDots[i].y = fg.opt.jdots[i].y /100 * fg.opt.h;
		}
		fgJDots = getPosCalcOnly(fg, fgJDots);
		//console.log('getPosCalc-fgJDots', fgJDots);
		var index = -1;
		var minIndex= -1, minX=0, minY=0;
		var minDistance = 0;
		for(var i=0; i< fgJDots.length; i++){
			if(i==0){
				minIndex = 0;
				minX = fgJDots[i].x;
				minY = fgJDots[i].y;
				minDistance = Math.sqrt( (fgJDots[i].x - Number(x)) * (fgJDots[i].x - Number(x)) + 
							(fgJDots[i].y - Number(y)) * (fgJDots[i].y - Number(y))); 
			} else {
				var dist= Math.sqrt( (fgJDots[i].x - Number(x)) * (fgJDots[i].x - Number(x)) + 
							(fgJDots[i].y - Number(y)) * (fgJDots[i].y - Number(y))); 
				if( dist < minDistance ){
					minDistance = dist;
					minIndex = i;
					minX = fgJDots[i].x;
					minY = fgJDots[i].y;
				}
			}
		}
		//console.log('getPosCalc', minDistance, minIndex, minX, minY);
		if(minIndex != -1 && minDistance < 20){
			fg.showjDots();
			return {
				index:minIndex,
				x:minX,
				y:minY
			};
		}
		return null;
	}
	static getRadianByPos (x1, y1, x2, y2){
		var width = (x2 - x1);
		var height = (y1- y2);
		
		var r = Math.acos(height/ Math.sqrt(width * width + height * height)); 
		if(width < 0){
			r = r * (-1);
		}
		return r;
	}
	static getAngleByPos (x1, y1, x2, y2){
		var width = (x2 - x1);
		var height = (y1- y2);
		console.log('width', width, height);
		var r = Math.acos(height/ Math.sqrt(width * width + height * height)); 
		if(width == 0 && height ==0){
			r=0;
		}
		if(width < 0){
			r = r * (-1);
		}
		return r * 180/Math.PI;
	}
	static getRadianToAngle (radian){
		return radian * 180/Math.PI;
	}
	static getAngleToRadian (angle){
		return angle * Math.PI/180;
	}
	static getRotatePos (rotate, cx, cy){
		let th =  rotate * Math.PI/180;
		var rcx = Number(cx * Math.cos(th)) - Number(cy * Math.sin(th));
		var rcy = Number(cx * Math.sin(th)) + Number(cy * Math.cos(th));
		return {
			x:rcx,
			y:rcy
		}
	}
	static getRetroRotatePos (rotate, cx, cy){
		let th =  rotate * Math.PI/180;
		var rcx = Number(cx * Math.cos(th)) + Number(cy * Math.sin(th));
		var rcy = Number(-1 * cx * Math.sin(th)) + Number(cy * Math.cos(th));
		return {
			x:rcx,
			y:rcy
		}
	}
	static getRetroParentXY (fg, offsetX, offsetY, pSed){
		let parentArray = [];
		let parentFg = null;
		for(let i=0; i <100; i++){
			if(i ==0){
				parentFg = getParentFg(fg);
			} else {
				parentFg = getParentFg(parentFg);
			}
			if(parentFg == null){
				break;
			} else {
				parentArray.push(parentFg);
			}
			if(i == 99){
				alert('그룹을 100회이상 하실 수 없습니다.');
				return;
			}
		}
		console.log('parentArray', parentArray);
		let fx, fy;
		for(let i = parentArray.length-1; i >= 0; i--){
			let pf = parentArray[i];
			console.log( offsetX, pSed.screenRatio , pf.get('x'));
			if(i==parentArray.length-1){
				fx = (offsetX)  / pSed.screenRatio - (pf.get('x'));
				fy = (offsetY)  / pSed.screenRatio - (pf.get('y'));
			} else {
				fx = fx - (pf.get('x'));                            
				fy = fy - (pf.get('y'));
			}
			console.log('1fx', fx, 'fy', fy)    
			let fxy = getRetroRotatePos(pf.opt.ro, fx, fy);
			fx = fxy.x;
			fy = fxy.y;   
			console.log('2fx', fx, 'fy', fy) 
		}
		console.log('fx', fx, 'fy', fy)
		return {
			x:fx,
			y:fy
		}
		/*
		let fx, fy, fxy;
		let parentFg2 = getParentFg(parentFg);
		if(parentFg2 != null){
			fx = (offsetX)  / ms.screenRatio - (parentFg2.get('x'));                            
			fy = (offsetY)  / ms.screenRatio - (parentFg2.get('y'));
			fxy = getRetroRotatePos(parentFg2.opt.ro, fx, fy);
			fx = fxy.x;
			fy = fxy.y;    
			fx = fx - (parentFg.get('x'));                            
			fy = fy - (parentFg.get('y'));

			fxy = getRetroRotatePos(parentFg.opt.ro, fx, fy);
			fx = fxy.x;
			fy = fxy.y;

		} else {
			fx = (offsetX)  / ms.screenRatio - (parentFg.get('x'));                            
			fy = (offsetY)  / ms.screenRatio - (parentFg.get('y'));

			fxy = getRetroRotatePos(parentFg.opt.ro, fx, fy);
			fx = fxy.x;
			fy = fxy.y;

		}
		*/
	}
	static getJDotIndex (fg, selectedDownFgDotIndex){
		if(fg.opt == undefined){
			return null;
		}
		////console.log('get', selectedDownFgDotIndex, fg.opt.dots.length)
		// ////console.log('getJDotIndex', selectedDownFgDotIndex, fg.opt.jDots.length);
		if(selectedDownFgDotIndex == 0){
			return 0;
		} else if(selectedDownFgDotIndex == fg.opt.dots.length -1){
			return 1;
		} else {
			return null;
		}
	}
	static changeToRealX (x, w){
		return x*w/100;
	}
	static changeToRealY (y, h){
		return y*h/100;
	}
	// drawPath;
	static changeToRealPath (d, w, h, x, y){
		//console.log('changeToRealPath************************');
		var dList = parsePath(d);
		//console.log('dList', d, dList);
		if(x == null) x = 0;
		if(y == null) y = 0;
		
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		for(var i=0; i < dList.length; i++){
			//console.log('i>>>',i , dList[i]);
			var dotInfoList = parsePathDot(dList[i]);
			//console.log('i>>>',i , dotInfoList);
			for(var j=0; j < dotInfoList.length; j++){
				var dotInfo = dotInfoList[j];
				if(dotInfo.kind == 'A1'){
					dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
					dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
				}
				dotInfo.x = dotInfo.x * w / 100 + x;
				dotInfo.y = dotInfo.y * h / 100 + y;
				//fg.opt.dots[count].x = dotInfo.x;
				//fg.opt.dots[count].y = dotInfo.y;
				dotList.push(dotInfo);
			}
		}
		//console.log('dotList', dotList);
		////console.log('dotList', dotList);
		var strD = stringifyPath(dotList);
		//console.log('strD', strD);
		////console.log('strD', strD);
		//var strDH = stringifyPathHelp(dotList);
		//fg.opt.d = strD;
		//fg.opt.helpD = strDH;
		return strD;       
	}
	// drawPath;
	static changeToRealPathTo (d, w, h, x, y){
		//console.log('changeToRealPath************************');
		var dList = parsePath(d);
		////console.log('dList', dList);
		if(x == null) x = 0;
		if(y == null) y = 0;
		
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		for(var i=0; i < dList.length; i++){
			var dotInfoList = parsePathDot(dList[i]);
			for(var j=0; j < dotInfoList.length; j++){
				var dotInfo = dotInfoList[j];
				if(dotInfo.kind == 'A1'){
					dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
					dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
				}
				dotInfo.x = dotInfo.x  - x; //- (w)
				dotInfo.y = dotInfo.y  - y; //- (h/2)
				//fg.opt.dots[count].x = dotInfo.x;
				//fg.opt.dots[count].y = dotInfo.y;
				dotList.push(dotInfo);
			}
		}

		////console.log('dotList', dotList);
		var strD = stringifyPath(dotList);
		////console.log('strD', strD);
		//var strDH = stringifyPathHelp(dotList);
		//fg.opt.d = strD;
		//fg.opt.helpD = strDH;
		return strD;       
	}
	static changeToBasicPath (d, w, h, x, y){
		//console.log('changeToBasicPath********************************');
		var dList = parsePath(d);
		//////console.log('dList', dList);
		if(x == null) x = 0;
		if(y == null) y = 0;
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		//////console.log('x-y', x, y)
		for(var i=0; i < dList.length; i++){
			var dotInfoList = parsePathDot(dList[i]);
			for(var j=0; j < dotInfoList.length; j++){
				var dotInfo = dotInfoList[j];
				if(dotInfo.kind == 'A1'){
					dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
					dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
				}
				dotInfo.x = (dotInfo.x - x) * 100 / w;// - x;
				dotInfo.y = (dotInfo.y - y) * 100 / h;// - y;
				dotList.push(dotInfo);
			}
		}

		//////console.log('dotList', dotList);
		var strD = stringifyPath(dotList);
		//////console.log('strD', strD);
		return strD;       
	}

	static parsePathDot (dotInfo){
		//////console.log('parsePathDot******', dotInfo);
		
		var infoArray = ['M', 'm', 'L', 'l', 'H', 'h', 'V', 'v', 'Q', 'q', 'C', 'c', 'S', 's', 'A', 'a', 'T', 't'];

		//////console.log('dotInfo****************', dotInfo);
		for(var i=0; i < dotInfo.length; i++){
			for(var j=0; j < infoArray.length; j++){
				//////console.log('>>>', i,j,dotInfo.substring(i,i+1) ,'==', infoArray[j],'&&', dotInfo.substring(i+1, i+2)); 
				if(dotInfo.substring(i,i+1) == infoArray[j] && dotInfo.substring(i+1, i+2) != ' '){
					//////console.log(i, dotInfo.substring(0,i+1) ,' ', dotInfo.substring(i+1));
					dotInfo = dotInfo.substring(0,i+1) + ' ' + dotInfo.substring(i+1);
					//////console.log('dotInfo', dotInfo);
				}
			}
		}
		//console.log('dotInfo****************', dotInfo);
		for(var i=0; i < 100; i++){
			dotInfo = dotInfo.replace('  ', ' ');
		}
		//console.log('222dotInfo****************', dotInfo);
		var info = [];
		var infoTemp = dotInfo.split(' ');
		for(var i=0; i< infoTemp.length; i++){
			var infoTemp2 = infoTemp[i].split(',');
			//console.log('infoTemp2', infoTemp2);
			for(var j=0; j < infoTemp2.length; j++){
				info.push(infoTemp2[j]);
			}
		}
		//console.log('info****************', info);
		var z = true;
		if(dotInfo.indexOf('z') == -1 &&  dotInfo.indexOf('Z') == -1){
			z = false;
		}  
		if(info[0] == 'M'){
			return [{
				kind:info[0],
				x:info[1],
				y:info[2],
				z:z,
				role:'m'
				
			}]
		} else if(info[0] == 'L'){
			return [{
				kind:info[0],
				x:info[1],
				y:info[2],
				z:z,
				role:'m'
			}]
		} else if(info[0] == 'H'){
			return [{
				kind:info[0],
				x:info[1],
				y:0,
				z:z,
				role:'m'
			}]
		}  else if(info[0] == 'V'){
			return [{
				kind:info[0],
				x:0,
				y:info[1],
				z:z,
				role:'m'
			}]
		} else if(info[0] == 'Q'){
			return [{
				kind:'Q1',
				x:info[1],
				y:info[2],
				z:false,
				role:'s'
			},{
				kind:'Q',
				x:info[3],
				y:info[4],
				z:z,
				role:'m'
			}]
		} else if(info[0] == 'C'){
			return [{
				kind:'C1',
				x:info[1],
				y:info[2],
				z:false,
				role:'s'
			},{
				kind:'C2',
				x:info[3],
				y:info[4],
				z:false,
				role:'s'
			},{
				kind:'C',
				x:info[5],
				y:info[6],
				z:z,
				role:'m'
			}]
		}  else if(info[0] == 'S'){
			return [{
				kind:'S2',
				x:info[1],
				y:info[2],
				z:false,
				role:'s'
			},{
				kind:'S',
				x:info[3],
				y:info[4],
				z:z,
				role:'m'
			}]
		}  else if(info[0] == 'T'){
			return [{
				kind:'T',
				x:info[1],
				y:info[2],
				z:z,
				role:'m'
			}]
		} else if(info[0] == 'A'){
			return [{
				kind:'A1',
				x:info[1],
				y:info[2],
				xar: info[3],
				laf: info[4],
				sf: info[5],
				z:false,
				role:'s'
			},{
				kind:'A',
				x:info[6],
				y:info[7],
				z:z,
				role:'m'
			}]
		}
	}
	static movePathTo (fg, x, y){
		if(fg.opt.fig != 'connector'){
			return;
		}
		var temp = fg.opt.d;
		var dList = parsePath(fg.opt.d);
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		//////console.log('dList', dList);
		if(fg.opt.type != 'flowline'){
			for(var i=0; i < dList.length; i++){
				var dotInfoList = parsePathDot(dList[i]);
				
				for(var j=0; j < dotInfoList.length; j++){
					var dotInfo = dotInfoList[j];
					dotInfo.x = Number(dotInfo.x) + Number(x);
					dotInfo.y = Number(dotInfo.y) + Number(y);

					if(dotInfo.kind == 'A1'){
						dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
						dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
					}
					dotList.push(dotInfo);
					if(dotInfo.kind == 'H'){
						fg.opt.dots[count].x = dotInfo.x;
						fg.opt.dots[count].y = bfY;
					} else if(dotInfo.kind == 'V'){
						fg.opt.dots[count].x = bfX;
						fg.opt.dots[count].y = dotInfo.y;
					} else {
						fg.opt.dots[count].x = dotInfo.x;
						fg.opt.dots[count].y = dotInfo.y;
					}
					if(count == 0){
						bfX = dotInfo.x;
						bfY = dotInfo.y;
					} else if(dotInfo.kind == 'H'){
						bfX = dotInfo.x;
					} else if(dotInfo.kind == 'V'){
						bfY = dotInfo.y;
					} else {
						bfX = dotInfo.x;
						bfY = dotInfo.y;
					}
					count++;
				}            
			}
		}
		fg.set('x1', Number(fg.get('x1')) + x);
		fg.set('y1', Number(fg.get('y1')) + y);

		/*
		if(dotInfoList[dotInfoList.length-1].kind == 'H'){
			fg.set('x2', Number(fg.get('x2')) + x);
			fg.set('y2', bfY);
		} else if(dotInfoList[dotInfoList.length-1].kind == 'V'){
			fg.set('x2', bfX);
			fg.set('y2', Number(fg.get('y2')) + y);
		} else {
			fg.set('x2', Number(fg.get('x2')) + x);
			fg.set('y2', Number(fg.get('y2')) + y);
		}
		*/
		if(fg.opt.type == 'flowline'){
			fg.set('x2', Number(fg.get('x2')) + x);
			fg.set('y2', Number(fg.get('y2')) + y);
			/*
			fg.g.dots[0].setAttribute('cx', fg.opt.x1);
			fg.g.dots[0].setAttribute('cy', fg.opt.y1);
			fg.g.dots[1].setAttribute('cx', fg.opt.x2);
			fg.g.dots[1].setAttribute('cx', fg.opt.y2);
			*/
			
		} else {
			if(dotList[dotList.length-1].kind == 'H'){
				fg.set('x2', Number(fg.get('x2')) + x);
				fg.set('y2', bfY);
			} else if(dotList[dotList.length-1].kind == 'V'){
				fg.set('x2', bfX);
				fg.set('y2', Number(fg.get('y2')) + y);
			} else {
				fg.set('x2', Number(fg.get('x2')) + x);
				fg.set('y2', Number(fg.get('y2')) + y);
			}
		}
		
		/*
		if(dotInfoList[dotInfoList.length-1].z == true){
			fg.set('x2', fg.get('x1'));
			fg.set('y2', fg.get('y1'));
		}
		*/
		var strD = stringifyPath(dotList);
		var strDH = stringifyPathHelp(dotList);
		console.log('strD', strD);
		fg.opt.d = strD;
		fg.opt.helpD = strDH;
	}
	static rotatePath (fg, rot, centerX, centerY){
		if(fg.opt.fig != 'connector'){
			return;
		}
		var temp = fg.opt.d;
		var dList = parsePath(fg.opt.d);
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		console.log('dList', dList);
		if(fg.opt.type != 'flowline'){
			for(var i=0; i < dList.length; i++){
				var dotInfoList = parsePathDot(dList[i]);
				//////console.log('i', i, dotInfoList, dList[i]);
				for(var j=0; j < dotInfoList.length; j++){
					var dotInfo = dotInfoList[j];
					/*
					dotInfo.x = Number(dotInfo.x) + Number(x);
					dotInfo.y = Number(dotInfo.y) + Number(y);
					
					*/
				dotInfo.x = dotInfo.x-centerX;
				dotInfo.y = dotInfo.y-centerY;
					console.log('dotInfo', rot, dotInfo.x, dotInfo.y);
					var pos = getRotatePos(rot, dotInfo.x, dotInfo.y);
					console.log('pos', pos.x, pos.y);
					dotInfo.x = pos.x + centerX;
					dotInfo.y = pos.y + centerY;

					if(dotInfo.kind == 'A1'){
						dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
						dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
					} 

					dotList.push(dotInfo);
					if(dotInfo.kind == 'H'){
						fg.opt.dots[count].x = dotInfo.x;
						fg.opt.dots[count].y = bfY;
					} else if(dotInfo.kind == 'V'){
						fg.opt.dots[count].x = bfX;
						fg.opt.dots[count].y = dotInfo.y;
					} else {
						fg.opt.dots[count].x = dotInfo.x;
						fg.opt.dots[count].y = dotInfo.y;
					}
					if(count == 0){
						bfX = dotInfo.x;
						bfY = dotInfo.y;
					} else if(dotInfo.kind == 'H'){
						bfX = dotInfo.x;
					} else if(dotInfo.kind == 'V'){
						bfY = dotInfo.y;
					} else {
						bfX = dotInfo.x;
						bfY = dotInfo.y;
					}
					count++;
				}
			}
		}
		var pos1 = getRotatePos(rot, fg.get('x1'), fg.get('y1'));
		fg.set('x1', pos1.x);
		fg.set('y1', pos1.y);

		/*
		if(dotInfoList[dotInfoList.length-1].kind == 'H'){
			fg.set('x2', Number(fg.get('x2')) + x);
			fg.set('y2', bfY);
		} else if(dotInfoList[dotInfoList.length-1].kind == 'V'){
			fg.set('x2', bfX);
			fg.set('y2', Number(fg.get('y2')) + y);
		} else {
			fg.set('x2', Number(fg.get('x2')) + x);
			fg.set('y2', Number(fg.get('y2')) + y);
		}
		*/
		if(fg.opt.type == 'flowline'){
			var pos2 = getRotatePos(rot, fg.get('x2'), fg.get('y2'));
			fg.set('x2', pos2.x);
			fg.set('y2', pos2.y);
			
		} else {
			if(dotList[dotList.length-1].kind == 'H'){
				var pos2 = getRotatePos(rot, fg.get('x2'), bfY);
				fg.set('x2', pos2.x);
				fg.set('y2', pos2.y);

				//fg.set('x2', Number(fg.get('x2')) + x);
				//fg.set('y2', bfY);
			} else if(dotList[dotList.length-1].kind == 'V'){
				var pos2 = getRotatePos(rot, bfX, fg.get('y2'));
				fg.set('x2', pos2.x);
				fg.set('y2', pos2.y);
				//fg.set('x2', bfX);
				//fg.set('y2', Number(fg.get('y2')) + y);
			} else {
				var pos2 = getRotatePos(rot, fg.get('x2'), fg.get('y2'));
				fg.set('x2', pos2.x);
				fg.set('y2', pos2.y);
				//fg.set('x2', Number(fg.get('x2')) + x);
				//fg.set('y2', Number(fg.get('y2')) + y);
			}
		}
		
		/*
		if(dotInfoList[dotInfoList.length-1].z == true){
			fg.set('x2', fg.get('x1'));
			fg.set('y2', fg.get('y1'));
		}
		*/
		var strD = stringifyPath(dotList);
		var strDH = stringifyPathHelp(dotList);
		console.log('strD', strD);
		fg.opt.d = strD;
		fg.opt.helpD = strDH;
	}
	static movePathDotXY (fg, index, x, y){
		console.log('movePathDotXY', index, x, y)
		if(fg.opt.fig != 'connector'){
			return;
		}
		var temp = fg.opt.d;
		var dList = parsePath(fg.opt.d);

		console.log('11>',fg.opt.d);
		console.log('12>',dList);
		
		var dotList = [];
		var count = 0;
		var bfX = 0;
		var bfY = 0;
		//////console.log('dList', dList);

		for(var i=0; i < dList.length; i++){
			var dotInfoList = parsePathDot(dList[i]);
			console.log('i', i, dotInfoList, dList[i]);
			for(var j=0; j < dotInfoList.length; j++){
				var dotInfo = dotInfoList[j];

				if(dotInfo.kind == 'A1'){
					dotInfo.x = Number(dotInfo.x) + Number(dotInfoList[j+1].x);
					dotInfo.y = Number(dotInfo.y) + Number(dotInfoList[j+1].y);
				}
				console.log('index', index, count)
				if( index != null && count == index){
					console.log("여긴데...", x, y);
					dotInfo.x = x;
					dotInfo.y = y;
					fg.opt.dots[count].x = dotInfo.x;
					fg.opt.dots[count].y = dotInfo.y;
				}
				if(dotInfo.kind == 'H'){
					//fg.opt.dots[count].x = dotInfo.x;
					fg.opt.dots[count].y = bfY;
				} else if(dotInfo.kind == 'V'){
					fg.opt.dots[count].x = bfX;
					//fg.opt.dots[count].y = dotInfo.y;
				} else {
					//fg.opt.dots[count].x = dotInfo.x;
					//fg.opt.dots[count].y = dotInfo.y;
				}

				
				dotList.push(dotInfo);

				if(count == 0){
					bfX = dotInfo.x;
					bfY = dotInfo.y;
				} else if(dotInfo.kind == 'H'){
					bfX = dotInfo.x;
				} else if(dotInfo.kind == 'V'){
					bfY = dotInfo.y;
				} else {
					bfX = dotInfo.x;
					bfY = dotInfo.y;
				}
				count++;
			}
		}
		if(index == 0){
			fg.set('x1', x);
			fg.set('y1', y);
		} else if(index == fg.opt.dots.length -1){
			fg.set('x2', x);
			fg.set('y2', y);
		}


		if(dotInfoList[dotInfoList.length-1].kind == 'H'){
			//fg.set('x2', x);
			fg.set('y2', bfY);
		} else if(dotInfoList[dotInfoList.length-1].kind == 'V'){
			fg.set('x2', bfX);
			//fg.set('y2', y);
		} 

		
		/*
		if(dotInfoList[dotInfoList.length-1].z == true){
			fg.set('x2', fg.get('x1'));
			fg.set('y2', fg.get('y1'));
		}
		*/
		//////console.log('x>>>>>>>>>>>>>>>>>>>>>>>', x);
		//////console.log('x', x);
		var strD = stringifyPath(dotList);
		console.log('1>',dotList);
		console.log('2>',strD);

		fg.opt.d = strD;

		
		var strDH = stringifyPathHelp(dotList);
		fg.opt.helpD = strDH;
		
	}
	static stringifyPath (dotInfo){
		var str = '';
		for(var i=0; i < dotInfo.length; i++){
			if(i != 0){
				str = str + ' ';
			}
			if(dotInfo[i].kind == 'M'){
				str = str + 'M' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'L'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'H'){
				str = str + 'H' + ' ' + dotInfo[i].x;
			} else if(dotInfo[i].kind == 'V'){
				str = str + 'V' + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'Q1'){
				str = str + 'Q' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'Q'){
				str = str + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C1'){
				str = str + 'C' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C2'){
				str = str + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C'){
				str = str + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'S2'){
				str = str + 'S' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'S'){
				str = str + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'T'){
				str = str + 'T' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'A1'){
				
				dotInfo[i].xar = Math.sqrt((dotInfo[i].x - dotInfo[i+1].x) * (dotInfo[i].x - dotInfo[i+1].x) + (dotInfo[i].y - dotInfo[i+1].y) * (dotInfo[i].y - dotInfo[i+1].y));
				
				if(dotInfo[i].x - dotInfo[i+1].x> 0){
					dotInfo[i].laf = 1;
				} else {
					dotInfo[i].laf = 0;
				}
				if(dotInfo[i].y - dotInfo[i+1].y > 0){
					dotInfo[i].sf = 0;
				} else {
					dotInfo[i].sf = 1;
				}
				str = str + 'A' + ' ' + (dotInfo[i].x - dotInfo[i+1].x) + ' ' + (dotInfo[i].y - dotInfo[i+1].y) + 
					' ' + dotInfo[i].xar + ' ' + dotInfo[i].laf + ' ' + dotInfo[i].sf;
			} else if(dotInfo[i].kind == 'A'){
				str = str + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			}
			if(dotInfo[i].z == true){
				str = str + ' Z';
			}
		}
		return str;
	}
	static stringifyPathHelp (dotInfo){
		var str = '';
		for(var i=0; i < dotInfo.length; i++){
			if(i != 0){
				str = str + ' ';
			}
			if( dotInfo[i].kind == 'M' || dotInfo[i].kind == 'M'){
				str = str + 'M' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'L'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'H'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i-1].y;
			} else if(dotInfo[i].kind == 'V'){
				str = str + 'L' + ' ' + dotInfo[i-1].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'Q'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'Q2'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C1'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'C2'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'S2'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'S'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'T'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'A'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			} else if(dotInfo[i].kind == 'A1'){
				str = str + 'L' + ' ' + dotInfo[i].x + ' ' + dotInfo[i].y;
			}
		}
		return str;
	}
	static parsePath (path){
		var chrList = [];
		for(var i=0; i < path.length-1; i++){
			var chr = path.substring(i,i+1);
			if( chr == 'M' ||
				chr == 'L' ||
				chr == 'H' ||
				chr == 'V' ||
				chr == 'C' ||
				chr == 'S' ||
				chr == 'Q' ||
				chr == 'T' ||
				chr == 'A' ||
				//chr == 'Z' || 
				chr == 'm' ||
				chr == 'l' ||
				chr == 'h' ||
				chr == 'v' ||
				chr == 'c' ||
				chr == 's' ||
				chr == 'q' ||
				chr == 't' ||
				chr == 'a'){
				//chr == 'z'){
				for(var j=i+1; j < path.length-1; j++){
					var nextChr = path.substring(j,j+1);
					if( nextChr == 'M' ||
						nextChr == 'L' ||
						nextChr == 'H' ||
						nextChr == 'V' ||
						nextChr == 'C' ||
						nextChr == 'S' ||
						nextChr == 'Q' ||
						nextChr == 'T' ||
						nextChr == 'A' ||
						//nextChr == 'Z' || 
						nextChr == 'm' ||
						nextChr == 'l' ||
						nextChr == 'h' ||
						nextChr == 'v' ||
						nextChr == 'c' ||
						nextChr == 's' ||
						nextChr == 'q' ||
						nextChr == 't' ||
						nextChr == 'a' ){
						//nextChr == 'z'){
						chrList.push(path.substring(i, j));
						break;
					}
				} 
				if(j==path.length -1){
					chrList.push(path.substring(i));
				}
			}
		}
		return chrList;
	}
	static callbackPopPathA (){
		console.log('>>>', sed.selectedFgDotIndex);
		sed.selectedFg.opt.dots[sed.selectedFgDotIndex].xar = document.getElementById('popPathA').querySelector('[ref=xar]').value;
		sed.selectedFg.opt.dots[sed.selectedFgDotIndex].laf = document.getElementById('popPathA').querySelector('[ref=laf]').value;
		sed.selectedFg.opt.dots[sed.selectedFgDotIndex].sf = document.getElementById('popPathA').querySelector('[ref=sf]').value;
		var d = stringifyPath(sed.selectedFg.opt.dots);
		sed.selectedFg.opt.d = d;
		sed.selectedFg.refresh();
		sed.selectedFg.draw();
		
		closeModal('popPathA');
	}
	static addEventToDot (fg, dot){
		console.log('addEventToDot', dot)
		
		dot.addEventListener('mousedown', function(event){
			console.log('mousedown.....................');
			event.stopPropagation();
			//console.log('dot onmousedown****************************', fg);
			//event.stopImmediatePropagation();
			/*
			fg.sed.selectedFg = fg;
			fg.sed.selectedDownFg = fg;
			fg.sed.selectedFgProp = fg;
			*/
			//fg.g.fireEvent('onmousedown', event);
			var dotIndex = dot.getAttribute('dotIndex');
			fg.sed.selectedFg = fg;
			fg.sed.selectedFgDot = dot;
			fg.sed.selectedFgProp = fg;
			fg.sed.selectedFgDotIndex = dotIndex;
			fg.sed.selectedFgJDotIndex = getJDotIndex(fg.sed.selectedFg, dotIndex);
			fg.sed.selectedDownFg = fg;
			fg.sed.selectedDownFgDot = event.target;
			fg.sed.selectedDownFgDotIndex = dotIndex;
			fg.sed.selectedDownFgJDotIndex = getJDotIndex(fg.sed.selectedDownFg, dotIndex);
			if(event.button==2){
				if(fg.sed.selectedDownFgDot.getAttribute('role') == 's'){
					if(fg.sed.selectedDownFgDot.getAttribute('kind') == 'A1'){
						openModal('popPathA');
						document.getElementById('popPathA').querySelector('[ref=xar]').value = fg.sed.selectedFg.opt.dots[fg.sed.selectedFgDotIndex].xar;
						document.getElementById('popPathA').querySelector('[ref=laf]').value = fg.sed.selectedFg.opt.dots[fg.sed.selectedFgDotIndex].laf;
						document.getElementById('popPathA').querySelector('[ref=sf]').value = fg.sed.selectedFg.opt.dots[fg.sed.selectedFgDotIndex].sf;
						return;
					}
					alert('select a blue dot.');
					return;
				}
				fg.sed.selectedFg = fg;
				setTimeout(function(){
					if(fg.opt.type == 'flowline'){
						return;
					} 
					fg.g.dots[dotIndex].onmousebuttonleft(event);
				},200);
				return false;
			}
			fg.sed.action = 'resize';
		});
		dot.onmousebuttonleft = function(event){
			console.log('onmousebuttonleft****************************');
			var contextMenu1 = document.getElementById('contextConnectorMenu');
			var y = event.y;
			if(event.y + 560 > window.innerHeight){
				y = window.innerHeight - 560;
			}
			contextMenu1.style.float='right';
			contextMenu1.style.left = (event.x  + 10) + 'px';
			contextMenu1.style.top = y + 'px';
			contextMenu1.style.position='absolute';
			contextMenu1.style.float = true;
			contextMenu1.style.display='block';
			console.log('contextMenu1', contextMenu1);
			return false;
		}    
	}

	static getRotateCalc (fg){
		////console.log('rrr------------->', fg.opt);
		var rotateCalc = fg.opt.ro;
		if(fg.parentFg != null){
			var parentFg1 = fg.parentFg;
			rotateCalc = rotateCalc  + parentFg1.get('ro');
			if(parentFg1.parentFg != null){
				var parentFg2 = parentFg1.parentFg;
				rotateCalc = rotateCalc  + parentFg2.get('ro');
				if(parentFg2.parentFg != null){
					var parentFg3 = parentFg2.parentFg;
					rotateCalc = rotateCalc  + parentFg3.get('ro');
					if(parentFg3.parentFg != null){
						var parentFg4 = parentFg3.parentFg;
						rotateCalc = rotateCalc  + parentFg4.get('ro');
						if(parentFg4.parentFg != null){
							var parentFg5 = parentFg4.parentFg;
							rotateCalc = rotateCalc  + parentFg5.get('ro');
						} 
					}                    
				}
			}
		}
		return rotateCalc;
	}

	static getDir (index, rotate){
		var dir = 0;
		if(index  == 0){
			if(rotate >= 315 || rotate <= 45){
				dir = 0;
			} else if (rotate >= 45 && rotate <= 135){
				dir = 1;
			} else if (rotate >= 135 && rotate <= 225){
				dir = 2;
			} else if (rotate >= 225 && rotate <= 315){
				dir = 3;
			}
		}else if(index  == 1){
			if(rotate >= 270 || rotate <=0 ){
				dir = 0;
			} else if (rotate >= 0 && rotate <= 90){
				dir = 1;
			} else if (rotate >= 90 && rotate <= 180){
				dir = 2;
			} else if (rotate >= 180 && rotate <= 270){
				dir = 3;
			}
		}else if(index  == 2){
			if(rotate >= 315 || rotate <= 45){
				dir = 1;
			} else if (rotate >= 45 && rotate <= 135){
				dir = 2;
			} else if (rotate >= 135 && rotate <= 225){
				dir = 3;
			} else if (rotate >= 225 && rotate <= 315){
				dir = 0;
			}
		}else if(index  == 3){
			if(rotate >= 270 || rotate <=0 ){
				dir = 1;
			} else if (rotate >= 0 && rotate <= 90){
				dir = 2;
			} else if (rotate >= 90 && rotate <= 180){
				dir = 3;
			} else if (rotate >= 180 && rotate <= 270){
				dir = 0;
			}
		}else if(index  == 4){
			if(rotate >= 315 || rotate <= 45){
				dir = 2;
			} else if (rotate >= 45 && rotate <= 135){
				dir = 3;
			} else if (rotate >= 135 && rotate <= 225){
				dir = 0;
			} else if (rotate >= 225 && rotate <= 315){
				dir = 1;
			}
		}else if(index  == 5){
			if(rotate >= 270 || rotate <=0 ){
				dir = 2;
			} else if (rotate >= 0 && rotate <= 90){
				dir = 3;
			} else if (rotate >= 90 && rotate <= 180){
				dir = 0;
			} else if (rotate >= 180 && rotate <= 270){
				dir = 1;
			}
		}else if(index  == 6){
			if(rotate >= 315 || rotate <= 45){
				dir = 3;
			} else if (rotate >= 45 && rotate <= 135){
				dir = 0;
			} else if (rotate >= 135 && rotate <= 225){
				dir = 1;
			} else if (rotate >= 225 && rotate <= 315){
				dir = 2;
			}
		}else if(index  == 7){
			if(rotate >= 270 || rotate <=0 ){
				dir = 3;
			} else if (rotate >= 0 && rotate <= 90){
				dir = 0;
			} else if (rotate >= 90 && rotate <= 180){
				dir = 1;
			} else if (rotate >= 180 && rotate <= 270){
				dir = 2;
			}
		}
		return dir;
	}
	static isValid (val){
		if(val == undefined || val == null || val == 'undefined' || (val + '').trim() == '' ||  val == 'rotate(undefined)' ||  val == 'transform(undefined)' ){
			return false;
		} else {
			return true;
		}
	}
	static setAttribute (el, attr, value, mand){
		if(mand != null && mand == true){
			el.setAttribute(attr, value);
		} else {
			if(isValid(value)){
				el.setAttribute(attr, value);
			} else {
				el.removeAttribute(attr);
			}
		}
	}
	static setAttributePGC (el, attr, pttid, grdid, value, figid){
		//console.log('setAttributePGC', arguments);
		if(isValid(pttid)){
			//console.log('1)))', pttid);
			el.setAttribute(attr, 'url(#ptt-' + figid + '_' + pttid + ')');
		} else if(isValid(grdid)){
			//console.log('2)))', grdid);
			el.setAttribute(attr, 'url(#grd-' + figid + '_' + grdid + ')');
		} else if(isValid(value)){
			//console.log('3)))', value);
			el.setAttribute(attr, value);
		} else {
			el.removeAttribute(attr);
		}
	}
	static nvl (val){
		if(val == undefined){
			return false;
		} else if(val == null){
			return false;
		} else if(val == 'false'){
			return false;
		} else if(val == 'true'){
			return true;
		}
		return val;
	}
	static isNull (val){
		if(val == undefined){
			return true;
		} else if(val == null){
			return true;
		} else if( (val + '').trim() == ''){
			return true;
		}
		return false;
	}
	static defaultNull (val, defVal){
		var ret = val;
		if(val == undefined || val == null) {
			ret = defVal;
		}
		return ret;
	}
	static min (val1, val2){
		if(val1 < val2){
			return val1;
		} else {
			return val2;
		}
	} 
	static max (val1, val2){
		if(val1 > val2){
			return val1;
		} else {
			return val2;
		}
	} 

	static animId = null;
	static animFps = 60;
	static animList = [];
	static animClear (){
		animArray = [];
	}

	static animStart (){
		//console.log('animStart');
		if(animId == null){
			animId = window.requestAFrame(sedLib_animLoop);
		}else {
			alert('Animation already started.');
		}
	}
	static animStop (){
		window.cancelAFrame(animId);
		animId = null;
	}
	/*
	window.requestAFrame = function(callback){
		console.log('start', 1000 / animFps);
		//return window.setTimeout(callback, 1000 / animFps); // shoot for 60 fps 
		return window.setTimeout(callback, 1000 / animFps); // shoot for 60 fps 

	}
	*/
	
	static tagCount = 0;
	static addAnimTag (fg, anim){
		console.log('addAnimTag', anim, fg);
		if(anim.lyname == 'all'){
			if(anim.antype == 'ro'){
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=rotate]');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j])
				}
				*/
				// 동작함
				var vals = anim.vals;
				var keyTimes = anim.keytms;
				console.log('vals',vals);
				var valArrays = vals.split(';');
				// current 처리하기
				for(var j=0; j < valArrays.length; j++){
					if(valArrays[j] == '{current}'){
						var lastVal = fg.getState(anim.stt).lastVal;
						if(lastVal == ''){
							lastVal = 0;
						}
						valArrays[j] = lastVal;
					}
				}
				//for(var j=0; j < valArrays.length; j++){
				//    valArrays[j] = valArrays[j]);// + ' ' + rox + ' ' + roy;
				//}
				var chgVals = '';
				for(var j=0; j < valArrays.length; j++){
					if(j==0){
						chgVals = valArrays[j];    
					} else {
						chgVals = chgVals + ';' + valArrays[j];
					}
				}
				console.log('chgvals', chgVals);

				// 동작함.
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
				animEl.setAttributeNS(null, "attributeName", "transform");
				animEl.setAttributeNS(null, "attributeType", "XML");
				animEl.setAttributeNS(null, "type", "rotate");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");            
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "values", chgVals);
				if(keyTimes != null && (keyTimes + '').trim() != ''){
					animEl.setAttributeNS(null, "keyTimes", keyTimes);
				}
				animEl.setAttributeNS(null, "fill", "freeze");
				animEl.setAttributeNS(null, "additive", "sum");

				fg.g.appendChild(animEl);
				// 테스트 
				//console.log('---------------------------------------------------------')
				//console.log('fg.opt.ro', fg.opt.ro);
				
				//////////////// 동작안함
				setTimeout(function(){
					animEl.beginElement();
				},5000)

				// 변경하면 않됨.
				//try{
				//	if(Array.isArray(valArrays) == true){
				//		fg.opt.ro = valArrays[valArrays.length-1];// anim.to;
				//	}
				//}catch(e){}



			} else if(anim.antype == 'mv'){
				console.log('mv-->', fg.opt);
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=translate]');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j])
				}
				*/
				var vals = anim.vals;
				var keyTimes = anim.keytms;
				console.log('vals',vals);
				var valArrays = vals.split(';');
				// current 처리하기
				for(var j=0; j < valArrays.length; j++){
					if(valArrays[j] == '{current}'){
						var lastVal = fg.getState(anim.stt).lastVal;
						if(lastVal == ''){
							lastVal = 0,0;
						}
						valArrays[j] = lastVal;
					}
				}
				var chgVals = '';
				for(var j=0; j < valArrays.length; j++){
					if(j==0){
						chgVals = valArrays[j];    
					} else {
						chgVals = chgVals + ';' + valArrays[j];
					}
				}
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
				animEl.setAttributeNS(null, "attributeName", "transform");
				animEl.setAttributeNS(null, "attributeType", "XML");
				animEl.setAttributeNS(null, "type", "translate");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "values", chgVals);
				if(keyTimes != null && (keyTimes + '').trim() != ''){
					animEl.setAttributeNS(null, "keyTimes", keyTimes);
				}
				animEl.setAttributeNS(null, "fill", "freeze");
				animEl.setAttributeNS(null, "additive", "sum");
				fg.g.appendChild(animEl);
				animEl.beginElement();
			} /*  else if(anim.antype == 'mvt'){
				console.log('mv-->', fg.opt);
				
				//var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=translate]');
				//console.log('>>',bfAnims);
				//for(var j=0; j < bfAnims.length; j++){
				//    fg.g.removeChild(bfAnims[j])
				//}
				
				fg.moveXY(anim.frmX, anim.frmY);
				var toX = anim.toX;
				var toY = anim.toY;
				anim.toX = Number(toX) + Number(anim.frmX);
				anim.toY = Number(toY) + Number(anim.frmY);
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
				animEl.setAttributeNS(null, "attributeName", "transform");
				animEl.setAttributeNS(null, "attributeType", "XML");
				animEl.setAttributeNS(null, "type", "translate");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "from", anim.frmX + ' ' + anim.frmY);
				animEl.setAttributeNS(null, "to", anim.toX + ' ' + anim.toY);
				animEl.setAttributeNS(null, "fill", "freeze");
				animEl.setAttributeNS(null, "additive", "sum");
				fg.g.appendChild(animEl);
				animEl.beginElement();
			}*/ else if(anim.antype == 'mvp'){
				console.log('mvp-->', fg.opt);
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animateMotion');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j]);
				}
				*/
				var pathFg = fg.sed.getComp(anim.vals);
				console.log('>>>', anim.vals, pathFg, fg.opt.w, fg.opt.h);

				var toPathD = changeToRealPathTo(pathFg.opt.d, fg.opt.w, fg.opt.h, fg.opt.x, fg.opt.y);
				//fg.g.setAttribute('transform', 'translate(0,0);rotate(90)');
				//var toPathD = changeToRealPathTo(pathFg.opt.d, 0, 0, 0, 0); //fg.opt.w, fg.opt.h, fg.opt.x, fg.opt.y);
				console.log('toPathD', toPathD);
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
				animEl.setAttributeNS(null, "attributeName", "transform");
				//animEl.setAttributeNS(null, "attributeType", "XML");
				//animEl.setAttributeNS(null, "type", "translate");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				//animEl.setAttributeNS(null, "rotate", 90);
				animEl.setAttributeNS(null, "path", toPathD);
				animEl.setAttributeNS(null, "fill", "freeze");
				//animEl.setAttributeNS(null, "additive", "sum");
				
				fg.g.appendChild(animEl);
				
				animEl.beginElement();
			}  else if(anim.antype == 'mpp'){
				console.log('mpp-->', fg.opt);
				/*
					var bfAnims = fg.g.querySelectorAll('animate[attributeName=d]');
					console.log('>>',bfAnims);
					for(var j=0; j < bfAnims.length; j++){
						fg.g.removeChild(bfAnims[j]);
					}
				*/
				
				var vals = anim.vals;
				console.log('vals',vals);
				var valArray = vals.split(';');
				var frm = valArray[0];
				var to = valArray[1];

				var fromPathD = null;
				var toPathD = null;
				var fromPathLen = 0;
				var toPathLen = 0;
				var frmComp = fg.sed.getComp(frm);
				var toComp = fg.sed.getComp(to);
				
				
				fromPathLen = frmComp.g.path.getTotalLength();
				toPathLen = toComp.g.path.getTotalLength();
			
				var strD = '';
				var gab=20;
				for(var j=0; j < gab; j++){
					var tempFromPos = frmComp.g.path.getPointAtLength(fromPathLen * j/gab);
					var tempToPos = toComp.g.path.getPointAtLength(fromPathLen * j/gab);
					if(j==0){
						strD = 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
					} else {
						strD = strD + 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
					}
				}
				//
				{
					var tempFromPos = frmComp.g.path.getPointAtLength(fromPathLen);
					var tempToPos = toComp.g.path.getPointAtLength(toPathLen);
					strD = strD + 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
				}
				//

				console.log('strD', strD);
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
				animEl.setAttributeNS(null, "attributeName", "d");
				animEl.setAttributeNS(null, "attributeType", "CSS");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "values", strD);
				animEl.setAttributeNS(null, "fill", "freeze");
				fg.g.path.appendChild(animEl);
				
				animEl.beginElement();
			}  else if(anim.antype == 'ggb' || anim.antype == 'ggbh' || anim.antype == 'ggr' || anim.antype == 'ggp' || anim.antype == 'ggt' || 
				anim.antype == 'ptmvh' || anim.antype == 'ptmvv' || anim.antype == 'ptmv24' || anim.antype == 'ptmv13' || anim.antype == 'txt'){
				alert('Change the component animation!!');
				return;
				// ggb는 all로 처리못함
				
			} else if(anim.antype == 'sc'){
				console.log('sc-->', fg.opt);
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=scale]');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j]);
				}
				*/
				var vals = anim.vals;
				var keyTimes = anim.keytms;
				console.log('vals',vals);
				var valArrays = vals.split(';');
				// current 처리하기
				for(var j=0; j < valArrays.length; j++){
					if(valArrays[j] == '{current}'){
						var lastVal = fg.getState(anim.stt).lastVal;
						if(lastVal == ''){
							lastVal = '1';
						}
						valArrays[j] = lastVal;
					}
				}
				
				var chgVals = '';
				for(var j=0; j < valArrays.length; j++){
					if(j==0){
						chgVals = valArrays[j];    
					} else {
						chgVals = chgVals + ';' + valArrays[j];
					}
				}
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
				animEl.setAttributeNS(null, "attributeName", "transform");
				animEl.setAttributeNS(null, "attributeType", "XML");
				animEl.setAttributeNS(null, "type", "scale");
				animEl.setAttributeNS(null, "values", chgVals);
				if(keyTimes != null && (keyTimes + '').trim() != ''){
					animEl.setAttributeNS(null, "keyTimes", keyTimes);
				}
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "fill", "freeze");
				animEl.setAttributeNS(null, "additive", "sum");
				fg.g.appendChild(animEl);
				animEl.beginElement();
			} else if(anim.antype == 'fll'){
				console.log('fll-->',fg.opt);
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animate[attributeName=stroke-dashoffset]');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j])
				}
				*/
				
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
				animEl.setAttributeNS(null, "attributeName", "stroke-dashoffset");
				animEl.setAttributeNS(null, "attributeType", "CSS");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "values", "0;10000");            
				animEl.setAttributeNS(null, "fill", "freeze");
				
				fg.g.appendChild(animEl);

				animEl.beginElement();
			} else if(anim.antype == 'flr'){
				console.log('flr-->', fg.opt.tags[i]);
				/*
				var bfAnims = fg.g.querySelectorAll(':scope>animate[attributeName=stroke-dashoffset]');
				console.log('>>',bfAnims);
				for(var j=0; j < bfAnims.length; j++){
					fg.g.removeChild(bfAnims[j])
				}
				*/
				var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
				animEl.setAttributeNS(null, "attributeName", "stroke-dashoffset");
				animEl.setAttributeNS(null, "attributeType", "CSS");
				animEl.setAttributeNS(null, "dur", anim.dur + "s");
				//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
				//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
				animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
				animEl.setAttributeNS(null, "values", "10000;0");
				animEl.setAttributeNS(null, "fill", "freeze");
	
				fg.g.appendChild(animEl);
			
				animEl.beginElement();
			} 
			// cpp, opf, ops
		} else {
			var tagCount = '';
			for(var i=0 ; i < fg.opt.tags.length;i++){
				//tagCount = i;
				if(fg.opt.tags[i].lyname == anim.lyname ){
					if(anim.antype == 'ro'){
						console.log('if-->',i, fg.opt.tags[i]);
						console.log('>>', fg.opt.tags[i].rox, defaultNull(fg.opt.tags[i].rox,0));
						var rox= changeToRealX(fg.opt.tags[i].rox, fg.get('w'));
						var roy= changeToRealY(fg.opt.tags[i].roy, fg.get('h'));
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = 0;
								}
								valArrays[j] = lastVal;
							}
						}

						var max = anim.max;
						var min = anim.min;
						if(max == undefined || max == null || max.trim() == ''){
							max = 360;
						}
						if(min == undefined || min == null || min.trim() == ''){
							min = 0;
						}
						// 360:x = (max-min):(to-min)
						// x = (to-min) * 360/(max-min)


						//var values = frm2 + ';' + to2;

						for(var j=0; j < valArrays.length; j++){
							valArrays[j] = (valArrays[j] - min) * 360/(max-min);
						}

						for(var j=0; j < valArrays.length; j++){
							valArrays[j] = valArrays[j] + ' ' + rox + ' ' + roy;
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						console.log('chgvals', chgVals);

						

						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "transform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "rotate");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
						//fg.opt.tags[i].tro = anim.to;
					} else if(anim.antype == 'mv'){
						console.log('mv-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[type=translate]');
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = 0,0;
								}
								valArrays[j] = lastVal;
							}
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "transform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "translate");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
						//fg.opt.tags[i].trx = anim.toX;
						//fg.opt.tags[i].try = anim.toY;
					} else if( anim.antype == 'ptmv24' ||
						anim.antype == 'ptmv13' || 
						anim.antype == 'ptmv31' || 
						anim.antype == 'ptmv42' || 
						anim.antype == 'ptmvh' ||
						anim.antype == 'ptmvv'){
						console.log('sc-->', fg.opt);
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '1';
								}
								valArrays[j] = lastVal;
							}
						}
						
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "patternTransform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "translate");
						if(valArrays == null || valArrays.length != 2 ){
							if(anim.antype == 'ptmv24'){
								animEl.setAttributeNS(null, "from", '0,0');
								animEl.setAttributeNS(null, "to", fg.opt.w + ',' + (fg.opt.w * 0.6));	
							} else if(anim.antype == 'ptmv42'){
								animEl.setAttributeNS(null, "to", '0,0');
								animEl.setAttributeNS(null, "from", fg.opt.w + ',' + (fg.opt.w * 0.6));	
							} else if(anim.antype == 'ptmv13'){
								animEl.setAttributeNS(null, "from", '0,0');
								animEl.setAttributeNS(null, "to", (fg.opt.w * -1) + ',' + (fg.opt.w * 0.6));	
							} else if(anim.antype == 'ptmv31'){
								animEl.setAttributeNS(null, "to", '0,0');
								animEl.setAttributeNS(null, "from", (fg.opt.w * -1) + ',' + (fg.opt.w * 0.6));	
							} else if(anim.antype == 'ptmvh'){
								animEl.setAttributeNS(null, "from", '0,0');
								animEl.setAttributeNS(null, "to", fg.opt.w + ', 0');	
							} else if(anim.antype == 'ptmvv'){
								animEl.setAttributeNS(null, "from", '0,0');
								animEl.setAttributeNS(null, "to", '0,' + fg.opt.h);	
							}
						} else {
							animEl.setAttributeNS(null, "from", valArrays[0]);
							animEl.setAttributeNS(null, "to", valArrays[1]);	
						}
						/*
						animEl.setAttributeNS(null, "values", chgVals);

						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						*/
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						//animEl.setAttributeNS(null, "fill", "freeze");
						//animEl.setAttributeNS(null, "additive", "sum");

						var ptt = document.createElementNS("http://www.w3.org/2000/svg", 'pattern');
						//p.setAttribute('type', ptts.name);
						ptt.setAttribute('id', 'ptt-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname);//  + '_' + tagCount
						ptt.setAttribute('defType', 'pattern');
						ptt.setAttribute('x', 0);
						ptt.setAttribute('y', 0);
						ptt.setAttribute('width', 10);
						ptt.setAttribute('height', 10);
						ptt.setAttribute('patternUnits', 'objectBoundingBox');
						
						//let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
						let path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
						path.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
						if(anim.antype == 'ptmv24'){
							path.setAttribute('d', 'M 100 0 L -1000 600');	
						} else if(anim.antype == 'ptmv42'){
							path.setAttribute('d', 'M 100 0 L -1000 600');	
						} else if(anim.antype == 'ptmv13'){
							path.setAttribute('d', 'M -100 0 L 1000 600');	
						} else if(anim.antype == 'ptmv31'){
							path.setAttribute('d', 'M -100 0 L 1000 600');	
						} else if(anim.antype == 'ptmvh'){
							path.setAttribute('d', 'M 0 0 L 1000 0');	
						} else if(anim.antype == 'ptmvv'){
							path.setAttribute('d', 'M 0 0 L 0 1000');	
						}
						path.setAttribute('stroke', fg.opt.tags[i].s);
						path.setAttribute('stroke-width', fg.opt.tags[i].sw);
						ptt.appendChild(path);

						ptt.appendChild(animEl);

						fg.g.g[i].defs.appendChild(ptt);
						if(fg.opt.ptts == undefined || fg.opt.ptts == null){
							fg.opt.ptts = [];
						}
						for(let j=0; j < fg.opt.ptts.length; j++){
							if(fg.opt.ptts[j].pttid ==fg.opt.tags[i].lyname){
								fg.opt.ppts.slice(j,1);
							}
						}
						fg.opt.ptts.push({pttid:fg.opt.tags[i].lyname});// + '_' + tagCount;
						console.log('ptts fg----------------->', fg.opt.ptts);
						fg.opt.tags[i].fpttid = fg.opt.tags[i].lyname;// + '_' + tagCount;
						fg.g.g[i].setAttribute('fill', 'url(#' + 'ptt-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname + ')');//  + '_' + tagCount + ')');
						animEl.beginElement();
					} else if(anim.antype == 'ggb'){
						console.log('ggb-->', fg.opt);
						if(fg.g.g[i].defs == undefined){
							var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
							defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
							fg.g.g[i].appendChild(defs);
							fg.g.g[i].defs = defs;
						}
						var max = anim.max;
						var min = anim.min;
						if(max == undefined || max == null || max.trim() == ''){
							max = 100;
						}
						if(min == undefined || min == null || min.trim() == ''){
							min = 0;
						}
						// 1:x = (max-min):(to-min)
						// x = (to-min)/(max-min)
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = (vals + '').split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = 0;
								}
								valArrays[j] = lastVal;
							}
						}
						for(var j=0; j < valArrays.length; j++){
							valArrays[j] = (Number(valArrays[j]) - min)/(max-min);
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						//var frm2 = (anim.frm - min)/(max-min);
						//var to2 = (anim.to - min)/(max-min);
						//console.log('frm2', frm2, 'to2', to2);
						//var values = frm2 + ';' + to2;
						/*
						var grdBfs = fg.g.g[i].defs.querySelectorAll('[defType=guage]');
						if(grdBfs != null){
							for(var j = grdBfs.length-1; j>=0; j--){
								fg.g.g[i].defs.removeChild(grdBfs[j]);
							}
						}
						*/


						var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
						//p.setAttribute('type', ptts.name);
						grad.setAttribute('id', 'grd-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname);//  + '_' + tagCount
						grad.setAttribute('defType', 'guage');
						grad.setAttribute('x1', '100%');
						grad.setAttribute('y1', '100%');
						grad.setAttribute('x2', '100%');
						grad.setAttribute('y2', '0%');
						if(fg.opt.tags[i].o == undefined){
							fg.opt.tags[i].o = '1';
						}
						var stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop1.setAttribute('offset', '0%');
						stop1.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
						grad.appendChild(stop1);

						var stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop2.setAttribute('offset', '70%');
						stop2.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
						var animate2 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
						animate2.setAttribute('attributeName', 'offset');
						animate2.setAttribute('values', chgVals); //'0;0.7');
						if((keyTimes + '').trim() != ''){
							animate2.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animate2.setAttribute('dur', anim.dur + 's');
						animate2.setAttribute('repeatCount', anim.rptcnt);
						animate2.setAttribute('fill', 'freeze');
						stop2.appendChild(animate2);
						grad.appendChild(stop2);

						var stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop3.setAttribute('offset', '70%');
						stop3.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
						var animate3 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
						animate3.setAttribute('attributeName', 'offset');
						animate3.setAttribute('values', chgVals); //'0;0.7');
						if((keyTimes + '').trim() != ''){
							animate3.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animate3.setAttribute('dur', anim.dur + 's');
						animate3.setAttribute('repeatCount', '1');
						animate3.setAttribute('fill', 'freeze');
						stop3.appendChild(animate3);
						grad.appendChild(stop3);
						var stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop4.setAttribute('offset', '100%');
						stop4.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
						grad.appendChild(stop4);
						fg.g.g[i].defs.appendChild(grad);
						fg.opt.tags[i].fgrdid = fg.opt.tags[i].lyname;// + '_' + tagCount;
						fg.g.g[i].setAttribute('fill', 'url(#' + 'grd-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname + ')');//  + '_' + tagCount + ')');
						animate2.beginElement();
						animate3.beginElement();
						console.log('종료');
					} else if(anim.antype == 'ggbh'){
						console.log('ggbh-->', fg.opt);
						if(fg.g.g[i].defs == undefined){
							var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
							defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
							fg.g.g[i].appendChild(defs);
							fg.g.g[i].defs = defs;
						}
						var max = anim.max;
						var min = anim.min;
						if(max == undefined || max == null || max.trim() == ''){
							max = 100;
						}
						if(min == undefined || min == null || min.trim() == ''){
							min = 0;
						}
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = 0;
								}
								valArrays[j] = lastVal;
							}
						}
						for(var j=0; j < valArrays.length; j++){
							valArrays[j] = (Number(valArrays[j]) - min)/(max-min);
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}

						var grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
						//p.setAttribute('type', ptts.name);
						grad.setAttribute('id', 'grd-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname);
						grad.setAttribute('defType', 'guage');
						grad.setAttribute('x1', '0%');
						grad.setAttribute('y1', '100%');
						grad.setAttribute('x2', '100%');
						grad.setAttribute('y2', '100%');
						if(fg.opt.tags[i].o == undefined){
							fg.opt.tags[i].o = '1';
						}
						var stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop1.setAttribute('offset', '0%');
						stop1.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
						grad.appendChild(stop1);

						var stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop2.setAttribute('offset', '70%');
						stop2.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:' + fg.opt.tags[i].o);
						var animate2 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
						animate2.setAttribute('attributeName', 'offset');
						animate2.setAttribute('values', chgVals); //'0;0.7');
						if((keyTimes + '').trim() != ''){
							animate2.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animate2.setAttribute('dur', anim.dur + 's');
						animate2.setAttribute('repeatCount', '1');
						animate2.setAttribute('fill', 'freeze');
						stop2.appendChild(animate2);
						grad.appendChild(stop2);

						var stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop3.setAttribute('offset', '70%');
						stop3.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
						var animate3 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
						animate3.setAttribute('attributeName', 'offset');
						animate3.setAttribute('values', chgVals); //'0;0.7');
						if((keyTimes + '').trim() != ''){
							animate3.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animate3.setAttribute('dur', anim.dur + 's');
						animate3.setAttribute('repeatCount', '1');
						animate3.setAttribute('fill', 'freeze');
						stop3.appendChild(animate3);
						grad.appendChild(stop3);
						var stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
						stop4.setAttribute('offset', '100%');
						stop4.setAttribute('style', 'stop-color:' + fg.opt.tags[i].f + ';stop-opacity:0');
						grad.appendChild(stop4);
						fg.g.g[i].defs.appendChild(grad);
						fg.opt.tags[i].fgrdid = fg.opt.tags[i].lyname;// + '_' + tagCount;
						fg.g.g[i].setAttribute('fill', 'url(#' + 'grd-' + fg.opt.figid + '_' + fg.opt.tags[i].lyname + ')');// + '_' + tagCount + ')');
						animate2.beginElement();
						animate3.beginElement();
						console.log('종료');
					/*} else if(anim.antype == 'ggr'){
						console.log('ggr-->',i, fg.opt.tags[i]);
						console.log('>>', fg.opt.tags[i].rox, defaultNull(fg.opt.tags[i].rox,0));
						var roX = defaultNull(fg.opt.tags[i].rox,0) * fg.opt.w/100;
						var roY = defaultNull(fg.opt.tags[i].roy,0) * fg.opt.h/100;
						
						//var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[type=rotate]');
						//console.log('>>',bfAnims);
						//for(var j=0; j < bfAnims.length; j++){
						//    fg.g.g[i].removeChild(bfAnims[j])
						//}
						
						var frm = '';
						if(anim.frm == undefined || anim.frm == null || anim.frm == ''){
							//frm = fg.g.g[i].ro;
							frm = fg.getState(anim.stt).to; // 마지막상태
						} else {
							frm = anim.frm;
						}
						if(frm == undefined){
							frm = "0"; // undefined가 전달되면 오동작이 일어남.
						}
						var max = anim.afdur;
						var min = anim.bfdur;
						if(max == undefined || max == null || max.trim() == ''){
							max = 100;
						}
						if(min == undefined || min == null || min.trim() == ''){
							min = 0;
						}
						// 360:x = (max-min):(to-min)
						// x = (to-min) * 360/(max-min)
						var frm2 = (anim.frm - min) * 360/(max-min);
						var to2 = (anim.to - min) * 360/(max-min);
						console.log('frm2', frm2, 'to2', to2);
						//var values = frm2 + ';' + to2;

						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "transform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "rotate");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "from", frm2 + " " + roX + " " + roY);
						animEl.setAttributeNS(null, "to", to2 + " " + roX + " " + roY);
						animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
						//fg.opt.tags[i].tro = anim.to;
					}*/
					} else if(anim.antype == 'txt' || anim.antype == 'ggt'){
						console.log('ggt-->',i, fg.opt.tags[i]);
						var valArray = (anim.vals + '').split(';');
						var lastVal = valArray[valArray.length-1];
						if(fg.opt.tags[i].name == 'text'){
							fg.opt.tags[i].txt = lastVal;
							fg.refresh();
							fg.draw();
						}
					} else if(anim.antype == 'mvp'){
						console.log('mvp-->',i, fg.opt.tags[i]);

						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animateMotion');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var toPathD = '';
						for(var j=0; j < fg.opt.tags.length; j++){
							if (fg.opt.tags[j].lyname == anim.vals){
								var toPathD = changeToRealPath(fg.opt.tags[j].d,fg.get('w'), fg.get('h'), 0, 0);
							}
						}
						console.log('mvp pathD', toPathD );
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
						animEl.setAttributeNS(null, "attributeName", "transform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "translate");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "path", toPathD);//"M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z");//anim.path);
						animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");

						fg.g.g[i].appendChild(animEl);
						
						animEl.beginElement();
					} else if(anim.antype == 'mpp'){
						console.log('mpp-->', fg.opt);
						/*
							var bfAnims = fg.g.tags[i].querySelectorAll('animate[attributeName=d]');
							console.log('>>',bfAnims);
							for(var j=0; j < bfAnims.length; j++){
								fg.g.tags[i].removeChild(bfAnims[j]);
							}
						*/
						
			
						/*
						<animate attributeName="d" values="M100,250 C 100,50 400,50 400,250;M100,250 C 100,50 400,50 400,450;M100,250 C 100,50 400,50 400,250"  dur="5s" repeatCount="indefinite"></animate>
						var posTo = fg.sed.getComp(to);
								//var pathLength = Math.floor( posTo.g.path.getTotalLength() );
								//anim.pathLength = pathLength;
								var p = (durTotNum - durNum)/durTotNum;
							var prcnt = (p * pathLength);
							var pt = fg.group.tag.getPointAtLength(prcnt);
							changeToBasicPath()
						*/
					
						var fromIndex = null;
						var toIndex = null;
						var fromPathLen = 0;
						var toPathLen = 0;
						
						var vals = anim.vals;
						console.log('vals',vals);
						var valArray = vals.split(';');
						var frm = valArray[0];
						var to = valArray[1];

						console.log('frm', frm, 'to', to);

						for(var j=0; j < fg.opt.tags.length; j++){
							if (fg.opt.tags[j].lyname == frm){
								//fromPathD = changeToBasicPath(fg.opt.tags[j].d,fg.get('w'), fg.get('h'), 0, 0);
								fromPathLen = fg.g.tags[j].getTotalLength();
								fromIndex = j;
							}
							if (fg.opt.tags[j].lyname == to){
								//toPathD = changeToBasicPath(fg.opt.tags[j].d,fg.get('w'), fg.get('h'), 0, 0);
								toPathLen = fg.g.tags[j].getTotalLength();
								toIndex = j;
							}
						}
						var strD = '';
						var gab=20;
						console.log('>>',fg.g.tags)
						for(var j=0; j < gab; j++){
							console.log('>>>', j, fromIndex, )
							var tempFromPos = fg.g.tags[fromIndex].getPointAtLength(fromPathLen * j/gab);
							var tempToPos = fg.g.tags[toIndex].getPointAtLength(toPathLen * j/gab);
							if(j==0){
								strD = 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
							} else {
								strD = strD + 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
							}
						}
						{
							var tempFromPos = fg.g.tags[fromIndex].getPointAtLength(fromPathLen);
							var tempToPos = fg.g.tags[toIndex].getPointAtLength(toPathLen);
							strD = strD + 'M' + tempFromPos.x + ' ' + tempFromPos.y + ' L' + tempToPos.x + ' ' + tempToPos.y + ';';
						}
						console.log('strD', strD);
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "d");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", strD);
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.tags[i].appendChild(animEl);
						
						animEl.beginElement();
					} else if(anim.antype == 'sc'){
						console.log('sc-->', fg.opt);
						/*
						var bfAnims = fg.g.querySelectorAll('animateTransform[type=scale]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '1';
								}
								valArrays[j] = lastVal;
							}
						}
						
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "transform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "scale");
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					} else if(anim.antype == 'fll'){
						console.log('fll-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke-dashoffset]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "stroke-dashoffset");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", "10000;0");
						//animEl.setAttributeNS(null, "to", "0");
						animEl.setAttributeNS(null, "fill", "freeze");
						
						fg.g.g[i].appendChild(animEl);
						
						animEl.beginElement();
					} else if(anim.antype == 'flr'){
						console.log('flr-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke-dashoffset]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "stroke-dashoffset");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", "0;10000");
						//animEl.setAttributeNS(null, "to", "10000");
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					} else if(anim.antype == 'f'){
						console.log('f-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=fill]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}

						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "fill");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					} else if(anim.antype == 's'){
						console.log('s-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "stroke");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					} /*else if(anim.antype == 'ptro'){
						console.log('sc-->', fg.opt);
						var bfAnims = fg.g.defs.querySelectorAll('animateTransform[attributeName=patternTransform]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							bfAnims[j].parentNode.removeChild(bfAnims[j])
						}
						
						var rox= changeToRealX(fg.opt.tags[i].rox, fg.get('w'));
						var roy= changeToRealY(fg.opt.tags[i].roy, fg.get('h'));

						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
						animEl.setAttributeNS(null, "attributeName", "patternTransform");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "type", "rotate");
						animEl.setAttributeNS(null, "from", anim.frm + ' ' + rox + ' ' + roy);
						animEl.setAttributeNS(null, "to", anim.to + ' ' + rox + ' ' + roy);
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin", anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						//animEl.setAttributeNS(null, "fill", "freeze");
						animEl.setAttributeNS(null, "additive", "sum");
						var patternId = fg.opt.tags[i].fpttid;
						console.log('fg.opt', fg.opt);
						for(var k=0; k < fg.opt.ptts.length; k++ ){
							console.log('--->', fg.opt.ptts[k].pttid, patternId )
							if(fg.opt.ptts[k].pttid == patternId){
								var ptt = fg.g.querySelector('[id=ptt-' + fg.opt.figid + '_'+ patternId + ']');
								console.log('[id=ptt-' + fg.opt.figid + '_'+ patternId + ']');
								console.log('ptt', ptt);
								ptt.appendChild(animEl);
							}
						}
						animEl.beginElement();
					}*/ else if(anim.antype == 'cpp'){
						console.log('if-->',i, fg.opt.tags[i]);
						console.log('>>', fg.opt.tags[i].rox, defaultNull(fg.opt.tags[i].rox,0));
						/*
						var bfAnims = fg.g.tags[i].querySelectorAll('animate[attributeName=d]');
						console.log('>>',bfAnims, anim);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.tags[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						
						for(var j=0; j < valArrays.length; j++){
							for(var k=0; k < fg.opt.tags.length; k++){
								if(fg.opt.tags[k].lyname == valArrays[j]){
									var d = fg.opt.tags[k].d;
									valArrays[j] =  changeToRealPath(d, fg.opt.w, fg.opt.h);
								}
							}
						}
						var chgVals = '';
						
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "d");
						animEl.setAttributeNS(null, "attributeType", "XML");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						//animEl.setAttributeNS(null, "begin",anim.bfdur + "s");
						//animEl.setAttributeNS(null, "end", anim.afdur + "s");  
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						//animEl.setAttributeNS(null, "from", frm);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						//animEl.setAttributeNS(null, "additive", "sum");
						fg.g.tags[i].appendChild(animEl);
						animEl.beginElement();
					} else if (anim.antype == 'fo'){
						console.log('s-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=opacity]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "fill-opacity");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					}  else if(anim.antype == 'so'){
						console.log('s-->',i, fg.opt.tags[i]);
						/*
						var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=opacity]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.g[i].removeChild(bfAnims[j])
						}
						*/
						var vals = anim.vals;
						var keyTimes = anim.keytms;
						console.log('vals',vals);
						var valArrays = vals.split(';');
						// current 처리하기
						for(var j=0; j < valArrays.length; j++){
							if(valArrays[j] == '{current}'){
								var lastVal = fg.getState(anim.stt).lastVal;
								if(lastVal == ''){
									lastVal = '';
								}
								valArrays[j] = lastVal;
							}
						}
						var chgVals = '';
						for(var j=0; j < valArrays.length; j++){
							if(j==0){
								chgVals = valArrays[j];    
							} else {
								chgVals = chgVals + ';' + valArrays[j];
							}
						}
						var animEl = document.createElementNS("http://www.w3.org/2000/svg", "animate");
						animEl.setAttributeNS(null, "attributeName", "stroke-opacity");
						animEl.setAttributeNS(null, "attributeType", "CSS");
						animEl.setAttributeNS(null, "dur", anim.dur + "s");
						animEl.setAttributeNS(null, "repeatCount", anim.rptcnt);
						animEl.setAttributeNS(null, "values", chgVals);
						if((keyTimes + '').trim() != ''){
							animEl.setAttributeNS(null, "keyTimes", keyTimes);
						}
						animEl.setAttributeNS(null, "fill", "freeze");
						fg.g.g[i].appendChild(animEl);
						animEl.beginElement();
					} 
				}
			}
		}
	}
	static animRemove (fg, stt){
		console.log('animRemove', fg, stt)
		for(var index =0; index < fg.opt.anims.length; index++){
			if(fg.opt.anims[index].stt == stt){
				var anim = fg.opt.anims[index];
				if(anim.lyname == 'all'){
					if(anim.antype == 'ro'){
						var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=rotate]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j])
						}
					
					} else if(anim.antype == 'mv'){
						console.log('mv-->', fg.opt);
						var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=translate]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j])
						}
					} else if(anim.antype == 'mvp'){
						console.log('mvp-->', fg.opt);
						var bfAnims = fg.g.querySelectorAll(':scope>animateMotion');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j]);
						}
					} else if(anim.antype == 'mpp'){
						console.log('mpp-->', fg.opt);
						try{
							var bfAnims = fg.g.querySelectorAll('animate[attributeName=d]');
							console.log('>>',bfAnims);
							for(var j=0; j < bfAnims.length; j++){
								fg.g.path.removeChild(bfAnims[j]);
							}
						}catch(e){}
					}  else if(anim.antype == 'ggb' || anim.antype == 'ggbh' || anim.antype == 'ggr' || anim.antype == 'ggp' || anim.antype == 'ggt' || anim.antype == 'ptmv' ){
						alert('Change the component animation!!');
						return;
						// ggb는 all로 처리못함
						
					} else if(anim.antype == 'sc'){
						console.log('sc-->', fg.opt);
						var bfAnims = fg.g.querySelectorAll(':scope>animateTransform[type=scale]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j]);
						}
					} else if(anim.antype == 'fll'){
						console.log('fll-->',fg.opt);
			
						var bfAnims = fg.g.querySelectorAll(':scope>animate[attributeName=stroke-dashoffset]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j])
						}
					} else if(anim.antype == 'flr'){
						console.log('flr-->', fg.opt.tags[i]);
			
						var bfAnims = fg.g.querySelectorAll(':scope>animate[attributeName=stroke-dashoffset]');
						console.log('>>',bfAnims);
						for(var j=0; j < bfAnims.length; j++){
							fg.g.removeChild(bfAnims[j])
						}
					} 
				} else {
					for(var i=0 ; i < fg.opt.tags.length;i++){
						if(fg.opt.tags[i].lyname == anim.lyname ){
							console.log('i',i,anim.antype);
							if(anim.antype == 'ro'){
								console.log('if-->',i, fg.opt.tags[i]);
								console.log('>>', fg.opt.tags[i].rox, defaultNull(fg.opt.tags[i].rox,0));
								var roX = defaultNull(fg.opt.tags[i].rox,0) * fg.opt.w/100;
								var roY = defaultNull(fg.opt.tags[i].roy,0) * fg.opt.h/100;
			
								var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[type=rotate]');
								console.log('>>',bfAnims, anim);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
							} else if(anim.antype == 'mv'){
								console.log('mv-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[type=translate]');
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
							} else if(anim.antype == 'ptmv'){
								console.log('ptmv-->', fg.opt);
								if(fg.g.g[i].defs == undefined){
									var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
									defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
									fg.g.g[i].appendChild(defs);
									fg.g.g[i].defs = defs;
								}
								var pttBfs = fg.g.g[i].defs.querySelectorAll('[defType=pattern]');
								if(pttBfs != null){
									for(var j = pttBfs.length-1; j>=0; j--){
										fg.g.g[i].defs.removeChild(pttBfs[j]);
									}
								}
							} else if(anim.antype == 'ggb' || anim.antype == 'ggbh'){
								console.log('ggb-->', fg.opt);
								if(fg.g.g[i].defs == undefined){
									var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
									defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
									fg.g.g[i].appendChild(defs);
									fg.g.g[i].defs = defs;
								}
								var grdBfs = fg.g.g[i].defs.querySelectorAll('[defType=guage]');
								if(grdBfs != null){
									for(var j = grdBfs.length-1; j>=0; j--){
										fg.g.g[i].defs.removeChild(grdBfs[j]);
									}
								}
							} else if(anim.antype == 'ggr'){
								console.log('ggr-->',i, fg.opt.tags[i]);
								//console.log('>>', fg.opt.tags[i].rox, defaultNull(fg.opt.tags[i].rox,0));
								//var roX = defaultNull(fg.opt.tags[i].rox,0) * fg.opt.w/100;
								//var roY = defaultNull(fg.opt.tags[i].roy,0) * fg.opt.h/100;
			
								var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[type=rotate]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
							} else if(anim.antype == 'ggt' || anim.antype == 'txt'){
								console.log('ggt-->',i, fg.opt.tags[i]);
			
				
								//var bfAnims = fg.g.g[i].querySelectorAll('animateMotion');
								//console.log('>>',bfAnims);
								//for(var j=0; j < bfAnims.length; j++){
								//    fg.g.g[i].removeChild(bfAnims[j])
								//}
							} else if(anim.antype == 'mvp'){
								console.log('mvp-->',i, fg.opt.tags[i]);
			
				
								var bfAnims = fg.g.g[i].querySelectorAll('animateMotion');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
							}else if(anim.antype == 'mpp'){
								console.log('mpp-->', fg.opt);
								{
									var bfAnims = fg.g.tags[i].querySelectorAll('animate[attributeName=d]');
									console.log('>>',bfAnims);
									for(var j=0; j < bfAnims.length; j++){
										fg.g.tags[i].removeChild(bfAnims[j]);
									}
								}
								
							} else if(anim.antype == 'sc'){
								console.log('sc-->', fg.opt);
								var bfAnims = fg.g.querySelectorAll('animateTransform[type=scale]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
								
							}  else if(anim.antype == 'fll'){
								console.log('fll-->',i, fg.opt.tags[i]);
			
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke-dashoffset]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
							
							} else if(anim.antype == 'flr'){
								console.log('flr-->',i, fg.opt.tags[i]);
			
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke-dashoffset]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
								
							} else if(anim.antype == 'f'){
								console.log('f-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=fill]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
								
							} else if(anim.antype == 's'){
								console.log('s-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=stroke]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									fg.g.g[i].removeChild(bfAnims[j])
								}
								
							} else if(anim.antype == 'ptro'){
								console.log('s-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animateTransform[attributeName=patternTransform]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									bfAnims[j].parentNode.removeChild(bfAnims[j])
								}
								
							} else if(anim.antype == 'cpp'){
								console.log('s-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.tags[i].querySelectorAll('animate[attributeName=d]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									bfAnims[j].parentNode.removeChild(bfAnims[j])
								}
								
							}else if(anim.antype == 'opf'){
								console.log('s-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=opacity]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									bfAnims[j].parentNode.removeChild(bfAnims[j])
								}
								
							} else if(anim.antype == 'ops'){
								console.log('s-->',i, fg.opt.tags[i]);
								var bfAnims = fg.g.g[i].querySelectorAll('animate[attributeName=opacity]');
								console.log('>>',bfAnims);
								for(var j=0; j < bfAnims.length; j++){
									bfAnims[j].parentNode.removeChild(bfAnims[j])
								}
							}  else if(anim.antype == 'ptmv'){
								if(fg.g.g[i].defs == undefined){
									var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
									defs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
									fg.g.g[i].appendChild(defs);
									fg.g.g[i].defs = defs;
								}
								var grdBfs = fg.g.g[i].defs.querySelectorAll('animateTransform[attributeName=patternTransform]');
								if(grdBfs != null){
									for(var j = grdBfs.length-1; j>=0; j--){
										fg.g.g[i].defs.removeChild(grdBfs[j]);
									}
								}
							}   
						}
					}
				}
			}  
		}
	}

	static animAdd (fg, stt, vals) {
		console.log('animAdd');
		if(fg.opt.anims != undefined && fg.opt.anims != null){
			// 애니메이션이 동일 레이이어있을 경우 레이어안의 동일타입 animatin을 모두 삭제하고 들어간다.
			// 그래야 두가지 이상의 애니메이션도 설정할 수가 있다.
			animRemove(fg, stt);        
			// 애니메이션을 설정한다.
			for(var i=0; i < fg.opt.anims.length; i++){
				if(fg.opt.anims[i].stt == stt ){
					var anim = JSON.parse(JSON.stringify(fg.opt.anims[i]));

					if(vals != null && vals != ''){
						anim.vals = vals;
					}
					addAnimTag(fg, anim);


					// 상태를 기억하게 하기 위함.
					fg.opt.state[stt] = {};
					fg.opt.state[stt].act = true;
					fg.opt.state[stt].vals = anim.vals;
					if(anim.vals != null && (anim.vals + '').trim() != ''){
						var valArray = (anim.vals + '').split(';');
						var lastVal = valArray[valArray.length -1];
						fg.opt.state[stt].lastVal = lastVal;
					} else {
						fg.opt.state[stt].lastVal = '';
					}

					/*
					console.log('anim.frm************', anim.frm)
					if(anim.antype == 'mv'){
					} else if(anim.antype == 'mvt'){
					} else if(anim.antype == 'mvp'){
					} else if(anim.antype == 'mpp'){
					} else if(anim.antype == 'sc'){
					} else if(anim.antype == 'fll'){    // flow left
						
						var frm = 0;
						var to = 1000;
						var sdoff = fg.opt.sdoff;
						if(sdoff == undefined){
							sdoff = 0;
						}
						anim.stt = stt;
						anim.sdoff = sdoff;
						
					}  else if(anim.antype == 'flr'){    // flow left
						
						var frm = 1000;
						var to = 1;
						var sdoff = fg.opt.sdoff;
						if(sdoff == undefined){
							sdoff = 1000;
						}
						anim.stt = stt;
						anim.sdoff = sdoff;
						
					} else if(anim.antype == 'ro'){
					} else if(anim.antype == 'f'){
					} else if(anim.antype == 's'){
					} else if(anim.antype == 'ggt'){
					} else if(anim.antype == 'ptro'){
					}
					*/
					
				}
			}    
		}
	}

	static count = 0;

	static _toXY (cX, cY, r, degrees) {
		var rad = (degrees) * Math.PI / 180.0;
		return {
			x: cX + (r * Math.cos(rad)),
			y: cY + (r * Math.sin(rad))
		};
	}
	static calcPie (x, y, radiusIn, radiusOut, startAngle, endAngle) {
		startAngle = startAngle - 90;
		endAngle = endAngle - 90;
		
		var startIn = _toXY(x, y, radiusIn, endAngle);
		var endIn = _toXY(x, y, radiusIn, startAngle);
		var startOut = _toXY(x, y, radiusOut, endAngle);
		var endOut = _toXY(x, y, radiusOut, startAngle);
		var arcSweep = (endAngle - startAngle) <= 180 ? "0" : "1";
		var d = [
			"M", startIn.x, startIn.y,
			"L", startOut.x, startOut.y,
			"A", radiusOut, radiusOut, 0, arcSweep, 0, endOut.x, endOut.y,
			"L", endIn.x, endIn.y,
			"A", radiusIn, radiusIn, 0, arcSweep, 1, startIn.x, startIn.y,
			"z"
		].join(" ");
		return d;
	}
	static getSeqName (list, fieldName, adhere){
		var count=0;
		if(list == undefined){
			return adhere + count;
		}
		for(count =0;count < 1000; count++){
			var exist= false;
			for(var i=0; i < list.length; i++){
				var obj = list[i];
				//console.log('>>', obj[fieldName], adhere + count);
				if(obj[fieldName] == adhere + count){
					exist = true;
					break;
				}
			}
			if(exist == false){
				break;
			}
			
		}
		//console.log('count', count);
		return adhere + count;
	}
	static movePointGridMode (pSed, x, y){
		console.log('gridPoint', pSed.gridPoint);
		if(pSed.gridPoint == null || pSed.gridPoint == 'center'){
			var restX = x % pSed.gridSizeH;
			var restY = y % pSed.gridSizeV;

			if(restX < pSed.gridSizeH/2) {
				x = x-restX;
			} else {
				x = x-restX + pSed.gridSizeH;
			}
			if(restY < pSed.gridSizeV/2) {
				y = y-restY;
			} else {
				y = y-restY + pSed.gridSizeV;
			}
			// ////console.log('moveGrid - x' ,x, 'y', y)
			return {
				x:x,
				y:y
			}
		} else if(pSed.gridPoint == 'leftTop'){
			
			let x = pSed.selectedDownFg.get('x');
			let w = pSed.selectedDownFg.get('w');
			let left = x - w/2;
			let y = pSed.selectedDownFg.get('y');
			let h = pSed.selectedDownFg.get('g');
			let top = y - h/2;

			var restX = left % pSed.gridSizeH;
			var restY = top % pSed.gridSizeV;

			if(restX < pSed.gridSizeH/2) {
				left = left-restX;
			} else {
				left = left-restX + pSed.gridSizeH;
			}
			if(restY < pSed.gridSizeV/2) {
				top = top-restY;
			} else {
				top = top-restY + pSed.gridSizeV;
			}
			console.log('moveGrid - top' ,top , 'left', left)
			x = left + w/2;
			y = top + w/2;
			return {
				x:x,
				y:y
			}
		}
	}
	static connectorDropData (pSed, data, offsetX, offsetY){
		var dList = parsePath(data.d);
		//console.log(dList);
		var dotList = [];
		var bfX = 0;
		var bfY = 0;
		var gabX = 0;
		var gabY = 0;
		for(var i=0; i < dList.length; i++){
			//console.log('dList', dList[i]);
			var dotInfoList = parsePathDot(dList[i]);
			//console.log('dotInfoList', dotInfoList);
			for(var j=0; j < dotInfoList.length; j++){
				var dotInfo = dotInfoList[j];
				if(i==0 && j==0){
					gabX = Number(offsetX) - Number(dotInfo.x);
					gabY = Number(offsetY) - Number(dotInfo.y);
				}
				if(dotInfo.kind == 'M' || dotInfo.kind == 'L'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'H' || dotInfo.kind == 'h'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(bfY);
				} else if(dotInfo.kind == 'V' || dotInfo.kind == 'v'){
					dotInfo.x = Number(bfX);
					dotInfo.y = Number(dotInfo.y) + gabY;
				}  else if(dotInfo.kind == 'Q' || dotInfo.kind == 'q'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'Q1'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'C' || dotInfo.kind == 'c'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'C1'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'C2'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'S2'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'S'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'T'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'A' || dotInfo.kind == 'a'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				} else if(dotInfo.kind == 'A1'){
					dotInfo.x = Number(dotInfo.x) + gabX;
					dotInfo.y = Number(dotInfo.y) + gabY;
				}
				if(j== 0){
					bfX = dotInfo.x;
					bfY = dotInfo.y;
				} else {
					if(dotInfo.kind=='H'){
						bfY = dotInfo.y;
					} else if(dotInfo.kind == 'V'){
						bfX = dotInfo.x;
					}
				}
				dotList.push(dotInfo);
			}
		}
		data.x1 = (offsetX / pSed.screenRatio);
		data.y1 = (offsetY / pSed.screenRatio);
		if(dotList[dotList.length-1].kind == 'H'){
			data.x2 = (dotList[dotList.length-1].x / pSed.screenRatio);
			data.y2 = bfY;
		} else if(dotList[dotList.length-1].kind == 'V'){
			data.x2 = bfX;
			data.y2 = (dotList[dotList.length-1].y / pSed.screenRatio);
		} else {
			data.x2 = (dotList[dotList.length-1].x / pSed.screenRatio);
			data.y2 = (dotList[dotList.length-1].y / pSed.screenRatio);
		}
		if(data.type == 'flowline'){
			var dot0 = dotList[0];
			var dot1 = dotList[dotList.length-1];
			dotList = [];
			dotList.push(dot0);
			dotList.push(dot1);
			
		}

		var strD = stringifyPath(dotList);
		var strDH = stringifyPathHelp(dotList);
		//console.log('strPath**********************', strD);
		// data.tags[0].d = strD;
		data.d = strD;
		if(data.type != 'flowline'){
			data.helpD = strDH;
		} else {
			data.helD = undefined;
		}
		return data;
	}
	static connectAuto (fg, pSed){
		if(fg == undefined || fg == null){
			return;
		}
		fg.sed.svg.appendChild(fg.g);
		var diagramDoms = pSed.svg.querySelectorAll('[fig=basic]');
		//console.log('diagramDoms', diagramDoms.length);
		for(var i=0; i< diagramDoms.length; i++){
			var diagram = diagramDoms[i].fg;
			if(fg == diagram){
				continue;
			}
			if( fg.get('x') > diagram.get('x') - diagram.get('width') &&
				fg.get('x') < diagram.get('x') + diagram.get('width') &&
				fg.get('y') > diagram.get('y') - diagram.get('height') &&
				fg.get('y') < diagram.get('y') + diagram.get('height')){
				//console.log('들어옴');
				var exist = false;
				for(var j=0; j < fg.g.jdots.length && exist == false; j++){
					for( var j2=0; j2 < fg.g.jdots[j].conn.length && exist == false; j2++){
						var lineTemp = fg.g.jdots[j].conn[j2];
						for(var k=0; k < lineTemp.g.jdots.length && exist == false; k++){
							for(var k2=0; k2 <lineTemp.g.jdots[k].conn.length && exist == false; k2++ ){
								var tempFg = lineTemp.g.jdots[k].conn[k2];
								if(tempFg == diagram){
									exist = true;
									break ;
								}
							}
						}
					}
				}
				if(exist == true){
					break;
				}
				console.log('exist', exist);
				var diagramType = diagram.opt.diagramType;
				var diagramTypeCheck = false;
				for(var j=0; j < fg.opt.connectInputEnables.length; j++){
					if(diagramType == fg.opt.connectInputEnables[j]){
						diagramTypeCheck= true;
						break;
					}
				}
				console.log('diagramTypeCheck', diagramTypeCheck);
				if(diagramTypeCheck == false){
					return;
				}
				var inputIndex = getInputJoinIndex(fg);
				var outputIndex = getOutputJoinIndex(diagram);
				//console.log('inputIndex', inputIndex, outputIndex);
				if(inputIndex == null || outputIndex == null){
					return;
				}
				// 수정예정.
				var line = pSed.createFlowline(100, 100);//createConnectorLine(pSed, 100, 100); // 이름조삼.

				//fg.g.jdots[inputIndex].conn.push(line);
				//fg.g.jdots[inputIndex].connIndex.push(1);
				//fg.opt.jdots[inputIndex].connId.push(line.get('figid'));
				//fg.opt.jdots[inputIndex].connIndex.push(1);
				//line.g.jdots[1].conn.push(fg);
				//line.g.jdots[1].connIndex.push(inputIndex);
				line.opt.jdots[1].connId = fg.get('figid');
				line.opt.jdots[1].connIndex = inputIndex;

				//diagram.g.jdots[outputIndex].conn.push(line);
				//diagram.g.jdots[outputIndex].connIndex.push(0);
				//diagram.opt.jdots[outputIndex].connId.push(line.get('figid'));
				//diagram.opt.jdots[outputIndex].connIndex.push(0);
				//line.g.jdots[0].conn.push(diagram);
				//line.g.jdots[0].connIndex.push(outputIndex);
				line.opt.jdots[0].connId = diagram.get('figid');
				line.opt.jdots[0].connIndex = outputIndex;

				fg.moveTo(0,0);
				diagram.moveTo(0,0);
				//console.log('연결');
				break;
			}
		}      
	}
	static getInputJoinIndex (fg){
		var joinDotsPosData = fg.opt.joinDotsPosData;
		for(var i=0; i< joinDotsPosData.length; i++){
			if(joinDotsPosData[i].inout == 'in' ||  joinDotsPosData[i].inout == 'inout'){
				/*
				if(fg.g.jdots[i].conn.length < joinDotsPosData[i].limit){           // 해당도형 연결점에 연결된 연결선가져오기
					return i;
				}
				*/
				if(getConnectorFg(fg, i).length < joinDotsPosData[i].limit){
					return i;
				}
			} 
		}    
		return null;
	}
	static getOutputJoinIndex (fg){
		var inputCount = fg.opt.connectInputCount;
		var outputCount = fg.opt.connectOutputCount;
		var joinDotsPosData = fg.opt.joinDotsPosData;
		for(var i=0; i< joinDotsPosData.length; i++){
			if(joinDotsPosData[i].inout == 'out' ||  joinDotsPosData[i].inout == 'inout'){
				/*
				if(fg.g.jdots[i].conn.length < joinDotsPosData[i].limit){
					return i;
				}
				*/
				if(getConnectorFg(fg, i).length < joinDotsPosData[i].limit){
					return i;
				}
			} 
		}
		return null;
	}
	static getLeftFg (fg){
		if(fg.opt.fig != 'connector'){
			alert('연결선만 가능한 함수입니다.')
			console.log('잘못된 객체', fg);
			return;
		}
		let connId = fg.opt.jdots[0].connId;
		if(connId == undefined || connId == null || connId == ''){
			return null;
		}
		let ret =  fg.sed.svg.querySelector('[figid=' + connId + ']');
		if(ret == null){
			return null;
		}
		return ret.fg;
	}
	static getRightFg (fg){
		if(fg.opt.fig != 'connector'){
			alert('연결선만 가능한 함수입니다.')
			console.log('잘못된 객체', fg);
			return;
		}
		let connId = fg.opt.jdots[1].connId;
		if(connId == undefined || connId == null || connId == ''){
			return null;
		}
		let ret = fg.sed.svg.querySelector('[figid=' + connId + ']');
		if(ret == null){
			return null;
		}
		return ret.fg;
	}
	static getBasicFg (fg, index){
		let connId = fg.opt.jdots[index].connId;
		if(connId == null || connId == ''){
			return null;
		}
		let ret = fg.sed.svg.querySelector('[figid=' + connId+ ']');
		if(ret == null){
			return null;
		}
		return ret.fg;
	}
	static getConnectorFg (fg, index){
		let ret = [];
		let allFigs = fg.sed.svg.querySelectorAll('[fig=connector]');
		for(let i=0; i < allFigs.length; i++){
			let tempFg = allFigs[i].fg;
			for(let j=0; j < tempFg.opt.jdots.length;j++){
				if(index == null){
					if(tempFg.opt.jdots[j].connId == fg.opt.figid){
						ret.push(tempFg);
					}
				} else {
					if(tempFg.opt.jdots[j].connId == fg.opt.figid && tempFg.opt.jdots[j].connIndex == index){
						ret.push(tempFg);
					}
				}
			}
		}
		return ret;
	}
	static getParentFg (fg){
		let figid = fg.opt.prntid;
		let g =  fg.sed.svg.querySelector('[figid=' + figid+']');
		if(g == null){
			return null;
		}
		return g.fg;
	}
	static getRootParentFg (fg){
		let figid = fg.opt.prntid;
		if(figid == undefined || figid == null || figid == ''){
			return null;
		}
		let g =  fg.sed.svg.querySelector('[figid=' + figid+']');
		if(g == null){
			return null;
		} else {
			let ret = getRootParentFg(g.fg);
			if(ret == null){
				return g.fg;
			} else {
				return ret;
			}
		}
		return g.fg;
	}
	static getLayerIndex (fg, lyname){   //prntly로 인덱스를 찾을 경우 null은 레이어가 없을 경우.
		if(lyname == undefined || lyname == null || lyname == ''){
			return null;
		}
		for(let i=0; i < fg.opt.tags.length; i++){
			if(lyname == fg.opt.tags[i].lyname){
				return i;
			}
		}
		return null;
	}
	static getChildFg (fg, figType){
		let ret = [];
		if(figType == null || figType == 'basic'){
			let allFigs = fg.sed.svg.querySelectorAll('[fig=basic]');
			for(let i=0; i < allFigs.length; i++){
				let tempFg = allFigs[i].fg;
				if(tempFg.opt.prntid == fg.opt.figid){
					ret.push(tempFg);
				}
			}
		}
		if(figType == null || figType == 'connector'){
			let allFigs2 = fg.sed.svg.querySelectorAll('[fig=connector]');
			for(let i=0; i < allFigs2.length; i++){
				let tempFg = allFigs2[i].fg;
				if(tempFg.opt.prntid == fg.opt.figid){
					ret.push(tempFg);
				}
			}
		}
		return ret;
	}

	static getAllChildFg (fg, figType){
		let ret = [];
		if(figType == null || figType == 'basic'){
			let allFigs = fg.sed.svg.querySelectorAll('[fig=basic]');
			for(let i=0; i < allFigs.length; i++){
				let tempFg = allFigs[i].fg;
				if(tempFg.opt.prntid == fg.opt.figid){
					ret.push(tempFg);
					let retChild = getAllChildFg(tempFg);
					for(let j=0; j < retChild.length; j++){
						ret.push(retChild[j]);
					}
				}
			}
		}
		if(figType == null || figType == 'connector'){
			let allFigs2 = fg.sed.svg.querySelectorAll('[fig=connector]');
			for(let i=0; i < allFigs2.length; i++){
				let tempFg = allFigs2[i].fg;
				if(tempFg.opt.prntid == fg.opt.figid){
					ret.push(tempFg);
				}
			}
		}
		return ret;
	}

	static drawFlowline (fg){
		if(fg == undefined || fg.g == undefined){
			return;
		}
		
		//console.log('drawFlowline***********', fg);
		var x1, x2, x3, x4, x5, x6;
		var y1, y2, y3, y4, y5, y6;
		var x1 = Number(fg.get('x1'));
		var y1 = Number(fg.get('y1'));
		var x6 = Number(fg.get('x2'));
		var y6 = Number(fg.get('y2'));
		var startDir = 1;
		var endDir = 3;
		////console.log('x1', x1, y1, x6, y6);
		////console.log(fg.g.jdots);
		//fg.opt.lineMoveMode = 'A';
		// 단순형.
		if( fg.opt.jdots[0].connId != null && fg.opt.jdots[0].connId != ''  && 
			fg.opt.jdots[1].connId != null && fg.opt.jdots[1].connId != ''){
			//var startIndex = fg.g.dots[0].connIndex;
			//var endIndex = fg.g.dots[1].connIndex;
			var gab = 25;
			console.log('fg', fg.opt);
			var st = this.getLeftFg(fg);//fg.g.jdots[0].conn[0];
			if(st == null){
				return;
			}
			console.log('st', st);
			var startIndex = fg.opt.jdots[0].connIndex;        
			st.setGroupArea();
			var end = this.getRightFg(fg);//fg.g.jdots[1].conn[0];
			if(end == null){
				return;
			}
			console.log('end',end);
			var endIndex = fg.opt.jdots[1].connIndex;
			end.setGroupArea();
			var stArea = this.getPosArea(st);
			var endArea = this.getPosArea(end);
			var startTargetCenter = (stArea.left + stArea.right) /2;
			var startTargetMiddle = (stArea.top + stArea.bottom) /2;
			var startTargetLeft =   stArea.left;
			var startTargetRight =  stArea.right;
			var startTargetTop =    stArea.top;
			var startTargetBottom = stArea.bottom;
			var endTargetCenter = (endArea.left + endArea.right) /2;
			var endTargetMiddle = (endArea.top + endArea.bottom) /2;
			var endTargetLeft =   endArea.left;
			var endTargetRight =  endArea.right;
			var endTargetTop =    endArea.top;
			var endTargetBottom = endArea.bottom;
			var startRotate = this.getRotateCalc(st); // this.getRotateCalc(fg.g.jDots[0].conn[0], fg.g.jDots[0].conn[0].r);
			
			//console.log('>>>', startRotate,fg.g.jDots[0].conn[0] );
			
			//console.log('st.opt.fig************',st.opt.fig);
			var endRotate = this.getRotateCalc(end); //this.getRotateCalc(fg.g.jDots[1].conn[0], fg.g.jDots[1].conn[0].r);
			
			if(st.opt.fig == 'basic' || st.opt.fig == 'basic3d' || st.opt.fig == 'diagram'){
				var dir = st.opt.jdots[startIndex].dir;
	
				//console.log('dir******************', dir);
				if(dir == 'N')
					startIndex = 0; 
				else if(dir == 'NE')
					startIndex = 1; 
				else if(dir == 'E')
					startIndex = 2; 
				else if(dir == 'SE')
					startIndex = 3; 
				else if(dir == 'S')
					startIndex = 4; 
				else if(dir == 'SW')
					startIndex = 5; 
				else if(dir == 'W')
					startIndex = 6; 
				else if(dir == 'NW')
					startIndex = 7; 
				else
					startIndex = 0;
	
				//console.log('st.opt.fig', st.opt.fig, 'index', startIndex, 'dir', dir)
				//debugger;
					//alert('error no direction' + dir); 
				//startDir = this.getDir(startIndex, startRotate);
			} else {
				//startDir = this.getDir(startIndex, startRotate);
			}
			if(end.opt.fig == 'basic' || end.opt.fig == 'basic3d' || end.opt.fig == 'diagram'){
				//console.log('end.opt', end.opt,endIndex);
				var endDir = end.opt.jdots[endIndex].dir;
				if(endDir == 'N')
					endIndex = 0; 
				else if(endDir == 'NE')
					endIndex = 1; 
				else if(endDir == 'E')
					endIndex = 2; 
				else if(endDir == 'SE')
					endIndex = 3; 
				else if(endDir == 'S')
					endIndex = 4; 
				else if(endDir == 'SW')
					endIndex = 5; 
				else if(endDir == 'W')
					endIndex = 6; 
				else if(endDir == 'NW')
					endIndex = 7; 
				else
					endIndex = 0;
	
					//alert('error no direction' + dir); 
	
				//startDir = this.getDir(startIndex, startRotate);
				//endDir = this.getDir(endIndex, endRotate);
				
			} else {
				// endDir = this.getDir(endIndex, endRotate);
			}        
			
			startDir = this.getDir(startIndex, startRotate);
			endDir = this.getDir(endIndex, endRotate);
			//console.log('start..', startDir,  startIndex, startRotate);    
			//console.log('startDir', startDir, 'endDir', endDir);
	
			if(startDir == 0){ //북쪽
				if(endDir == 0) { // 북쪽 -> 북쪽 2D
					x2 = x1;
					x5 = x6;
					y2 = startTargetTop - gab;
					y5 = endTargetTop - gab;
					y3 = y2;
					y4 = y5;
					if(startTargetTop <= endTargetTop){                                   
						if(startTargetCenter <= endTargetCenter){
							x3 = startTargetRight + gab;
							x4 = startTargetRight + gab;
						} else if(startTargetCenter > endTargetCenter){
							x3 = startTargetLeft - gab;
							x4 = startTargetLeft - gab;
						}
						if(startTargetRight + gab <= endTargetCenter){
							if(x3 < x6){
								x3 = x6;
							}
							if(x4 < x6){
								x4 = x6;
							}
						} else if(startTargetLeft - gab > endTargetCenter){
							if(x3 > x6){ //  두번째가 왼른쪽으로 많이 벌어질 경우
								x3 = x6;
							}
							if(x4 > x6){
								x4 = x6;
							}
						}
					} else if(startTargetTop > endTargetTop){
						if(endTargetCenter <= startTargetCenter){
							x3 = endTargetRight + gab;
							x4 = endTargetRight + gab;
						} else if(endTargetCenter > startTargetCenter){
							x3 = endTargetLeft - gab;
							x4 = endTargetLeft - gab;
						}
						if(endTargetRight + gab <= startTargetCenter ){
							if(x3 < x1){
								x3 = x1;
							}
							if(x4 < x1){
								x4 = x1;
							}
						} else if(endTargetLeft - gab > startTargetCenter){
							if(x3 > x1){
								x3 = x1;
							}
							if(x4 > x1){
								x4 = x1;
							}
						} 
					}
				} else if(endDir == 1) { // 북쪽 -> 동쪽 2D
					x2 = x1;
					x5 = endTargetRight + gab;
					y2 = startTargetTop - gab;
					y5 = y6;
					// 아래로 내릴때
					if(startTargetTop <= endTargetTop){
						y3 = y2;
						if( startTargetRight <= endTargetRight ){
							x3 = x5;
							x4 = x5;
							y4 = y5;
						} else if(startTargetLeft >= endTargetRight){
							x3 = (startTargetLeft + endTargetRight)/2;
							x4 = (startTargetLeft + endTargetRight)/2;
							y4 = y5;
						} else { // 중간에 겹칠경우 
							x3 = startTargetRight + gab;
							x4 = startTargetRight + gab;
							y4 = y5;
						}
					} else if(startTargetTop > endTargetBottom){
						if(endTargetRight + gab > startTargetCenter){
							x3 = x2;
							y3 = (startTargetTop + endTargetBottom)/2;
							x4 = x5;
							y4 = (startTargetTop + endTargetBottom)/2;
						} else {
							x3 = x2;
							y3 = (startTargetTop + endTargetBottom)/2;
							x4 = x2;
							y4 = y5;
						}
					} else {  // 중간에 걸쳐 있을 경우
						if(endTargetMiddle < startTargetTop -gab && startTargetCenter > endTargetRight){
							x3 = x2;
							y3 = y5;
							x4 = x2; 
							y4 = y5;
						} else {
							if(startTargetLeft > endTargetLeft){
								x3 = x2;
								y3 = startTargetTop - gab;
								x4 = x5; 
								y4 = startTargetTop - gab;
							} else {
								x3 = x2;
								y3 = endTargetTop - gab;
								x4 = x5; 
								y4 = endTargetTop - gab;
							}
						}
					}
				} else if(endDir == 2) { // 북쪽 -> 남쪽 2D
					x2 = x1;
					x5 = x6;
					y2 = startTargetTop - gab;
					y5 = endTargetBottom + gab;
					y3 = y2;
					y4 = y5;
					if(startTargetTop <= endTargetBottom){
						if(startTargetRight < endTargetLeft){
							x3 = (endTargetLeft + startTargetRight) /2;
							x4 = (endTargetLeft + startTargetRight) /2;
						} else if(startTargetLeft > endTargetRight){
							x3 = (endTargetRight + startTargetLeft) /2;
							x4 = (endTargetRight + startTargetLeft) /2;
						} else { // 겹칠경우 
							if(startTargetCenter <= endTargetCenter){
								if(startTargetRight > endTargetRight){
									x3 = startTargetRight + gab;
									x4 = startTargetRight + gab;
								} else {
									x3 = endTargetRight + gab;
									x4 = endTargetRight + gab;
								}
							}else{
								if(startTargetLeft < endTargetLeft){
									x3 = startTargetLeft - gab;
									x4 = startTargetLeft - gab;
								} else {
									x3 = endTargetLeft - gab;
									x4 = endTargetLeft - gab;
								}
							}
						}
					} else if(startTargetTop > endTargetBottom){
						x3 = x2;
						x4 = x5;
						y3 = (startTargetTop + endTargetBottom)/2;
						y4 = (startTargetTop + endTargetBottom)/2;
					}
				} else if(endDir == 3) { // 북쪽 -> 서쪽 2D
					x2 = x1;
					x5 = endTargetLeft - gab;
					y2 = startTargetTop - gab;
					y5 = y6;
					if(startTargetTop -gab <= endTargetMiddle){ // 아래로 내릴때 
						if(startTargetRight <= endTargetLeft-gab){
							x3 = (startTargetRight + endTargetLeft)/2;
							x4 = (startTargetRight + endTargetLeft)/2;
							y3 = y2;
							y4 = y5;
						} else if(startTargetLeft > endTargetLeft){
							if(startTargetTop > endTargetTop){
								x3 = x2;
								x4 = endTargetLeft - gab;
								y3 = endTargetTop - gab;
								y4 = endTargetTop - gab;
							} else {
								x3 = x2;
								x4 = endTargetLeft - gab;
								y3 = startTargetTop - gab;
								y4 = startTargetTop - gab;
							}
						} else if(startTargetRight > endTargetLeft-gab){
							x3 = startTargetLeft - gab;
							x4 = startTargetLeft - gab;
							y3 = y2;
							y4 = y5;
						}
					} else if(startTargetTop -gab < endTargetBottom){
						if(startTargetCenter < endTargetLeft - gab){
							x3 = x2;
							y3 = startTargetTop-gab;
							x4 = x2;
							y4 = y5;
						} else {
							x3 = x2;
							y3 = endTargetTop -gab; 
							x4 = x5;
							y4 = endTargetTop -gab;
						}
					} else if(startTargetTop -gab > endTargetMiddle){
						if(startTargetCenter < endTargetLeft - gab){
							x3 = x2;
							y3 = y5; 
							x4 = x5;
							y4 = y5;
						} else {
							x3 = x2;
							y3 = (startTargetTop + endTargetBottom)/2; 
							x4 = x5;
							y4 = (startTargetTop + endTargetBottom)/2;
						}
					}
				}
			}
			if(startDir == 1){ //동쪽
				if(endDir == 0) { // 동쪽 -> 북쪽 2D
					x2 = startTargetRight + gab;
					x5 = x6;
					y2 = y1;
					y5 = endTargetTop - gab;
					if(startTargetRight + gab < endTargetLeft){
						if(startTargetMiddle <= endTargetTop -gab){
							x3 = x5;
							y3 = y2;
							x4 = x5;
							y4 = y5
						} else if(startTargetMiddle > endTargetTop-gab){
							x3 = (startTargetRight + endTargetLeft)/2;
							y3 = y2;
							x4 = (startTargetRight + endTargetLeft)/2;
							y4= y5;
						}
					} else if(startTargetRight + gab < endTargetCenter){
						if(startTargetMiddle <= endTargetTop -gab){
							x3 = x5;
							y3 = y2;
							x4 = x5;
							y4 = y5
						} else if(startTargetMiddle > endTargetTop-gab){
							x3 = endTargetRight + gab;
							y3 = y2;
							x4 =  endTargetRight + gab;
							y4= y5;
						}
					} else {
						if(startTargetBottom < endTargetTop -gab){
							x3 = x2;
							y3 = (startTargetBottom + endTargetTop)/2;
							x4 = x5;
							y4 = (startTargetBottom + endTargetTop)/2;
						} else {
							if (startTargetTop  < endTargetTop){
								x3 = x2;
								y3 = startTargetTop - gab;
								x4 = x5;
								y4 = startTargetTop - gab;
							} else {
								if(startTargetRight > endTargetRight){
									x3 = startTargetRight + gab;
									y3 = y2;
									x4 = startTargetRight + gab;
									y4 = endTargetTop - gab;
								}
								else {
									x3 = endTargetRight + gab;
									y3 = y2;
									x4 = endTargetRight + gab;
									y4 = endTargetTop - gab;
								}
							} 
						}
					}
				} else if(endDir == 1) { // 동쪽 -> 동쪽 2D
					x2 = startTargetRight + gab;
					x5 = endTargetRight + gab;
					y2 = y1;
					y5 = y6;
					y3 = y2;
					y4 = y5;
					if(startTargetRight < endTargetRight){ // 겹칠경우 
						if(startTargetMiddle > endTargetTop && 
							startTargetMiddle < endTargetBottom){
							if(startTargetMiddle < endTargetMiddle){
								x3 = x2;//(startTargeRight + endTargetLeft)/2
								y3 = endTargetTop - gab;
								x4 = x5;
								y4 = endTargetTop - gab;
							} else {
								x3 = x2;//(startTargeRight + endTargetLeft)/2
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
							}
						} else {
							x3 = endTargetRight + gab;
							x4 = endTargetRight + gab;
						}
					} else { // 겹칠경우 
						if(endTargetMiddle > startTargetTop && 
							endTargetMiddle < startTargetBottom){
							if(startTargetMiddle < endTargetMiddle){
								x3 = x2;//(startTargeRight + endTargetLeft)/2
								y3 = startTargetBottom + gab;
								x4 = x5;
								y4 = startTargetBottom + gab;
							} else {
								x3 = x2;//(startTargeRight + endTargetLeft)/2
								y3 = startTargetTop - gab;
								x4 = x5;
								y4 = startTargetTop - gab;
							}
						} else {
							x3 = startTargetRight + gab;
							x4 = startTargetRight + gab;
						}
					}
				} else if(endDir == 2) { // 동쪽 -> 남쪽 2D
					x2 = startTargetRight + gab;
					x5 = x6; 
					y2 = y1;
					y5 = endTargetBottom + gab;
					if(startTargetRight + gab < endTargetLeft){
						if(startTargetMiddle < endTargetBottom){
							x3 = (startTargetRight + endTargetLeft)/2;
							y3 = y2;
							x4 = (startTargetRight + endTargetLeft)/2;
							y4 = y5;
						} else {
							x3 = x2;
							y3 = y2;
							x4 = x5;
							y4 = y2;
						}
					} else if(startTargetRight + gab < endTargetCenter){
						if(startTargetMiddle < endTargetBottom){
							if(startTargetRight >= endTargetRight){
								x3 = startTargetRight + gab;
								y3 = y2;
								x4 = startTargetRight + gab;
								y4 = y2;
							} else {
								x3 = endTargetRight + gab;
								y3 = startTargetMiddle;
								x4 = endTargetRight + gab;
								y4 = endTargetBottom + gab;
							}
						} else {
							x3 = x2;
							y3 = y2;
							x4 = x5;
							y4 = y2;
						}
					} else { 
						if(startTargetMiddle <endTargetTop){
							if(startTargetRight > endTargetRight){
								x3 = startTargetRight + gab;
								y3 = y2;
								x4 = startTargetRight + gab;
								y4 = endTargetBottom + gab;   
							} else {
								x3 = endTargetRight + gab;
								y3 = y2;
								x4 = endTargetRight + gab;
								y4 = endTargetBottom + gab;   
							}                     
						} else {
							if (startTargetTop <= endTargetBottom){
								if (startTargetBottom  > endTargetBottom){
									x3 = x2;
									y3 = startTargetBottom + gab;
									x4 = x5;
									y4 = startTargetBottom + gab;
								} else {
									x3 = x2;
									y3 = endTargetBottom + gab;
									x4 = x5;
									y4 = endTargetBottom + gab;
								}   
							} else if(startTargetBottom <= endTargetBottom){
								x3 = x2;
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
							}else if(startTargetTop > endTargetBottom){
								x3 = x2;
								y3 = (startTargetTop + endTargetBottom)/2;
								x4 = x5;
								y4 = (startTargetTop + endTargetBottom)/2;
							}
						}
					}
				} else if(endDir == 3) { // 동쪽 -> 서쪽 2D
					x2 = startTargetRight + gab;
					x5 = endTargetLeft - gab;
					y2 = y1; 
					y5 = y6; 
					if(startTargetRight < endTargetLeft){
						x3 = (startTargetRight + endTargetLeft)/2;
						y3 = y2;
						x4 = (startTargetRight + endTargetLeft)/2;
						y4 = y5;
					} else {
						if(startTargetTop > endTargetBottom){
							x3 = x2;
							y3 = (startTargetTop + endTargetBottom)/2;
							x4 = x5;
							y4 = (startTargetTop + endTargetBottom)/2;
						} else if(startTargetBottom < endTargetTop){
							x3 = x2;
							y3 = (startTargetBottom + endTargetTop)/2;
							x4 = x5;
							y4 = (startTargetBottom + endTargetTop)/2;
						} else if(startTargetMiddle >= endTargetMiddle && startTargetTop <= endTargetBottom){
							if( startTargetTop < endTargetTop ){
								x3 = x2;
								y3 = startTargetTop - gab;
								x4 = x5;
								y4 = startTargetTop - gab;
							} else {
								x3 = x2;
								y3 = endTargetTop - gab;
								x4 = x5;
								y4 = endTargetTop - gab;
							}
						}
						else if(startTargetMiddle <= endTargetMiddle && startTargetBottom >= endTargetTop){
							if( startTargetBottom > endTargetBottom ){
								x3 = x2;
								y3 = startTargetBottom + gab;
								x4 = x5;
								y4 = startTargetBottom + gab;
							} else {
								x3 = x2;
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
							}
						}
					}
				}
			}                    
			if(startDir == 2){ //남쪽
				if(endDir == 0) { // 남쪽 -> 북쪽 2D
					x2 = x1; 
					x3 = endTargetLeft - gab;
					x4 = endTargetLeft - gab;
					x5 = x6; 
					y2 = startTargetBottom + gab;
					y3 = startTargetBottom + gab;
					y4 = endTargetTop - gab;
					y5 = endTargetTop - gab;
					if(startTargetBottom < endTargetTop){
						x3 = x2;
						x4 = x5;
						y2 = (startTargetBottom + endTargetTop)/2;
						y3 = (startTargetBottom + endTargetTop)/2;
						y4 = (startTargetBottom + endTargetTop)/2;
						y5 = (startTargetBottom + endTargetTop)/2;
					}
					if(startTargetBottom > endTargetTop){
						if(startTargetLeft >= endTargetRight){
							x3 = (startTargetLeft + endTargetRight)/2;
							x4 = (startTargetLeft + endTargetRight)/2;
						} else if(startTargetRight < endTargetLeft){
							x3 = (startTargetRight + endTargetLeft)/2;
							x4 = (startTargetRight + endTargetLeft)/2;
						} else if(startTargetCenter >= endTargetCenter){
							if(startTargetLeft > endTargetLeft){
								x3 = endTargetLeft - gab;
								x4 = endTargetLeft - gab;
							} else {
								x3 = startTargetLeft - gab;
								x4 = startTargetLeft - gab;
							}
						} else if(startTargetCenter < endTargetCenter){
							if(startTargetRight < endTargetRight){
								x3 = endTargetRight + gab;
								x4 = endTargetRight + gab;
							} else {
								x3 = startTargetRight + gab;
								x4 = startTargetRight + gab;
							}
						}
						y3 = startTargetBottom + gab;
						y4 = endTargetTop-gab;
					}
				} else if(endDir == 1) { // 남쪽 -> 동쪽 2D
					x2 = x1;
					x5 = endTargetRight + gab;
					y2 = startTargetBottom + gab;
					y5 = y6;
	
					if(startTargetBottom < endTargetMiddle){
						if(startTargetCenter < endTargetRight){
							if(startTargetBottom > endTargetTop){
								x3 = x2;
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
							} else {
								x3 = x2;
								y3 = (startTargetBottom + endTargetTop)/2; 
								x4 = x5;
								y4 = (startTargetBottom + endTargetTop)/2; 
							}
						}
						if(startTargetCenter >= endTargetRight){
							x3 = x2;
							x4 = x2;
							y3 = y2;
							y4 = y5;
						}
					}
					// 위로 올릴때
					if(startTargetBottom > endTargetMiddle){
						if(startTargetLeft > endTargetRight){
							x3 = (startTargetLeft + endTargetRight)/2;
							y3 = y2;
							x4 = (startTargetLeft + endTargetRight)/2;
							y4 = y5;
						} else if(startTargetLeft <= endTargetRight){
							if(startTargetRight >= endTargetRight){
								x3 = startTargetRight + gab;
								y3 = y2;
								x4 = startTargetRight + gab;
								y4 = y5;
							} else if(startTargetRight < endTargetRight){
								x3 = endTargetRight + gab;
								y3 = y2;
								x4 = endTargetRight + gab;
								y4 = y5;
							}
						}
					}
				} else if(endDir == 2) { // 남쪽 -> 남쪽 2D
					x2 = x1;
					x5 = x6;
					y2 = startTargetBottom + gab;
					y5 = endTargetBottom + gab;
					if(startTargetBottom < endTargetTop){
						if(startTargetCenter <= endTargetCenter){
							if(startTargetCenter < endTargetLeft){
								x3 = x2;
								y3 = y2;
								x4 = x2;
								y4 = y5;
							} else {
								x3 = endTargetLeft - gab;
								y3= y2;
								x4 = endTargetLeft - gab;
								y4 = y5;
							}
						} else {
							if(startTargetCenter > endTargetRight){
								x3 = x2;
								y3 = y2;
								x4 = x2;
								y4 = y5;
							} else {
								x3 = endTargetRight + gab;
								y3= y2;
								x4 = endTargetRight + gab;
								y4 = y5;
							}
						}
					} else if(startTargetBottom < endTargetBottom){
						if(startTargetCenter <= endTargetCenter){
							if(startTargetCenter < endTargetLeft){
								x3 = x2;
								y3 = y2;
								x4 = x2;
								y4 = y5;
							} else {
								x3 = endTargetLeft - gab;
								y3= y2;
								x4 = endTargetLeft - gab;
								y4 = y5;
							}
						} else {
							if(startTargetCenter > endTargetRight){
								x3 = x2;
								y3 = y2;
								x4 = x2;
								y4 = y5;
							} else {
								x3 = endTargetRight + gab;
								y3= y2;
								x4 = endTargetRight + gab;
								y4 = y5;
							}
						}
					} else {
						if(startTargetCenter <= endTargetCenter){
							if(endTargetCenter > startTargetRight){
								x3 = x5;
								y3 = y2;
								x4 = x5;
								y4 = y5;
							} else {
								x3 = startTargetRight + gab;
								y3= y2;
								x4 = startTargetRight + gab;
								y4 = y5;
							}
						} else {
							if(endTargetCenter < startTargetLeft){
								x3 = x5;
								y3 = y2;
								x4 = x5;
								y4 = y5;
							} else {
								x3 = startTargetLeft - gab;
								y3= y2;
								x4 = startTargetLeft - gab;
								y4 = y5;
							}
						}
					}
				} else if(endDir == 3) { // 남쪽 -> 서쪽
					x2 = x1;
					x5 = endTargetLeft - gab;
					y2 = startTargetBottom + gab;
					y5 = y6; 
					if(startTargetBottom + gab <= endTargetMiddle){
						if(startTargetCenter <= endTargetLeft){
							x3 = x2;
							x4 = x2;
							y3 = y5;
							y4 = y5; 
						} else if(startTargetCenter > endTargetLeft){
							if(startTargetBottom <= endTargetTop){
								x3 = x2; 
								y3 = (startTargetBottom + endTargetTop)/2;
								x4 = x5; 
								y4 = (startTargetBottom + endTargetTop)/2; 
							} else if(startTargetBottom > endTargetTop){
								x3 = x2;
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
							}
						} else {
						}
					} else { // 위로 올릴때
						if(startTargetRight < endTargetLeft){
							x3 = (startTargetRight + endTargetLeft)/2;
							y3 = y2;
							x4 = (startTargetRight + endTargetLeft)/2;
							y4 = y5;
						} else {
							if(startTargetLeft < endTargetLeft){
								x3 = startTargetLeft - gab;
								y3 = y2;
								x4 = startTargetLeft - gab;
								y4 = y5;
							} else {
								if(endTargetBottom > startTargetBottom){
									x3 = x2;
									y3 = endTargetBottom + gab;
									x4 = endTargetLeft - gab;
									y4 = endTargetBottom + gab;
								} else {
									x3 = endTargetLeft - gab;
									y3 = y2;
									x4 = endTargetLeft - gab;
									y4 = y5;
								}
							}
						}
					}
				}
			}
			if(startDir == 3){ //서쪽
				if(endDir == 0) { // 서쪽 -> 북쪽 2D
					x2 = startTargetLeft - gab;
					x5 = x6;
					y2 = y1; 
					y5 = endTargetTop - gab;
					if(startTargetLeft > endTargetRight){
						if(startTargetMiddle > endTargetTop){
							x3 = (startTargetLeft + endTargetRight)/2;
							y3 = y2;
							x4 = (startTargetLeft + endTargetRight)/2;
							y4 = y5;
						} else {
							x3 = x5;
							y3 = y2;
							x4 = x5;
							y4 = y5;
						}
					} else if(startTargetLeft > endTargetCenter){
						if(startTargetMiddle > endTargetTop){
							if(startTargetLeft < endTargetLeft){
								x3 = startTargetLeft - gab;
								y3 = y2;
								x4 = startTargetLeft - gab;
								y4 = y5;
							} else {
								x3 = endTargetLeft - gab;
								y3 = y2;
								x4 = endTargetLeft - gab;
								y4 = y5;
							}
						} else {
							x3 = x5;
							y3 = y2;
							x4 = x5;
							y4 = y5;
						}
					} else {
						//fg.opt.lineMoveDir[0] = 'H';
						//fg.opt.lineMoveDir[1] = 'V';
						//fg.opt.lineMoveDir[2] = 'H';
						if(startTargetBottom < endTargetTop){
							x3 = x2;
							y3 = (startTargetBottom + endTargetTop)/2;
							x4 = x5;
							y4 = (startTargetBottom + endTargetTop)/2;
						} else {
							if (startTargetTop  < endTargetTop){
								x3 = x2;
								y3 = startTargetTop - gab;
								x4 = x5;
								y4 = startTargetTop - gab;
							} else {
								if(endTargetLeft < startTargetLeft){
									//fg.opt.lineMoveDir[0] = 'V';
									//fg.opt.lineMoveDir[1] = 'H';
									//fg.opt.lineMoveDir[2] = 'V';
									x3 = endTargetLeft - gab;
									y3 = y2;
									x4 = endTargetLeft - gab;
									y4 = y5;
								} else {
									x3 = x2;
									y3 = endTargetTop - gab;
									x4 = x5;
									y4 = endTargetTop - gab;
								}
							}   
						}
					}     
				} else if(endDir == 1) { // 서쪽 -> 동쪽 2D
					x2 = startTargetLeft - gab;
					x5 = endTargetRight + gab;
					y2 = y1; 
					y5 = y6; 
					if(startTargetLeft > endTargetRight){
						x3 = (startTargetLeft + endTargetRight)/2;
						y3 = y2;
						x4 = (startTargetLeft + endTargetRight)/2;
						y4 = y5;
					} else {
						if(startTargetMiddle >= endTargetMiddle){
							if(startTargetTop > endTargetBottom){
								x3 = x2;
								y3 = (startTargetTop + endTargetBottom)/2;
								x4 = x5;
								y4 = (startTargetTop + endTargetBottom)/2;
							} else {
								if(startTargetTop < endTargetTop){
									x3 = x2;
									y3 = startTargetTop - gab;
									x4 = x5;
									y4 = startTargetTop - gab;
								} else {
									x3 = x2;
									y3 = endTargetTop - gab;
									x4 = x5;
									y4 = endTargetTop - gab;
								}
							}
						} else {
							if(startTargetBottom < endTargetTop){
								x3 = x2;
								y3 = (startTargetBottom + endTargetTop)/2;
								x4 = x5;
								y4 = (startTargetBottom + endTargetTop)/2;
							} else {
								if(startTargetBottom > endTargetBottom){
									x3 = x2;
									y3 = startTargetBottom + gab;
									x4 = x5;
									y4 = startTargetBottom + gab;
								} else {
									x3 = x2;
									y3 = endTargetBottom + gab;
									x4 = x5;
									y4 = endTargetBottom + gab;
								}
							}
						}
					}
				} else if(endDir == 2) { // 서쪽 -> 남쪽 2D
					x2 = startTargetLeft - gab;
					x5 = x6;
					y2 = y1;
					y5 = endTargetBottom + gab;
					if(startTargetLeft > endTargetCenter){
						if(startTargetMiddle > endTargetBottom){
							y3 = y2;
							y4 = y2;
							x3 = x5;
							x4 = x5;
						} else {
							if(startTargetLeft <= endTargetRight){
								x3 = endTargetLeft -gab;
								y3 = y2;
								x4 = endTargetLeft -gab;
								y4 = y5;
							} else {
								x3 = (startTargetLeft + endTargetRight)/2;
								y3 = y2;
								x4 = (startTargetLeft + endTargetRight)/2;
								y4 = y5;
							}
						}
					} else {   
						if(startTargetTop > endTargetBottom){
							x3 = x2;
							y3 = (startTargetTop + endTargetBottom)/2;
							x4 = x5;
							y4 = (startTargetTop + endTargetBottom)/2;  
						}else {
							if(startTargetBottom > endTargetBottom){
								x3 = x2;
								y3 = startTargetBottom + gab;
								x4 = x5;
								y4 = startTargetBottom + gab;
							}else {
								if(endTargetLeft < startTargetLeft){
									x3 = endTargetLeft - gab;
									y3 = y2;
									x4 = endTargetLeft - gab;
									y4 = endTargetBottom + gab;
								}else {
									x3 = x2;
									y3 = endTargetBottom + gab;
									x4 = x5;
									y4 = endTargetBottom + gab;
								}
							}
						}
					}
				} else if(endDir == 3) { // 서쪽 -> 서쪽 2D
					x2 = startTargetLeft - gab;
					x5 = endTargetLeft - gab;
					y2 = y1; 
					y5 = y6;
					if(startTargetLeft > endTargetRight){
						if(startTargetMiddle > endTargetMiddle){
							if(startTargetMiddle > endTargetBottom){
								// 가운데 위 갭.
								x3 = x5;
								y3 = y2;
								x4 = x5;
								y4 = y2;
							}else {
								// 가운데 위 접함
								x3 = x2;
								y3 = endTargetBottom + gab;
								x4 = x5;
								y4 = endTargetBottom + gab;
	
							}
						} else {
							if(startTargetMiddle < endTargetTop){
								// 가운데 아래 갭
								x3 = x2;
								y3 = y2;
								x4 = x5;
								y4 = y2;
							} else {
								// 가운데 위 접함
								x3 = x2;
								y3 = endTargetTop - gab;
								x4 = x5;
								y4 = endTargetTop - gab;
							}
						}
					} else {
						//fg.opt.lineMoveDir[0] = 'H';
						//fg.opt.lineMoveDir[1] = 'V';
						//fg.opt.lineMoveDir[2] = 'H';
						if(startTargetMiddle > endTargetMiddle){
							if(endTargetMiddle < startTargetTop){
								// 가운데 위 갭.
								if(endTargetLeft < startTargetLeft) {
									x3 = x5;
									y3 = y2;
									x4 = x5;
									y4 = y5;     
								}else {
									x3 = x2;
									y3 = y2;
									x4 = x2;
									y4 = y5;
								}
							} else { // 가운데 위 접함
								x3 = x2;
								y3 = startTargetTop - gab;
								x4 = x5;
								y4 = startTargetTop - gab;
							}
						} else {
							if(endTargetMiddle > startTargetBottom){
								// 가운데 아래 갭
								if(endTargetLeft < startTargetLeft) {
									x3 = x5;
									y3 = y2;
									x4 = x5;
									y4 = y5;
								}else {
									x3 = x2;
									y3 = y2;
									x4 = x2;
									y4 = y5;
								}
							} else {
								// 가운데 위 접함
								x3 = x2;
								y3 = startTargetBottom + gab;
								x4 = x5;
								y4 = startTargetBottom + gab;
							}
						}
					}
				}
			}   
			
			var tempPos = this.arrangeFlowline(startDir, endDir, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6);
			x2 = tempPos.x2;
			x3 = tempPos.x3;
			x4 = tempPos.x4;
			x5 = tempPos.x5;
			y2 = tempPos.y2;
			y3 = tempPos.y3;
			y4 = tempPos.y4;
			y5 = tempPos.y5;        
		} else {
			x2 = (x1 + x6)/2;
			x3 = (x1 + x6)/2;
			x4 = (x1 + x6)/2;
			x5 = (x1 + x6)/2;
			y2 = y1;
			y3 = y1;
			y4 = y6;
			y5 = y6;
		}
		var points =  x1 +',' + y1 + ' ' + 
			x2 +',' + y2 + ' ' + 
			x3 +',' + y3 + ' ' + 
			x4 +',' + y4 + ' ' + 
			x5 +',' + y5 + ' ' + 
			x6 +',' + y6;
		var curveVal = fg.opt.flowlineCurve;
		var d = '';
		//fg.opt.bazierCurve = true;
		if(fg.opt.bazierCurve != undefined && fg.opt.bazierCurve == true){
	
			var bx = [];
			var by = [];
			var bmX = [];
			var bmY = [];
			bx.push(x1);
			by.push(y1);
			bmX.push((Number(x1) + Number(x2))/2);
			bmY.push((Number(y1) + Number(y2))/2);
			if(x1 == x2 && y1 == y2){
			} else {
				bx.push(x2);
				by.push(y2);
				bmX.push((Number(x2) + Number(x3))/2);
				bmY.push((Number(y2) + Number(y3))/2);
			}
			if(x2 == x3 && y2 == y3){
			} else {
				bx.push(x3);
				by.push(y3);
				bmX.push((Number(x3) + Number(x4))/2);
				bmY.push((Number(y3) + Number(y4))/2);
			}
			if(x3 == x4 && y3 == y4){
			} else {
				bx.push(x4);
				by.push(y4);
				bmX.push((Number(x4) + Number(x5))/2);
				bmY.push((Number(y4) + Number(y5))/2);
			}
			if(x4 == x5 && y4 == y5){
			} else {
				bx.push(x5);
				by.push(y5);
				bmX.push((Number(x5) + Number(x6))/2);
				bmY.push((Number(y5) + Number(y6))/2);
			}
			if(x5 == x6 && y5 == y6){
			} else {
				bx.push(x6);
				by.push(y6);
				bmX.push(x6);
				bmY.push(y6);
			}
			var d= '';
			if(bx.length ==2){
				bmX[0] = (bx[0] + bx[1])/2;
				bmX[1] = (bx[1] + bx[2])/2;
				bmY[0] = (by[0] + by[1])/2;
				bmY[1] = (by[1] + by[2])/2;
				d = 'M' + bx[0] + ' ' + by[0] + ' ' + //+ 'L' + bmX[0] + ' ' + bmY[0] + ' ' + 
					'L' + bx[1] + ' ' + by[1] + ' ' ;
					//'Q' + bx[2] + ' ' + by[2] + ' ' + //bmX[2] + ' ' + bmY[2] + ' ' + 
					//'L' + 
					//bx[3] + ' ' + by[3];
			}
			if(bx.length ==3){
				bmX[0] = (bx[0] + bx[1])/2;
				bmX[1] = (bx[1] + bx[2])/2;
		 
	
				bmY[0] = (by[0] + by[1])/2;
				bmY[1] = (by[1] + by[2])/2;
	
				
				d = 'M' + bx[0] + ' ' + by[0] + ' ' + //+ 'L' + bmX[0] + ' ' + bmY[0] + ' ' + 
					'Q' + bx[1] + ' ' + by[1] + ' ' +  bx[2] + ' ' + by[2];
					//'Q' + bx[2] + ' ' + by[2] + ' ' + //bmX[2] + ' ' + bmY[2] + ' ' + 
					//'L' + 
					//bx[3] + ' ' + by[3];
			}
			if(bx.length ==4){
				bmX[0] = (bx[0] + bx[1])/2;
				bmX[1] = (bx[1] + bx[2])/2;
				bmX[2] = (bx[2] + bx[3])/2;
	
				bmY[0] = (by[0] + by[1])/2;
				bmY[1] = (by[1] + by[2])/2;
				bmY[2] = (by[2] + by[3])/2;
				
				d = 'M' + bx[0] + ' ' + by[0] + ' ' + //+ 'L' + bmX[0] + ' ' + bmY[0] + ' ' + 
					'Q' + bx[1] + ' ' + by[1] + ' ' + bmX[1] + ' ' + bmY[1] + ' ' +
					'Q' + bx[2] + ' ' + by[2] + ' ' + //bmX[2] + ' ' + bmY[2] + ' ' + 
					//'L' + 
					bx[3] + ' ' + by[3];
			}
			if(bx.length ==5){
				bmX[0] = (bx[0] + bx[1])/2;
				bmX[1] = (bx[1] + bx[2])/2;
				bmX[2] = (bx[2] + bx[3])/2;
				bmX[3] = (bx[3] + bx[4])/2;
	
				bmY[0] = (by[0] + by[1])/2;
				bmY[1] = (by[1] + by[2])/2;
				bmY[2] = (by[2] + by[3])/2;
				bmY[3] = (by[3] + by[4])/2;
	
				d = 'M' + x1 + ' ' + y1 + ' ' + //'L' + bmX[0] + ' ' + bmY[0] + ' ' + 
					'Q' + bx[1] + ' ' + by[1] + ' ' + bmX[1] + ' ' + bmY[1] + ' ' +
					'Q' + bx[2] + ' ' + by[2] + ' ' + bmX[2] + ' ' + bmY[2] + ' ' + 
					'Q' + bx[3] + ' ' + by[3] + ' ' + // + bmX[3] + ' ' + bmY[3] + ' ' + 
					//'L' + 
					bx[4] + ' ' + by[4];
			}
			if(bx.length ==6){
				bmX[0] = (bx[0] + bx[1])/2;
				bmX[1] = (bx[1] + bx[2])/2;
				bmX[2] = (bx[2] + bx[3])/2;
				bmX[3] = (bx[3] + bx[4])/2;
				bmX[4] = (bx[4] + bx[5])/2;
	
				bmY[0] = (by[0] + by[1])/2;
				bmY[1] = (by[1] + by[2])/2;
				bmY[2] = (by[2] + by[3])/2;
				bmY[3] = (by[3] + by[4])/2;
				bmY[4] = (by[4] + by[5])/2;
	
				d = 'M' + x1 + ' ' + y1 + ' ' +  //'L' + bmX[0] + ' ' + bmY[0] + ' ' + 
					'Q' + bx[1] + ' ' + by[1] + ' ' + bmX[1] + ' ' + bmY[1] + ' ' + 
					'Q' + bx[2] + ' ' + by[2] + ' ' + bmX[2] + ' ' + bmY[2] + ' ' + 
					'Q' + bx[3] + ' ' + by[3] + ' ' + bmX[3] + ' ' + bmY[3] + ' ' + 
					'Q' + bx[4] + ' ' + by[4] + ' ' + // + bmX[4] + ' ' + bmY[4] + ' ' + 
					//'L' + /
					bx[5] + ' ' + by[5];
			}
			/*
			var bx1 = x1;
			var by1 = y1;
			if(x1 == x2 && y1 == y2){
			} else {
				var bxM1 = (Number(x1) + Number(x2))/2;
				var byM1 = (Number(y1) + Number(y2))/2;
				var d = d + 'Q' + bx1 + ' ' + bx2 + ' ' + bxM1 + ' ' + byM1 + ' ';
			}
			var bx2 = x2;
			var by2 = y2;
			var d = 'M' + bx1 + ' ' + by1 + ' ';
			var d = d + 'L' + bx2 + ' ' + by2 + ' ';
			if(x2 == x3 && y2 == y3){
			} else {
				var bxM2 = (Number(x2) + Number(x3))/2;
				var byM2 = (Number(y2) + Number(y3))/2;
				var d = d + 'Q' + bx2 + ' ' + by2 + ' ' + bxM2 + ' ' + byM2 + ' ';
			}
			var bx3 = x3;
			var by3 = y3;
			if(x3 == x4 && y3 == y4){
	
			} else {
				var bxM3 = (Number(x3) + Number(x4))/2;
				var byM3 = (Number(y3) + Number(y4))/2;
				var d = d + 'Q' + bx3 + ' ' + by3 + ' ' + bxM3 + ' ' + byM3 + ' ';
			}
			
			var bx4 = x4;
			var by4 = y4;
			if(x4 == x5 && y4 == y5){
	
			} else {
				var bxM4 = (Number(x4) + Number(x5))/2;
				var byM4 = (Number(y4) + Number(y5))/2;
				var d = d + 'Q' + bx4 + ' ' + by4 + ' ' + bxM4 + ' ' + byM4 + ' ';
			}
			
			var bx5 = x5;
			var by5 = y5;
			if(x5 == x6 && y5 == y6){
			} else {
				var bxM5 = (Number(x5) + Number(x6))/2;
				var byM5 = (Number(y5) + Number(y6))/2;
				var d = d + 'Q' + bx5 + ' ' + by5 + ' ' + bxM5 + ' ' + byM5 + ' ';
			}
			
			var bx6 = x6;
			var by6 = y6;
			d= d+ 'L' + bx6 + ' ' + by6;
			*/
			/*
			d = 'M' + bx1 + ' ' + by1 + ' ' + 
				'Q' + bx1 + ' ' + by1 + ' ' + bxM1 + ' ' + byM1 + ' ' +
				'Q' + bx2 + ' ' + by2 + ' ' + bxM2 + ' ' + byM2 + ' ' +
				'Q' + bx3 + ' ' + by3 + ' ' + bxM3 + ' ' + byM3 + ' ' + 
				'Q' + bx4 + ' ' + by4 + ' ' + bxM4 + ' ' + byM4 + ' ' + 
				'Q' + bx5 + ' ' + by5 + ' ' + bxM5 + ' ' + byM5 + ' ' + 
				'L' + bx6 + ' ' + by6;
			*/
		} else if(fg.opt.flowlineCurve == null || fg.opt.flowlineCurve == undefined){
			d = 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' L' + x3 + ' ' + y3 + ' L' + x4 + ' ' + y4 + ' L' + x5 + ' ' + y5 + ' L' + x6 + ' ' + y6;
		} else {
			if(startDir == 0 && endDir == 3){
				if(y6 < y1 && y6 > y2 && x6 > x1){
					y2 = y6;
					y3 = y6;
					y4 = y6;
					y5 = y6;
					curveVal = (y1-y6)/2;
				}
			}
			if(startDir == 0 && endDir == 2){
				if(y1 + curveVal*2 < y6 && y1 > y6){
					curveVal = (y1-y6)/2;
				}
				else if(y6 < y1){
					if(curveVal > Math.abs(x6-x1)/2){
						curveVal = Math.abs(x6-x1)/2;
					}
				
					if(curveVal > Math.abs(y6-y1)/2){
						curveVal = Math.abs(y6-y1)/2;
					}
				}
			} else if(startDir == 2 && endDir == 0){
				if(y1 - curveVal*2 > y6 && y1 < y6){
					curveVal = (y6-y0)/2;
				}
				else if(y1 < y6){
					if(curveVal > Math.abs(x6-x1)/2){
						curveVal = Math.abs(x6-x1)/2;
					}
					if(curveVal > Math.abs(y6-y1)/2){
						curveVal = Math.abs(y6-y1)/2;
					}
				}
			} else if(startDir == 1 && endDir == 3){
				if(x1 + curveVal*2 > x6 && x1 < x6){
					curveVal = (x6-x1)/2;
				}
				else if(x1 < x6){
					if(curveVal > Math.abs(y6-y1)/2){
						curveVal = Math.abs(y6-y1)/2;
					}
					if(curveVal > Math.abs(x6-y1)/2){
						curveVal = Math.abs(x6-y1)/2;
					}
				} 
			} else if(startDir == 3 && endDir == 1){
				if(x1 - curveVal*2 < x6 && x1 > x6){
					curveVal = (x1-x6)/2;
				}else if(x6 < x1){
					if(curveVal > Math.abs(y6-y1)/2){
						curveVal = Math.abs(y6-y1)/2;
					}
					if(curveVal > Math.abs(x6-y1)/2){
						curveVal = Math.abs(x6-y1)/2;
					}
				}
			} 
			d = 'M' + x1 + ' ' + y1;
			if(x1 == x2 && y1 == y2){
			} else {
				if(x2 > x1){
					d = d + 'L' + (x2-curveVal) + ' ' + (y2);
				} else if(x2 < x1){
					d = d + 'L' + (x2+curveVal) + ' ' + (y2);
				} else if(y2 > y1){
					d = d + 'L' + (x2) + ' ' + (y2 - curveVal);
				} else if(y2 < y1){
					d = d + 'L' + (x2) + ' ' + (y2 + curveVal);
				}
			}
			if(x3 > x2){
				d = d + 'C' + x2 + ' ' + y2 + ', ' + x2 + ' ' + y2 + ', ' + (x2 + curveVal) + ' '+  y2;
				d = d + 'L' + (x3-curveVal) + ' ' + (y3);
			} else if(x3 < x2){
				d = d + 'C' + x2 + ' ' + y2 + ', ' + x2 + ' ' + y2 + ', ' + (x2 - curveVal) + ' ' + y2;
				d = d + 'L' + (x3 + curveVal) + ' ' + (y3);
			} else if(y3 > y2){
				d = d + 'C' + x2 + ' ' + y2 + ', ' + x2 + ' ' + y2 + ', ' + (x2) + ' ' + (y2 + curveVal);
				d = d + 'L' + (x3) + ' ' + (y3-curveVal);
			} else if(y3 < y2){
				d = d + 'C' + x2 + ' ' + y2 + ', ' + x2 + ' ' + y2 + ', ' + (x2) + ' ' + (y2 - curveVal);
				d = d + 'L' + (x3) + ' ' + (y3 + curveVal);
			}
			if(x4 > x3){
				d = d + 'C' + x3 + ' ' + y3 + ', ' + x3 + ' ' + y3 + ', ' + (x3 + curveVal) + ' '+  y3;
				d = d + 'L' + (x4 - curveVal) + ' ' + (y4);
			} else if(x4 < x3){
				d = d + 'C' + x3 + ' ' + y3 + ', ' + x3 + ' ' + y3 + ', ' + (x3 - curveVal) + ' ' + y3;
				d = d + 'L' + (x4 + curveVal) + ' ' + (y4);
			} else if(y4 > y3){
				d = d + 'C' + x3 + ' ' + y3 + ', ' + x3 + ' ' + y3 + ', ' + (x3) + ' ' + (y3 + curveVal);
				d = d + 'L' + (x4) + ' ' + (y4 - curveVal);
			} else if(y4 < y3){
				d = d + 'C' + x3 + ' ' + y3 + ', ' + x3 + ' ' + y3 + ', ' + (x3) + ' ' + (y3 - curveVal);
				d = d + 'L' + (x4) + ' ' + (y4 + curveVal);
			}
			if(x5 > x4){
				d = d + 'C' + x4 + ' ' + y4 + ', ' + x4 + ' ' + y4 + ', ' + (x4 + curveVal) + ' '+  y4;
				d = d + 'L' + (x5 - curveVal) + ' ' + (y5);
			} else if(x5 < x4){
				d = d + 'C' + x4 + ' ' + y4 + ', ' + x4 + ' ' + y4 + ', ' + (x4 - curveVal) + ' ' + y4;
				d = d + 'L' + (x5 + curveVal) + ' ' + (y5);
			} else if(y5 > y4){
				d = d + 'C' + x4 + ' ' + y4 + ', ' + x4 + ' ' + y4 + ', ' + (x4) + ' ' + (y4 + curveVal);
				d = d + 'L' + (x5) + ' ' + (y5 - curveVal);
			} else if(y5 < y4){
				d = d + 'C' + x4 + ' ' + y4 + ', ' + x4 + ' ' + y4 + ', ' + (x4) + ' ' + (y4 - curveVal);
				d = d + 'L' + (x5) + ' ' + (y5 + curveVal);
			}
			if(x6 > x5){
				d = d + 'C' + x5 + ' ' + y5 + ', ' + x5 + ' ' + y5 + ', ' + (x5 + curveVal) + ' '+  y5;
				d = d + 'L' + (x6) + ' ' + (y6);
			} else if(x6 < x5){
				d = d + 'C' + x5 + ' ' + y5 + ', ' + x5 + ' ' + y5 + ', ' + (x5 - curveVal) + ' ' + y5;
				d = d + 'L' + (x6) + ' ' + (y6);
			} else if(y6 > y5){
				d = d + 'C' + x5 + ' ' + y5 + ', ' + x5 + ' ' + y5 + ', ' + (x5) + ' ' + (y5 + curveVal);
				d = d + 'L' + (x6) + ' ' + (y6);
			} else if(y6 < y5){
				d = d + 'C' + x5 + ' ' + y5 + ', ' + x5 + ' ' + y5 + ', ' + (x5) + ' ' + (y5 - curveVal);
				d = d + 'L' + (x6) + ' ' + (y6);
			}
		}
		//fg.g.tag.setAttribute('d', d);
		///this.drawFlowArrows(fg, startDir, endDir, x1, y1, x6, y6);
		if(fg.svg.selectedFg != null && fg.svg.selectedfg.opt.figureId != fg.opt.figureId){
		}
		//console.log('d*********************', d);
		return d;
	}
	
	
	static arrangeFlowline (startDir, endDir, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6){
		if(startDir == 0){
			if(x1 == x2 &&
				x1 == x3 &&
				x1 == x4){
				y2 = y4;
				y3 = y4;
			}
			if(x1 == x2 &&
				x1 == x3){
				y2 = y3;
			}
		} else if(startDir == 1){
			if(y1 == y2 &&
				y1 == y3){
				x2 = x3;
			}
			if(endDir == 3){
				if(x2 < x1){
					x2 = x1;
				}
				if(x5 > x6){
					x5 = x6;
				}
			} 
		} else if(startDir == 2){
			if(x1 == x2 &&
				x1 == x3 &&
				x1 == x4){
				y2 = y4;
				y3 = y4;
			}
			if(x1 == x2 &&
				x1 == x3){
				y2 = y3;
			}
		} else if(startDir == 3){
			if(y1 == y2 &&
				y1 == y3){
				x2 = x3;
			}
		} 
		if(endDir == 0){
			if(x6 == x5 &&
				x6 == x4 &&
				x6 == x3){
				y4 = y3;
				y5 = y3;
			}
			if(x6 == x5 &&
				x6 == x4){
				y5 = y4;
			}
		} else if(endDir == 1){
			if(y6 == y5 &&
				y6 == y4 &&
				y6 == y3){
				x5 = x3;
				x4 = x3;
			}
			if(y6 == y5 &&
				y6 == y4){
				x5 = x4;
			}
		} else if(endDir == 2){
			if(x6 == x5 &&
				x6 == x4 &&
				x6 == x3){
				y4 = y3;
				y5 = y3;
			}
			if(x6 == x5 &&
				x6 == x4){
				y5 = y4;
			}
		} else if(endDir == 3){
			if(y6 == y5 &&
				y6 == y4 &&
				y6 == y3){
				x4 = x3;
				x5 = x3;
			}
			if(y6 == y5 &&
				y6 == y4){
				x5 = x4;
			}
		}
		return {
			x2:x2, 
			x3:x3,
			x4:x4,
			x5:x5,
			y2:y2,
			y3:y3,
			y4:y4,
			y5:y5
		};
	}
}