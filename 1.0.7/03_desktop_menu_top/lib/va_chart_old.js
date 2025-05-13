import Va from './va.js';
Va.AxisChart = class extends Va.Component {
    constructor( option){

		super('div', option);
		this.tagName = 'chart';
		this.elements = ['element'];
        this.containerElement = this.element; // child 위치.
		this.element.innerHTML = 'chart. blank data';
		this.colors = ['#0f6cbd', '#da3b01', '#d6d6d6', '#fde300', '#00723b', '#b4d6fa' , '#0027b4', '#eaa300', '#881798', '#dc626d' , '#a7e3a5', '#881798' ]
		var resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				// 관찰 대상의 resize이벤트시, 처리할 로직
				// console.log('entry', entry);
				if(entry.target== this.element){
					//setTimeout(()=>{
					this.resize(entry.contentBoxSize);
					//},100)
				}
			}
		});
		resizeObserver.observe(this.element);
    }
	resize (contentBoxSize){
		// console.log('resize********************************************', arguments);
		if(this.data != undefined && this.data != null){
			this.draw();
			//this.drawData();
		}
	}
	getColors(i){
		i = i % this.colors.length;
		return this.colors[i];
	}
	getGridColor(value, chart){
		// console.log('value', value, chart);
		let selectedArea = -1;
		for(let i=0; i < chart.range.length -1; i++){
			if(value >= chart.range[i] && value <= chart.range[i+1]){
				selectedArea = i;
				break;
			}
		}
		return {
			index: selectedArea,
			color: chart.colors[selectedArea]
		};
	}
	getAxesHeight(index, val){
		//this.chartArea.height : this.axes[index].max - this.axes[index].min = reaaHeight : val
		let height = (val-this.axes[index].min) * this.axes[index].height / (this.axes[index].max - this.axes[index].min)	// charts[index] --> axes[index]
		// console.log('height', height, val , this.axes[index].height ,'>>>max', this.axes[index].max, this.axes[index].min);
		return Va.Util.getFixedNumber(height);
	}
	getMinMax(data, axes){ // key, pMin, pMax){
		let key = axes.key;
		let pMin = axes.pMin;
		let pMax = axes.pMax;

		let min = null;
		let max = null;
		if(pMin != undefined && pMax != undefined){
			max = pMax;
			min = pMin;
		} else {
			// console.log('>>>', typeof axes.key, axes.keyType);
			if( Array.isArray(axes.key) == true){
				if(axes.keyType == 'max'){
					for(let j=0; j< data.length; j++){
						for(let k=0; k < key.length; k++){
							if(j==0){
								max = (data[j])[key[k]];
								min = (data[j])[key[k]];
							} else{
								if(max < (data[j])[key[k]]){
									max = (data[j])[key[k]];
								}
								if(min > (data[j])[key[k]]){
									min = (data[j])[key[k]];
								}						
							}
						}
					}						 
				} else if(axes.keyType == 'sum'){
					for(let j=0; j< data.length; j++){
						let tempMax = 0;
						let tempMin = 0;
						for(let k=0; k < key.length; k++){
							tempMax += (data[j])[key[k]];
							tempMin += (data[j])[key[k]];
						}
						if(j==0){
							max = tempMax;
							min = tempMin;
						} else{
							if(max < tempMax){
								max = tempMax;
							}
							if(min > tempMin){
								min = tempMin;
							}						
						}						
					}
					for(let j=0; j< data.length; j++){
						for(let k=0; k < key.length; k++){
							if(max < (data[j])[key[k]]){
								max = (data[j])[key[k]];
							}
							if(min > (data[j])[key[k]]){
								min = (data[j])[key[k]];
							}						
						}
					}					
				}
			} else {
				for(let j=0; j< data.length; j++){
					if(j==0){
						max = (data[j])[key];
						min = (data[j])[key];
					} else{
						if(max < (data[j])[key]){
							max = (data[j])[key];
						}
						if(min > (data[j])[key]){
							min = (data[j])[key];
						}						
					}
				}
			}
			if(axes.zeroBase == undefined || axes.zeroBase == true){
				if(min > 0){
					min = 0;
				}
			}
			// console.log('min max',min, max);
			
			let size =  (max - min);

			let changeMax = max + size * 0.1;
			let changeMin = min - size * 0.1;

			size =  (changeMax - changeMin);

			let digit = Va.Util.getDigit(size);
			// console.log('digit', digit);
			let pow = Math.pow(10, digit-1);
			let basePow = pow/10;
			// console.log('!!!!!!!!!!!!!', basePow)
			if(basePow >=1){
				max = Math.floor(changeMax / basePow)*basePow;
				min = Math.floor(changeMin / basePow)*basePow;
			} else {
				max = Math.floor(changeMax / basePow)*basePow;
				min = Math.floor(changeMin / basePow)*basePow;
			}
		}
		return {
			max: max,
			min: min
		}
	}	
	getGridLabelUnit(size, list){		// 가로세로.
		// console.log
		let interval = (size)/list.length;
		let label = [];

		for(let i=0; i < list.length; i++){
			label.push({
				startPos: i*interval,
				pos: i*interval + interval/2,
				endPos: (i+1)*interval,
				text: list[i]	
			});
		}
		return {			
			interval:interval,
			label:label
		}
	}

	getVerticalLabelUnit(height, min, max){
		let labelCount = 2;
		let valueHeight = (max - min);
		if(height < 40){
			labelCount = 2;
		} else if(height < 100){
			labelCount = 5;
		} else if(height < 200){
			labelCount = 5;
		} else if(height < 300){
			labelCount = 11;
		} else if(height < 500){
			labelCount = 15;
		} else if(height < 800){
			labelCount = 19;
		}  else {
			labelCount = 21;
		}

		/*
		let baseMax = max;
		if(Math.abs(min) > max){
			baseMax = Math.abs(min);
		}
		*/
		// console.log('min--------------------------------', min, max)
		let size = max -min;
		let digit = Va.Util.getDigit(size);
		// console.log('digit', digit);
		let pow = Math.pow(10, digit-1);
		let basePow = pow/100;
		
		// console.log('basePow---->', basePow)
		
		// 100이란 단위는 1/100 단위로 놓으면 될듯하다. 
		// console.log('labelCount', labelCount);
		let interval = Va.Util.getFixedNumber((max-min)/labelCount);
		let label = [];
		// console.log('interval', interval);
		
		if(min < 0){
			//max - min: 0 - min = height: 0pos

			let pos0 = height - (-1 * min * height / (max - min));
			// 양수

			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow < max; i++){
					// console.log('양수', i, Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow , max)
				
					label.push({ 
						y: Va.Util.getFixedNumber(pos0 - (height/labelCount * (i+1))),
						value: Va.Util.getFixedNumber(Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow)
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) / basePow)*basePow < max; i++){
					label.push({ 
						y: Va.Util.getFixedNumber(pos0 - (height/labelCount * (i+1))),
						value: Va.Util.getFixedNumber(Math.floor( (Number(0) + (interval * (i+1))) / basePow) * basePow)
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
			label.push({
				y: pos0,
				value: 0
			})
			// 음수
			
			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow > min; i++){
					label.push({ 
						y: Va.Util.getFixedNumber(pos0 + (height/labelCount * (i+1))),
						value: Va.Util.getFixedNumber(Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow)
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) / basePow)*basePow > min; i++){
					label.push({ 
						y: Va.Util.getFixedNumber(pos0 + (height/labelCount * (i+1))),
						value: Va.Util.getFixedNumber(Math.floor( (Number(0) - (interval * (i+1))) / basePow) * basePow)
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}			
		} else {
			for(let i=0; i <labelCount  + 1; i++){
				// console.log('>>>', i, height, labelCount, interval, basePow );
				// console.log('>>>>>>>',Number(min) + (interval * i) )
				// console.log('>>>>>>>',Math.floor(Number(min) + (interval * i) * basePow)/basePow)
				if(basePow >= 1){
					label.push({ 
						y: Va.Util.getFixedNumber(height - (height/labelCount * i)),
						value: Va.Util.getFixedNumber(Math.floor( (Number(min) + (interval * i)) * basePow)/basePow)
					})
				} else {
					label.push({ 
						y: Va.Util.getFixedNumber(height - (height/labelCount * i)),
						value: Va.Util.getFixedNumber(Math.floor( (Number(min) + (interval * i)) / basePow) * basePow)
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
		}
		// console.log('label', label);

		return {			
			max:max,
			min:min,
			interval:interval,
			label:label
		}
	}
	getAxesWidth(index, val){
		//this.chartArea.height : this.axes[index].max - this.axes[index].min = reaaHeight : val
		// console.log('getAxesWidth', index, this.charts[index])
		let width = (val-this.axes[index].min) * this.axes[index].width / (this.axes[index].max - this.axes[index].min)
		// console.log('width', width, val , this.axes[index].width ,'>>>max', this.axes[index].max, this.axes[index].min);
		return width;
	}
	getHorizontalLabelUnit(width, min, max){
		let labelCount = 2;
		let valueWidth = (max - min);
		if(width < 40){
			labelCount = 2;
		} else if(width < 100){
			labelCount = 4;
		} else if(width < 200){
			labelCount = 5;
		} else if(width < 300){
			labelCount = 10;
		} else if(width < 500){
			labelCount = 15;
		} else if(width < 800){
			labelCount = 18;
		}  else {
			labelCount = 20;
		}
		// console.log('min--------------------------------', min, max)
		let size = max -min;
		let digit = Va.Util.getDigit(size);
		// console.log('digit', digit);
		let pow = Math.pow(10, digit-1);
		let basePow = pow/100;
		// console.log('basePow---->', basePow)
		// 100이란 단위는 1/100 단위로 놓으면 될듯하다. 
		// console.log('labelCount', labelCount);
		let interval = (max-min)/labelCount;
		let label = [];
		if(min < 0){
			//max - min: 0 - min = width: 0pos
			//let pos0 = width - (-1 * min * width / (max - min));
			let pos0 = (-1 * min * width / (max - min));
			// console.log('pos0', pos0);
			// 양수

			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow < max; i++){
					// console.log('양수', i, Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow , max)
				
					label.push({ 
						x: pos0 + (width/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) / basePow)*basePow < max; i++){
					label.push({ 
						x: pos0 + (width/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
			label.push({
				x: pos0,
				value: 0
			})
			// 음수
			
			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow > min; i++){
					label.push({ 
						x: pos0 - (width/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) / basePow)*basePow > min; i++){
					label.push({ 
						x: pos0 - (width/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}			

		} else {

			
			for(let i=0; i <labelCount  + 1; i++){
				// console.log('>>>', i, width, labelCount, interval, basePow );
				// console.log('>>>>>>>',Number(min) + (interval * i) )
				// console.log('>>>>>>>',Math.floor(Number(min) + (interval * i) * basePow)/basePow)
				if(basePow >= 1){
					label.push({ 
						x: (width/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) * basePow)/basePow
					})
				} else {
					label.push({ 
						x: (width/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
		}
		return {			
			max:max,
			min:min,
			interval:interval,
			label:label
		}
	}	
}


// Vertical Chart
Va.VerticalChart = class extends Va.AxisChart {
    constructor( option){
        super(option);
		this.tagName = 'verticalChart';
		this.elements = ['element'];
		this.properties = [ 'axesStroke', 'axesFontSize', 'axesFontStroke', 
			'chartAreaFill', 'chartAreaStroke', 
			'chartFontSize', 'chartFill', 'chartStroke', ...this.properties];

		this.axesFontSize = 14;
		this.chartFontSize = 14;
		this.axesTitleFontSize = 14;
		this.setOption();

		if(this.option.data != undefined){
			this.setData(this.option.data);
		}
		if(this.equalClass(Va.VerticalChart)){
			this.update();
		}
    }
	update(){
		if(this.equalClass(Va.VerticalChart)){
			this.updateStyles();
		}
	}
	draw(){
		if(this.data == null){
			this.element.innerHTML = 'chart area';
		}

		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.element.append(this.svgElement);
		if(this.option.title != undefined){
			this.title = this.option.title
		} 
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.area.border == undefined){
			this.area.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.area.margin = 30
		} 
		if(this.area.marginTop == undefined){
			this.area.marginTop = 30
		}
		if(this.area.marginBottom == undefined){
			this.area.marginBottom = 30
		} 
		if(this.area.marginLeft == undefined){
			this.area.marginLeft = 30
		}
		if(this.area.marginRight == undefined){
			this.area.marginRight = 30
		} 		
		if(this.option.axes == undefined){
			this.axes =[{
				position:'left'
			}]
		} else {
			this.axes = this.option.axes;
		}
		if(this.option.legends == undefined){
			this.legends =[];
		} else {
			this.legends = this.option.legends;
		}
		
		if(this.title == undefined){
			this.titleIndex = -1;
		}

		let leftAxesCount = 0;		
		let rightAxesCount = 0;
		let bottomAxesCount = 0;
		let topAxesCount = 0;
		this.leftAxesIndex =-1;
		this.rightAxesIndex =-1;
		this.bottomAxesIndex =-1;
		this.topAxesIndex = -1;
		// console.log(this.axes);

		for(let i=0; i < this.axes.length; i++){
			if( this.axes[i].position == undefined || this.axes[i].position == 'left'){
				leftAxesCount++;
				this.leftAxesIndex = i;
			}
			if(this.axes[i].position == 'right'){
				rightAxesCount++;
				this.rightAxesIndex =i;
			}
			if(this.axes[i].position == 'bottom'){
				bottomAxesCount++;
				this.bottomAxesIndex =i;
			}
			if(this.axes[i].position == 'top'){
				topAxesCount++;
				this.topAxesIndex =i;
			}
			if(this.axes[i].fontSize == undefined || this.axes[i].fontSize == null){
				this.axes[i].fontSize = 14;
			}
		}
		if(leftAxesCount >1){
			alert('차트의 left 축은 한개만 설정할 수 있습니다.')
		}
		if(rightAxesCount >1){
			alert('차트의 right 축은 한개만 설정할 수 있습니다.')
		}
		if(bottomAxesCount >1){
			alert('차트의 bottom 축은 한개만 설정할 수 있습니다.')
		}
		if(topAxesCount >1){
			alert('차트의 top 축은 한개만 설정할 수 있습니다.')
		}		
		let leftLegendCount = 0;		
		let rightLegendCount = 0;
		let bottomLegendCount = 0;
		let topLegendCount = 0;
		this.leftLegendIndex =-1;
		this.rightLegendIndex =-1;
		this.bottomLegendIndex =-1;
		this.topLegendIndex = -1;
		for(let i=0; i < this.legends.length; i++){
			if(this.legends[i].position == 'left'){
				leftLegendCount++;
				this.leftLegendIndex =i;
			}
			if(this.legends[i].position == 'right'){
				rightLegendCount++;
				this.rightLegendIndex =i;
			}
			if(this.legends[i].position == 'bottom'){
				bottomLegendCount++;
				this.bottomLegendIndex =i;
			}
			if(this.legends[i].position == 'top'){
				topLegendCount++;
				this.topLegendIndex =i;
			}
			if(this.legends[i].fontSize == undefined || this.legends[i].fontSize == null){
				this.legends[i].fontSize = 14;
			}
			if(this.legends[i].titleFontSize == undefined || this.legends[i].titleFontSize == null){
				this.legends[i].titleFontSize = 14;
			}
		}

		if(leftLegendCount >1){
			alert('차트의 left Legend는 한개만 설정할 수 있습니다.');
			return;
		}
		if(rightLegendCount >1){
			alert('차트의 right Legend는 한개만 설정할 수 있습니다.')
			return;
		}
		if(bottomLegendCount >1){
			alert('차트의 bottom Legend는 한개만 설정할 수 있습니다.')
			return;
		}
		if(topLegendCount >1){
			alert('차트의 top Legend는 한개만 설정할 수 있습니다.')
			return;
		}

		// 크기계산때문에 모든 legend와 axes 크기는 미리 계산해 놓아야 한다. 
		if(this.leftLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
		}
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
		}

		if(this.leftAxesIndex != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}
		}
		if(this.rightAxesIndex != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}
		}
		if(this.topAxesIndex != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}
		}
		if(this.bottomAxesIndex != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}
		}


		//// console.log('columnGap --------------------> ', columnGap);	

		this.titleArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		//this.titleArea.style.backgroundColor = 'yellow';
		this.bottomLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.leftLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.rightLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.leftAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.rightAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.bottomAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");


		// title
		if(this.title != undefined){
			this.titleArea.setAttribute('x', 0)
			this.titleArea.setAttribute('y', 0)
			this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.titleElement.textContent = this.title.text;

			if(this.title.height == undefined){
				this.title.height = 30;
			}
			if(this.title.fontSize == undefined){
				this.title.fontSize = 20
			}
			this.titleArea.setAttribute('height', this.title.height)
			this.titleArea.appendChild(this.titleElement);
			this.titleElement.width = this.svgElement.offsetWidth;
			this.titleElement.setAttribute('x', this.element.offsetWidth/2);
			this.titleElement.setAttribute('y', this.title.height/2);
			this.titleElement.setAttribute('text-anchor', 'middle');
			this.titleElement.setAttribute('alignment-baseline', 'middle');
			this.titleElement.setAttribute('font-size', this.title.fontSize);
			if(Va.Util.isNotBlank(this.title.storke)){
				this.titleElement.setAttribute('stroke', this.title.stroke);
			}
			if(Va.Util.isNotBlank(this.title.fill)){
				this.titleElement.setAttribute('fill', this.title.stroke);
			} else {
				this.titleElement.setAttribute('fill', 'var(--colorStroke)');
			}
			this.svgElement.append(this.titleArea);				
		}
		// top Legend
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
			this.topLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.topLegendIndex].height);
			if(this.title == undefined){
				this.topLegendArea.setAttribute('y', this.area.marginTop );
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			} else {
				this.topLegendArea.setAttribute('y', this.area.marginTop + this.title.height);
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			}
			
			this.topLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.topLegendIndex].key;
			let display = this.legends[this.topLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%';//this.topLegendArea.offsetWidth;
			area.style.height = '100%';//this.topLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center; margin-left:3px')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.topLegendIndex].display[i];
				let fontSize = this.legends[this.topLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.topLegendArea.append(area);
			this.svgElement.appendChild(this.topLegendArea);
		}		
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
			this.bottomLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('y', this.element.offsetHeight - this.area.marginBottom - this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('width', this.element.offsetWidth)
			this.bottomLegendArea.setAttribute('height', this.legends[this.bottomLegendIndex].height);

			let key = this.legends[this.bottomLegendIndex].key;
			let display = this.legends[this.bottomLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.bottomLegendArea.offsetWidth;
			area.style.height = '100%'; //this.bottomLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.bottomLegendIndex].display[i];
				let fontSize = this.legends[this.bottomLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.bottomLegendArea.append(area);
			this.svgElement.appendChild(this.bottomLegendArea);
		}
		// left Legend
		if(this.leftLegendIndex != -1){
			if(this.legends[this.leftLegendIndex].width == undefined){
				this.legends[this.leftLegendIndex].width = 100;
			}
			this.leftLegendArea.setAttribute('x', this.area.marginLeft);
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;
			let width = this.legends[this.leftLegendIndex].width

			this.leftLegendArea.setAttribute('y', topPos);
			this.leftLegendArea.setAttribute('height', height);
			this.leftLegendArea.setAttribute('width', width);
			
			//this.leftLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.leftLegendIndex].key;
			let display = this.legends[this.leftLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '98%';//this.leftLegendArea.offsetWidth;
			area.style.height = '98%'; //this.leftLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:96%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.leftLegendIndex].display[i];
				let fontSize = this.legends[this.leftLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.leftLegendArea.append(area);
			this.svgElement.appendChild(this.leftLegendArea);
		}	
		// right Legend
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;

			let height = bottomPos - topPos;
			let width = this.legends[this.rightLegendIndex].width

			this.rightLegendArea.setAttribute('y', topPos);
			this.rightLegendArea.setAttribute('x', leftPos);

			this.rightLegendArea.setAttribute('height', height + 'px');
			this.rightLegendArea.setAttribute('width', width + 'px');
			
			//this.rightLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.rightLegendIndex].key;
			let display = this.legends[this.rightLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '98%'; //this.rightLegendArea.offsetWidth + 'px';
			area.style.height = '98%'; //this.rightLegendArea.offsetHeight + 'px';
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:96%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.rightLegendIndex].display[i];
				let fontSize = this.legends[this.rightLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.rightLegendArea.append(area);
			this.svgElement.appendChild(this.rightLegendArea);
		}	
		// Left축
		if(this.leftAxesIndex  != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}			
			let leftPos = this.area.marginLeft;
			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.leftAxesIndex].width;
			this.axes[this.leftAxesIndex].top = topPos;
			this.axes[this.leftAxesIndex].left = leftPos;
			this.axes[this.leftAxesIndex].height = height;
			this.axes[this.leftAxesIndex].width = width;

			this.leftAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.leftAxesArea);
			// 세로눈금을 그린다.----------------------------------
			
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.leftAxesIndex]); //this.axes[this.leftAxesIndex].key, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.leftAxesIndex].min = minMaxInfo.min;
			this.axes[this.leftAxesIndex].max = minMaxInfo.max;
			/*
			if(this.data == undefined || this.data == null || this.data.length ==0){
				if(this.axes[this.leftAxesIndex].max == undefined || this.axes[this.leftAxesIndex].max == null){
					this.axes[this.leftAxesIndex].max = 100;
				}
				if(this.axes[this.leftAxesIndex].min == undefined || this.axes[this.leftAxesIndex].min == null){
					this.axes[this.leftAxesIndex].max = 0;
				}
			} else {
				let max = null;
				let min = null;			
				for(let j=0; j< this.data.length; j++){
					if(j==0){
						max = (this.data[j])[this.axes[this.leftAxesIndex].key];
						min = (this.data[j])[this.axes[this.leftAxesIndex].key];
					} else{
						if(max < (this.data[j])[this.axes[this.leftAxesIndex].key]){
							max = (this.data[j])[this.axes[this.leftAxesIndex].key];
						}
						if(min > (this.data[j])[this.axes[this.leftAxesIndex].key]){
							min = (this.data[j])[this.axes[this.leftAxesIndex].key];
						}						
					}
				}
				if(this.axes[this.leftAxesIndex].max == undefined || this.axes[this.leftAxesIndex].max == null){
					this.axes[this.leftAxesIndex].max = max;
				}
				if(this.axes[this.leftAxesIndex].min == undefined || this.axes[this.leftAxesIndex].min == null){
					if(min > 0){
						this.axes[this.leftAxesIndex].min = 0;
					} else {
						this.axes[this.leftAxesIndex].min = min;
					}
				}
			}
			*/
			// console.log('max', this.axes[this.leftAxesIndex].max);
			// console.log('data', this.data);
			if(this.axes[this.leftAxesIndex].stroke == undefined){
				this.axes[this.leftAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.leftAxesIndex].labelStroke == undefined){
				this.axes[this.leftAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.leftAxesIndex].labelInterval == undefined){
				this.axes[this.leftAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.leftAxesIndex].labelMargin == undefined){
				this.axes[this.leftAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.leftAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.leftAxesIndex].grid = true;		
			}

			if(this.axes[this.leftAxesIndex].labelInterval == 'auto'){
				//// console.log('>>', this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				this.axes[this.leftAxesIndex].labelInfo = labelInfo;
				this.axes[this.leftAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.leftAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('x', this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke);
					
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
					this.axes[this.leftAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelEl[j])
				}

			}
			// left축 타이틀
			this.axes[this.leftAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('x', 10); //this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.leftAxesIndex].top - this.axes[this.leftAxesIndex].fontSize - 10);
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke);
			//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'middle');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
			this.axes[this.leftAxesIndex].labelTitleEl.textContent = this.axes[this.leftAxesIndex].labelTitle;
			this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelTitleEl);

			this.leftAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.leftAxesLineElement.setAttribute('d',  'M' + this.axes[this.leftAxesIndex].width + ' ' + 0 + 
										' L' + this.axes[this.leftAxesIndex].width + ' ' + this.axes[this.leftAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.leftAxesLineElement.setAttribute('stroke', this.axes[this.leftAxesIndex].stroke);
			this.leftAxesLineElement.setAttribute('fill', 'transparent');
			this.leftAxesArea.append(this.leftAxesLineElement);				

		}
		// Right Axes
		if(this.rightAxesIndex  != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}			
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.axes[this.rightAxesIndex].width;
			if(this.rightLegendIndex != -1){
				leftPos -= this.legends[this.rightLegendIndex].width 
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.rightAxesIndex].width;
			this.axes[this.rightAxesIndex].top = topPos;
			this.axes[this.rightAxesIndex].left = leftPos;
			this.axes[this.rightAxesIndex].height = height;
			this.axes[this.rightAxesIndex].width = width;

			this.rightAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.rightAxesArea);

			let minMaxInfo = this.getMinMax(this.data, this.axes[this.rightAxesIndex]);//this.axes[this.rightAxesIndex].key, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.rightAxesIndex].min = minMaxInfo.min;
			this.axes[this.rightAxesIndex].max = minMaxInfo.max;
			/*
			// 세로눈금을 그린다.----------------------------------
			if(this.data == undefined || this.data == null || this.data.length ==0){
				if(this.axes[this.rightAxesIndex].max == undefined || this.axes[this.rightAxesIndex].max == null){
					this.axes[this.rightAxesIndex].max = 100;
				}
				if(this.axes[this.rightAxesIndex].min == undefined || this.axes[this.rightAxesIndex].min == null){
					this.axes[this.rightAxesIndex].max = 0;
				}
			} else {
				let max = null;
				let min = null;			
				for(let j=0; j< this.data.length; j++){
					if(j==0){
						max = (this.data[j])[this.axes[this.rightAxesIndex].key];
						min = (this.data[j])[this.axes[this.rightAxesIndex].key];
					} else{
						if(max < (this.data[j])[this.axes[this.rightAxesIndex].key]){
							max = (this.data[j])[this.axes[this.rightAxesIndex].key];
						}
						if(min > (this.data[j])[this.axes[this.rightAxesIndex].key]){
							min = (this.data[j])[this.axes[this.rightAxesIndex].key];
						}						
					}
				}
				if(this.axes[this.rightAxesIndex].max == undefined || this.axes[this.rightAxesIndex].max == null){
					this.axes[this.rightAxesIndex].max = max;
				}
				if(this.axes[this.rightAxesIndex].min == undefined || this.axes[this.rightAxesIndex].min == null){
					if(min > 0){
						this.axes[this.rightAxesIndex].min = 0;
					} else {
						this.axes[this.rightAxesIndex].min = min;
					}
				}
			}
			*/
			// console.log('max', this.axes[this.rightAxesIndex].max);
			// console.log('data', this.data);
			if(this.axes[this.rightAxesIndex].stroke == undefined){
				this.axes[this.rightAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.rightAxesIndex].labelStroke == undefined){
				this.axes[this.rightAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.rightAxesIndex].labelInterval == undefined){
				this.axes[this.rightAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.rightAxesIndex].labelMargin == undefined){
				this.axes[this.rightAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.rightAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.rightAxesIndex].grid = true;		
			}

			if(this.axes[this.rightAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				this.axes[this.rightAxesIndex].labelInfo = labelInfo;
				this.axes[this.rightAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].labelMargin);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'start');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke);
					
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
					this.axes[this.rightAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelEl[j])
				}
			}
			// right축 타이틀
			this.axes[this.rightAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.rightAxesIndex].width -10);
			if(this.topAxesIndex != -1){
				console.log( this.axes[this.topAxesIndex]);
				//debugger;
				this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.rightAxesIndex].top - this.axes[this.rightAxesIndex].fontSize - 10 - this.axes[this.topAxesIndex].height);
			} else if(this.bottomAxesIndex != -1){
				this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.rightAxesIndex].top - this.axes[this.rightAxesIndex].fontSize - 10 );
			}
			//this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke);			
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke);
			//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'middle');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
			this.axes[this.rightAxesIndex].labelTitleEl.textContent = this.axes[this.rightAxesIndex].labelTitle;
			this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelTitleEl);



			this.rightAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.rightAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + 0 + ' ' + this.axes[this.rightAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.rightAxesLineElement.setAttribute('stroke', this.axes[this.rightAxesIndex].stroke);
			this.rightAxesLineElement.setAttribute('fill', 'transparent');
			this.rightAxesArea.append(this.rightAxesLineElement);		
		}
	
		let dataLength = this.data.length;

		if(this.bottomAxesIndex  != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.element.offsetHeight - this.area.marginBottom;
			
			if(this.bottomLegendIndex != -1){
				topPos -= this.legends[this.bottomLegendIndex].height;
			}
			
			if(this.bottomAxesIndex !=-1){
				topPos -= this.axes[this.bottomAxesIndex].height;
			}
			

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.bottomAxesIndex].top = topPos;
			this.axes[this.bottomAxesIndex].left = leftPos;
			this.axes[this.bottomAxesIndex].height = height;
			this.axes[this.bottomAxesIndex].width = width;

			let columnWidth = this.axes[this.bottomAxesIndex].width / dataLength;
			this.axes[this.bottomAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.bottomAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}

			this.bottomAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.bottomAxesArea);
			// 가로 눈금을 그린다.----------------------------------

			// console.log('data', this.data);
			if(this.axes[this.bottomAxesIndex].stroke == undefined){
				this.axes[this.bottomAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.bottomAxesIndex].labelStroke == undefined){
				this.axes[this.bottomAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.bottomAxesIndex].labelInterval == undefined){
				this.axes[this.bottomAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.bottomAxesIndex].labelMargin == undefined){
				this.axes[this.bottomAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.bottomAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.bottomAxesIndex].grid = true;		
			}

			

			if(this.axes[this.bottomAxesIndex].labelEl == undefined){
				this.axes[this.bottomAxesIndex].labelEl = [];
			}
			
			let columnGap = Math.floor(100/columnWidth)
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.bottomAxesIndex].axesColumns[j].center);
				// console.log(j, this.axes[this.bottomAxesIndex].axesColumns);
				//debugger;
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', this.axes[this.bottomAxesIndex].axesColumns[j].center);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin );
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);				
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize );
				this.axes[this.bottomAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.bottomAxesIndex].key];
				this.bottomAxesArea.appendChild(this.axes[this.bottomAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}

			// bottom축 타이틀
			this.axes[this.bottomAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.bottomAxesIndex].height);
			if(this.leftAxesIndex != -1 && this.rightAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.bottomAxesIndex].width/2 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'center'); //'end');
			} else if(this.leftAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.bottomAxesIndex].width - 10 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			} else if(this.rightAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', 10 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			}
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'baseline');
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize);
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);				
			this.axes[this.bottomAxesIndex].labelTitleEl.textContent = this.axes[this.bottomAxesIndex].labelTitle;
			this.bottomAxesArea.append(this.axes[this.bottomAxesIndex].labelTitleEl);


			this.bottomAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.bottomAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + this.axes[this.bottomAxesIndex].width + ' ' + 0 );
			this.bottomAxesLineElement.setAttribute('stroke', this.axes[this.bottomAxesIndex].stroke);
			this.bottomAxesLineElement.setAttribute('fill', 'transparent');
			this.bottomAxesArea.append(this.bottomAxesLineElement);		
		}	

		// TopAxes
		if(this.topAxesIndex  != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}

			let bottomPos = topPos + this.axes[this.topAxesIndex].height;
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.topAxesIndex].top = topPos;
			this.axes[this.topAxesIndex].left = leftPos;
			this.axes[this.topAxesIndex].height = height;
			this.axes[this.topAxesIndex].width = width;

			let columnWidth = this.axes[this.topAxesIndex].width / dataLength;
			//this.axesColumns = [];
			this.axes[this.topAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.topAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}

			this.topAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.topAxesArea);
			// 가로 눈금을 그린다.----------------------------------

			// console.log('data', this.data);
			if(this.axes[this.topAxesIndex].stroke == undefined){
				this.axes[this.topAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.topAxesIndex].labelStroke == undefined){
				this.axes[this.topAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.topAxesIndex].labelInterval == undefined){
				this.axes[this.topAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.topAxesIndex].labelMargin == undefined){
				this.axes[this.topAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.topAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.topAxesIndex].grid = true;		
			}

			


			if(this.axes[this.topAxesIndex].labelEl == undefined){
				this.axes[this.topAxesIndex].labelEl = [];
			}
			let columnGap = Math.floor(100/columnWidth)

			for(let j = 0; j < this.data.length; j++){
				this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', this.axes[this.topAxesIndex].axesColumns[j].center);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', this.axes[this.topAxesIndex].height - this.axes[this.topAxesIndex].labelMargin );
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);			
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'base-line');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.topAxesIndex].fontSize );
				this.axes[this.topAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.topAxesIndex].key];
				this.topAxesArea.appendChild(this.axes[this.topAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}

			// top축 타이틀
			this.axes[this.topAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('y', 10);
			if(this.leftAxesIndex != -1 && this.rightAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.topAxesIndex].width/2 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'center'); //'end');
			} else if(this.leftAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.topAxesIndex].width - 10 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			} else if(this.rightAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', 10 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			}
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);			
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'baseline');
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.topAxesIndex].fontSize);
			this.axes[this.topAxesIndex].labelTitleEl.textContent = this.axes[this.topAxesIndex].labelTitle;
			this.topAxesArea.append(this.axes[this.topAxesIndex].labelTitleEl);


			this.topAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.topAxesLineElement.setAttribute('d',  'M 0 ' + this.axes[this.topAxesIndex].height + 
										' L' + this.axes[this.topAxesIndex].width + ' ' + this.axes[this.topAxesIndex].height );
			this.topAxesLineElement.setAttribute('stroke', this.axes[this.topAxesIndex].stroke);
			this.topAxesLineElement.setAttribute('fill', 'transparent');
			this.topAxesArea.append(this.topAxesLineElement);		
		}				



		// -------------- chart ---------------------------------
		this.charts = this.option.charts;
		this.chartAreaElements = [];
		this.chartLabelAreaElements = [];

		let chartAreaTop  = this.area.marginTop;
		if(this.title != undefined){
			chartAreaTop += this.title.height;
		}
		if(this.topLegendIndex != -1){
			chartAreaTop += this.legends[this.topLegendIndex].height;
		}
		if(this.topAxesIndex != -1){
			chartAreaTop += this.axes[this.topAxesIndex].height;
		}

		let chartAreaBottom  = this.element.offsetHeight - this.area.marginBottom;
		if(this.bottomLegendIndex != -1){
			chartAreaBottom -= this.legends[this.bottomLegendIndex].height;
		}
		if(this.bottomAxesIndex != -1){
			chartAreaBottom -= this.axes[this.bottomAxesIndex].height;
		}

		let chartAreaLeft  = this.area.marginLeft;
		if(this.leftLegendIndex != -1){
			chartAreaLeft += this.legends[this.leftLegendIndex].width;
		}
		if(this.leftAxesIndex != -1){
			chartAreaLeft += this.axes[this.leftAxesIndex].width;
		}

		let chartAreaRight  = this.element.offsetWidth - this.area.marginRight;
		if(this.rightLegendIndex != -1){
			chartAreaRight -= this.legends[this.rightLegendIndex].width;
		}
		if(this.rightAxesIndex != -1){
			chartAreaRight -= this.axes[this.rightAxesIndex].width;
		}


		for(let i=0; i < this.charts.length ; i++){
			this.charts[i].top = chartAreaTop;
			this.charts[i].left = chartAreaLeft;
			this.charts[i].bottom = chartAreaBottom;
			this.charts[i].right = chartAreaRight;
			this.charts[i].width = chartAreaRight - chartAreaLeft;
			this.charts[i].height = chartAreaBottom - chartAreaTop;

			if(this.charts[i].textPosition == undefined){
				this.charts[i].textPosition = 'out';
			}
			if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
				this.charts[i].fontSize = 12;
			}
			//this.charts[i].axesIndex

			if(i==0){
				let columnWidth = this.charts[i].width / dataLength;
				this.columns = [];
				for(let j=0; j < dataLength; j++){
					this.columns[j] ={
						center: j * columnWidth  + columnWidth/2,				
						left: j * columnWidth,
						right: (j+1) * columnWidth,
						leftInner: j * columnWidth + (columnWidth * 0.2),
						rightInner: (j+1) * columnWidth - (columnWidth * 0.2),
					}
				}		
			}
			if(i==0){
				this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
				this.svgElement.appendChild(this.chartAreaElements[i] );
			} else {
				this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
				this.svgElement.insertBefore(this.chartAreaElements[i], this.chartLabelAreaElements[0]);
			}

			this.chartLabelAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
			this.chartLabelAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
			this.svgElement.appendChild(this.chartLabelAreaElements[i] );

			if(this.charts[i].axesPosition == undefined || this.charts[i].axesPosition == null){
				
				for(let j=0; j < this.axes.length; j++){					
					if(this.axes[j].position == 'left'){
						this.charts[i].axesPosition = 'left';
					} else if(this.axes[j].position == 'right'){
						this.charts[i].axesPosition = 'right';
					}
				}
			}
			
			for(let j=0; j < this.axes.length; j++){
				// console.log('j====>', this.axes[j].position, this.charts[i].axesPosition);
				if(this.axes[j].position == this.charts[i].axesPosition){
					this.charts[i].axesIndex = j;
					break;
				}
			}			
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
			if(this.charts[i].grid == undefined){
				this.charts[i].grid = true;
			}
			if(this.charts[i].grid == true){
				// console.log(this.charts[i].axesIndex);
				// console.log(this.axes[this.charts[i].axesIndex]);
				let labelInfo = this.axes[this.charts[i].axesIndex].labelInfo;
				for(let j=0; j < labelInfo.label.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M 0 ' + labelInfo.label[j].y + ' L' + this.charts[i].width + ' ' + labelInfo.label[j].y);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}


			if(this.charts[i].gridColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].center + ' ' + '0' + ' L' + this.columns[j].center + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}						
			if(this.charts[i].gridBoundColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].right + ' ' + '0' + ' L' + this.columns[j].right + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}	

			if(this.charts[i].type == 'bar'){
				this.charts[i].barTextElement = [];
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
						barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
						'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
					} else {
						barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' + this.charts[i].height   + ' ' + 
						'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + this.columns[j].rightInner + ' ' + this.charts[i].height  + 'Z');
					}
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
			} else if(this.charts[i].type == 'stock'){
				this.charts[i].barTextElement = [];
				for(let j=0; j < this.data.length; j++){
					let startValue= (this.data[j])[this.charts[i].startKey];
					let startH = this.getAxesHeight(this.charts[i].axesIndex, startValue);
					let endValue= (this.data[j])[this.charts[i].endKey];
					let endH = this.getAxesHeight(this.charts[i].axesIndex, endValue);
					let highValue= (this.data[j])[this.charts[i].highKey];
					let highH = this.getAxesHeight(this.charts[i].axesIndex, highValue);
					let lowValue= (this.data[j])[this.charts[i].lowKey];
					let lowH = this.getAxesHeight(this.charts[i].axesIndex, lowValue);

					let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					lineElement.setAttribute('d', 
						'M' + this.columns[j].center + ' ' + (this.charts[i].height - highH) + ' ' +	
						'L' + this.columns[j].center + ' ' + (this.charts[i].height - lowH));
					this.chartAreaElements[i].append(lineElement);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);

					barElement.setAttribute('d', 
					'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * startH))  + ' ' + 
					'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - endH) + ' ' + 
					'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - endH)+ ' ' + 
					'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * startH)) + 'Z');
					
					if( startValue <= endValue){
						barElement.setAttribute('fill', this.charts[i].upColor); 
						lineElement.setAttribute('stroke', this.charts[i].upColor); 
					} else {
						barElement.setAttribute('fill', this.charts[i].downColor); 
						lineElement.setAttribute('stroke', this.charts[i].downColor); 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					/*
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}							
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'darkgray';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					*/
				}
			} else if(this.charts[i].type == 'column'){
				this.charts[i].barTextElement = [];
				// 초기화.
				let totalColumnCount = 0;
				for(let j=0; j < this.charts.length; j++){
					if(this.charts[j].type == 'column'){
						totalColumnCount++;
					}
				}
				let columnCount = 0;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'column'){
						columnCount++;
					}
				}
				

				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
						let gap = (this.columns[j].rightInner -this.columns[j].leftInner)/totalColumnCount;
						barElement.setAttribute('d', 
						'M' + (this.columns[j].leftInner + gap * columnCount) + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
						'L' + (this.columns[j].leftInner + gap * columnCount) + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
					/*} else {
						barElement.setAttribute('d', 
						'M' + (this.columns[j].leftInner + gap * columnCount) + ' ' + this.charts[i].height   + ' ' + 
						'L' + (this.columns[j].leftInner + gap * columnCount) + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + this.charts[i].height  + 'Z');
					}
					*/
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						//let gap = (this.columns[j].rightInner -this.columns[j].leftInner)/totalColumnCount;

						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('x', ((this.columns[j].leftInner + gap * columnCount) + (this.columns[j].leftInner + (gap) * (columnCount+1)))/2);
						
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined ||this.charts[i].textFill == null){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('font-size', this.chartfontSize);
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}				
			} else if(this.charts[i].type == 'stack'){
				this.charts[i].barTextElement = [];
				// 초기화.
				let checkFirstStack = true;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'stack'){
						checkFirstStack = false;						
					}
				}				
				if(checkFirstStack == true){
					this.stackDataSize = [];
					//let initH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					for(let j=0; j < this.data.length; j++){
						this.stackDataSize[j] = 0;
					}
				}
				
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key] + this.stackDataSize[j];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, this.stackDataSize[j]);
						//let zeroH = this.stackDataSize[j];
						barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
						'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');

					this.stackDataSize[j] = value;
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}	
				
					
				
				/*
				this.charts[i].barTextElement = [];
				let stackKeyArray = [];
				for(let j=0; j < this.data.length; j++){
					if(j == 0){
						stackKeyArray.push( (this.data[j])[this.option.stackKey]);
						stackKeyArray[stackKeyArray.length-1].list = [];
						stackKeyArray[stackKeyArray.length-1].list.push(this.data[j])
					} else {
						if((this.data[j])[this.option.stackKey] != (this.data[j-1])[this.option.stackKey]){
							stackKeyArray.push( (this.data[j])[this.option.stackKey]);
							stackKeyArray[stackKeyArray.length-1].list = [];
							stackKeyArray[stackKeyArray.length-1].list.push(this.data[j]);
						} else {
							stackKeyArray[stackKeyArray.length-1].list.push(this.data[j]);
						}
					}
				}
				// console.log('stackKeyArray', stackKeyArray);

				for(let j=0; j < stackKeyArray.length; j++){
					for(let k=0; k < stackKeyArray[j].list.length; k++){
						//if((this.data[j])[this.option.stackKey] != (this.data[j-1])[this.option.stackKey]){}
						let value= (stackKeyArray[j].list[k])[this.charts[i].key];
						let h = this.getAxesHeight(this.charts[i].axesIndex, value);
						let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
						if(this.axes[this.charts[i].axesIndex].min < 0){
							let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
							barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
							'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
						} else {
							barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' + this.charts[i].height   + ' ' + 
							'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
							'L' + this.columns[j].rightInner + ' ' + this.charts[i].height  + 'Z');
						}
						if( this.charts[i].fill == undefined){
							barElement.setAttribute('fill', this.getColors(i)); 
						} else {
							barElement.setAttribute('fill', this.charts[i].fill) 
						}
						if(this.charts[i].opacity != undefined){
							barElement.setAttribute('opacity', this.charts[i].opacity);
						}

						this.chartAreaElements[i].append(barElement);
						this.charts[i].chartTextElement = [];
						if(this.charts[i].text != undefined){						
							if(this.charts[i].textInterval == undefined){
								this.charts[i].textInterval = 5;
							}
							this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
							this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
							if(this.charts[i].textPosition == 'in'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'white';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							} else {
								if(this.charts[i].textPosition == 'out'){
									if(this.charts[i].textFill == undefined){
										this.charts[i].textFill = 'darkgray';
									}
									if(value >= 0){
										this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
										this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
									} else {
										this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
										this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

									}
									this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
								}
							}
							this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
							this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
						}
					}
				}	
				*/			
			} else if(this.charts[i].type == 'line'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', 'transparent') 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;


				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (this.data[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (this.data[j-2])[this.charts[i].key];
							}
							let curValue = (this.data[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < this.data.length-1){
								nextValue = (this.data[j+1])[this.charts[i].key];
							}
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(this.charts[i].axesIndex, bfValue);
								posYBf = (this.charts[i].height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(this.charts[i].axesIndex, bfBfValue);
								posYBfBf = (this.charts[i].height - hBfBf);
							}
							if(j < this.data.length -1){
								hAf = this.getAxesHeight(this.charts[i].axesIndex, nextValue);
								posYAf = (this.charts[i].height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						
						if(j == 0){
							d = 'M' + this.columns[j].center + ' ' + (this.charts[i].height - h) + ' ';
						} else {
							d = d + 'L' + this.columns[j].center  + ' ' + (this.charts[i].height - h) + ' ';
						}
					}
					lineElement.setAttribute('d', d);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					this.chartAreaElements[i].append(lineElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].fontSize == null || this.charts[i].fontSize == undefined){
						this.charts[i].fontSize = 14;
					}
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
				lineElement.setAttribute('d', d);
			} else if(this.charts[i].type == 'area'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill) 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;


				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (this.data[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (this.data[j-2])[this.charts[i].key];
							}
							let curValue = (this.data[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < this.data.length-1){
								nextValue = (this.data[j+1])[this.charts[i].key];
							}
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(this.charts[i].axesIndex, bfValue);
								posYBf = (this.charts[i].height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(this.charts[i].axesIndex, bfBfValue);
								posYBfBf = (this.charts[i].height - hBfBf);
							}
							if(j < this.data.length -1){
								hAf = this.getAxesHeight(this.charts[i].axesIndex, nextValue);
								posYAf = (this.charts[i].height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						
						if(j == 0){
							d = 'M' + this.columns[j].center + ' ' + (this.charts[i].height - h) + ' ';
						} else {
							d = d + 'L' + this.columns[j].center  + ' ' + (this.charts[i].height - h) + ' ';
						}
					}	


					lineElement.setAttribute('d', d);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					this.chartAreaElements[i].append(lineElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
							this.charts[i].fontSize = 14;
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
				if(this.axes[this.charts[i].axesIndex].min < 0){
					let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					d = d + 'L' + this.columns[this.columns.length-1].center + ' ' + (this.charts[i].height  + (-1 * zeroH)) + ' ' + 
							'L' + this.columns[0].center + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z'; 
				} else {
					d = d + 'L' + this.columns[this.columns.length-1].center + ' ' + this.columns[j].height + ' ' + 
							'L' + this.columns[0].center + ' ' + this.columns[j].height + 'Z'; 
				}
				lineElement.setAttribute('d', d);
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} else if(this.charts[i].type == 'scatter'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill)
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;
				let interval = this.charts[i].width/ this.data.length;
				if(this.charts[i].stroke == undefined){
					this.charts[i].stroke = this.getColors(i);
				}
				if(this.charts[i].fill == undefined){
					this.charts[i].fill = this.getColors(i);
				}
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 
					let dotElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					dotElement.setAttribute('cx', this.columns[j].center);
					dotElement.setAttribute('cy', this.charts[i].height -h);
					dotElement.setAttribute('r', 3);
					dotElement.setAttribute('fill', this.charts[i].fill) 
					dotElement.setAttribute('stroke', this.charts[i].stroke) 
					dotElement.setAttribute('opacity', this.charts[i].opacity) 
					dotElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
			
					this.chartAreaElements[i].append(dotElement);
					
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 10;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
							this.charts[i].fontSize = 14;
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					
				}
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} else if(this.charts[i].type == 'bubble'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill) 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;
				let radiusMin = 0;
				let radiusMax = 0;
				for(let j=0; j < this.data.length; j++){
					let r = (this.data[j])[this.charts[i].sizeKey];
					if(j==0){
						radiusMin = r;
						radiusMax = r;
					} else {
						if(r < radiusMin){
							radiusMin = r;
						}
						if(r > radiusMax){
							radiusMax = r;
						}
					}
				}
				let rangeTemp = (radiusMax - radiusMin) ;


				if(this.charts[i].minSize == undefined){
					this.charts[i].minSize = 1;
				}
				if(this.charts[i].maxSize == undefined){
					this.charts[i].maxSize = 10;
				}
				// console.log('minSize', this.charts[i].minSize);
				// console.log('maxSize', this.charts[i].maxSize);
				// console.log('radiusMax', radiusMax, radiusMin);

				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let r = (this.data[j])[this.charts[i].sizeKey];
					let sizeR = r / rangeTemp * (this.charts[i].maxSize - this.charts[i].minSize);
					// console.log(r , rangeTemp , (this.charts[i].maxSize - this.charts[i].minSize));
					// console.log('sizeR---------------->', sizeR);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 
					let dotElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					dotElement.setAttribute('cx', this.columns[j].center);
					dotElement.setAttribute('cy', this.charts[i].height -h);
					dotElement.setAttribute('r', sizeR);
					dotElement.setAttribute('fill', this.charts[i].fill) 
					dotElement.setAttribute('stroke', this.charts[i].stroke) 
					dotElement.setAttribute('opacity', this.charts[i].opacity) 
					dotElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
			
					this.chartAreaElements[i].append(dotElement);
					
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
							this.charts[i].textFill = 'var(--colorStroke)';
							this.charts[i].textStroke = 'var(--colorBackground)';
						}
						if(this.charts[i].textPosition == 'in'){
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							
						} else if(this.charts[i].textPosition == 'up'){
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval - sizeR) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						
						} else if(this.charts[i].textPosition == 'bottom'){
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval + sizeR) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						
						} else {
							//if(this.charts[i].textFill == undefined){
						//		this.charts[i].textFill = '#000';
						//	}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h));
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						
						}
						this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						//this.charts[i].chartTextElement[j].setAttribute('stroke', this.charts[i].textStroke);
						this.charts[i].chartTextElement[j].setAttribute('font-weight', 'bold');
						this.charts[i].chartTextElement[j].setAttribute('stroke-width', 0.3);
						
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					
				}
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} 							 	
			//this.svgElement.appendChild(this.chartAreaElements[i]);	
		}
	}
	setData(data){
		this.data = data;
		this.draw();
	}
	drawData(){
		let list = this.data;
		let interval = this.chartArea.width/ list.length;
		// console.log('interval', interval);
		this.charts = this.option.charts;
		let isBar = false;
		for(let i=0; i < this.option.charts.length; i++){
			if(this.charts[i].type == 'bar'){	// bar와  line이 같이 존재한다면 바 중심으로 세로축을 잡는다.
				isBar = true;
			}
			if(this.charts[i].fill == undefined){
				this.charts[i].fill = '#515EAC';
			}
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
		}
		
		for(let i=0; i < this.charts.length; i++){
			if(this.charts[i].type == 'bar'){
				this.charts[i].barTextEl = [];
				if(this.charts[i].followPosition == undefined || this.charts[i].followPosition == null){
					this.charts[i].followPosition = 'left';					
				}
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.15) ;
					let w = interval * 0.7;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					let bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
					if(this.axes[i].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].followIndex, 0);
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 

					} else {
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 						
					}
					this.svgElement.append(bar);
				

					// console.log('bar',bar);

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						//if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
						//	this.charts[i].fontSize = 14;
						//}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							if(this.axes[selectedBottomIndex].labelEl == undefined){
								this.axes[selectedBottomIndex].labelEl = [];
							}
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							//if(this.axes[selectedBottomIndex].fontSize == undefined || this.axes[selectedBottomIndex].fontSize == null){
							//	this.axes[selectedBottomIndex].fontSize = 14;
							//}
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
		
						}
					}
					
				}
			} else if(this.charts[i].type == 'line'){
				debugger;
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', 'transparent') 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let posXBf = null;
				let posYBf = null;
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						//if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
						//	this.charts[i].fontSize = 14;
						//}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					
					if(i==0){
						debugger;
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', 'var(--colorStroke)');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							if(this.axes[selectedBottomIndex].fontSize == undefined || this.axes[selectedBottomIndex].fontSize == null){
								this.axes[selectedBottomIndex].fontSize = 14;
							}
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
							
						}
					}
					
				}
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'area'){
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', this.charts[i].fill) 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('opacity', this.charts[i].opacity) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;				
				for(let j=0; j < list.length; j++){
					
					let value= (list[j])[this.charts[i].key];

					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value);
					let h = this.getAxesHeight(i, value);



					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {					
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}
					if(j == list.length -1){
						lastPosX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
						lastPosY = (this.area.marginTop + this.chartArea.height - h)
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
							this.charts[i].fontSize = 14;
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							if(this.axes[selectedBottomIndex].labelFill == undefined || this.axes[selectedBottomIndex].labelFill == null){
								this.axes[selectedBottomIndex].labelFill = 'var(--colorStroke)';
							}
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', this.axes[selectedBottomIndex].labelFill);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);							
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');

							if(this.axes[selectedBottomIndex].fontSize == undefined || this.axes[selectedBottomIndex].fontSize == null){
								this.axes[selectedBottomIndex].fontSize = 14;
							}
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
				d = d + 'L' + (lastPosX) + ' ' + (this.chartArea.bottom) + ' ' + 
						'L' + (this.area.marginLeft + this.axes[i].width + interval * 0.8/ 2 + (interval * 0.1) ) +  ' ' + (this.chartArea.bottom) + 'Z ' ;
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'bubble'){
				this.charts[i].barTextEl = [];
				this.charts[i].barTextBackEl = [];
				// console.log(list);
				
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;		
				this.chartEl =[];
				for(let j=0; j < list.length; j++){
					

					// console.log('>>>', j, this.charts[i].radius)
					let value= (list[j])[this.charts[i].key];
					let radius= (list[j])[this.charts[i].radius];



					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value, 'radius', radius);
					let h = this.getAxesHeight(i, value);

					let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
					let posY = (this.area.marginTop + this.chartArea.height - h) ;
					this.chartEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					this.chartEl[j].setAttribute('cx', posX);
					this.chartEl[j].setAttribute('cy', posY);
					this.chartEl[j].setAttribute('r', radius);
					this.chartEl[j].setAttribute('fill', this.charts[i].fill) 
					this.chartEl[j].setAttribute('stroke', this.charts[i].stroke) 
					this.chartEl[j].setAttribute('opacity', this.charts[i].opacity) 
					this.chartEl[j].setAttribute('stroke-width', this.charts[i].strokeWidth) 
					this.svgElement.append(this.chartEl[j]);
	
					

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){

						this.charts[i].barTextBackEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextBackEl[j].setAttribute('x', labelX);
						this.charts[i].barTextBackEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
							this.charts[i].textFill = 'var(--colorStroke)';
						}
						if(this.charts[i].textStroke == undefined || this.charts[i].textStroke == null){
							this.charts[i].textStroke = 'var(--colorBackground)';
						}
						if(this.charts[i].textStrokeWidth == undefined || this.charts[i].textStrokeWidth == null){
							this.charts[i].textStrokeWidth = '4';
						}
						this.charts[i].barTextBackEl[j].setAttribute('stroke-width', this.charts[i].textStrokeWidth);
						this.charts[i].barTextBackEl[j].setAttribute('fill', this.charts[i].textFill);
						this.charts[i].barTextBackEl[j].setAttribute('stroke', this.charts[i].textStroke);
						if(this.charts[i].textPosition == 'in'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'hanging');
						} else if(this.charts[i].textPosition == 'out'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'base-line');
						} else {
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'middle');
						}
						if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
							this.charts[i].fontSize = 14;
						}
						this.charts[i].barTextBackEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextBackEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextBackEl[j])
					}


					this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.charts[i].barTextEl[j].setAttribute('x', labelX);
					this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
					if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
						this.charts[i].textFill = 'var(--colorStroke)';
					}
					if(this.charts[i].textStroke == undefined || this.charts[i].textStroke == null){
						this.charts[i].textStroke = 'var(--colorBackground)';
					}
					//if(this.charts[i].textStrokeWidth == undefined){
					//	this.charts[i].textStrokeWidth = '2';
					//}
					this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
					this.charts[i].barTextEl[j].setAttribute('stroke-width', '0');
					// console.log('1j', i, j);
					if(this.charts[i].textPosition == 'in'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
					} else if(this.charts[i].textPosition == 'out'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
					} else {
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'middle');
					}
					if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
						this.charts[i].fontSize = 14;
					}
					this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
					this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
					this.svgElement.append(this.charts[i].barTextEl[j])
					
					// console.log('2j', i, j);
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							// console.log('3j', i, j);
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axesFontSize);
							if(this.axes[selectedBottomIndex].fontSize == undefined || this.axes[selectedBottomIndex].fontSize == null){
								this.axes[selectedBottomIndex].fontSize = 14;
							}
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
			}
				
			
		
			let selectedBottomIndex = -1;
			for(let i=0; i < this.axes.length;i++){
				if(this.axes[i].position == 'bottom'){
					selectedBottomIndex = i;
					break;
				}
			}
			if(selectedBottomIndex != -1){
				if(this.axes[selectedBottomIndex].labelTitle !== undefined){
					if(this.axes[selectedBottomIndex].labelFill == undefined && this.axes[selectedBottomIndex].labelFill == null){
						this.axes[selectedBottomIndex].labelFill = 'var(--colorSTroke)'
					}
					if(this.axes[selectedBottomIndex].labelTitleX == undefined ){
						this.axes[selectedBottomIndex].labelTitleX = this.chartArea.left + this.chartArea.width/2;
					}
					if(this.axes[selectedBottomIndex].labelTitleY == undefined ){
						this.axes[selectedBottomIndex].labelTitleY = this.chartArea.bottom + this.axes[selectedBottomIndex].labelMargin + 17; // 기준점을 만들자.
					}
					// console.log('LLLLL', selectedBottomIndex, this.axes);
					this.axes[selectedBottomIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[selectedBottomIndex].labelTitleEl.textContent = this.axes[selectedBottomIndex].labelTitle;
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('fill', this.axes[selectedBottomIndex].labelFill);
					
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('x',this.axes[selectedBottomIndex].labelTitleX)
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('y',this.axes[selectedBottomIndex].labelTitleY)
					if(this.axes[selectedBottomIndex].titleFontSize == undefined){
						this.axes[selectedBottomIndex].titleFontSize  = 14
					}
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('font-size',this.axes[selectedBottomIndex].titleFontSize)
					
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('text-anchor', 'middle');
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('alignment-baseline', 'hanging');
					this.svgElement.append(this.axes[selectedBottomIndex].labelTitleEl )
				}
			}
		}
		
	}

}
Va.registerComponent('verticalChart', Va.VerticalChart);


// Horizontal Chart
Va.HorizontalChart = class extends Va.AxisChart {
    constructor( option){
        super(option);
		this.tagName = 'horizontalChart';
		this.elements = ['element'];
		if(this.option.data != undefined){
			this.setData(this.option.data);
		}
		if(this.equalClass(Va.HorizontalChart)){
			this.update();
		}		
    }
	update(){
		if(this.equalClass(Va.HorizontalChart)){
			this.updateStyles();
		}		
	}
	mounted(){

	}
	draw(){
		if(this.data == null){
			this.element.innerHTML = 'chart area';
		}

		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.element.append(this.svgElement);
		if(this.option.title != undefined){
			this.title = this.option.title
		} 
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.area.border == undefined){
			this.area.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.area.margin = 20
		} 
		if(this.area.marginTop == undefined){
			this.area.marginTop = 20
		}
		if(this.area.marginBottom == undefined){
			this.area.marginBottom = 20
		} 
		if(this.area.marginLeft == undefined){
			this.area.marginLeft = 20
		}
		if(this.area.marginRight == undefined){
			this.area.marginRight = 20
		} 		
		if(this.option.axes == undefined){
			this.axes =[{
				position:'left'
			}]
		} else {
			this.axes = this.option.axes;
		}
		if(this.option.legends == undefined){
			this.legends =[];
		} else {
			this.legends = this.option.legends;
		}
		
		if(this.title == undefined){
			this.titleIndex = -1;
		}

		let leftAxesCount = 0;		
		let rightAxesCount = 0;
		let bottomAxesCount = 0;
		let topAxesCount = 0;
		this.leftAxesIndex =-1;
		this.rightAxesIndex =-1;
		this.bottomAxesIndex =-1;
		this.topAxesIndex = -1;
		// console.log(this.axes);

		for(let i=0; i < this.axes.length; i++){
			if( this.axes[i].position == undefined || this.axes[i].position == 'left'){
				leftAxesCount++;
				this.leftAxesIndex = i;
			}
			if(this.axes[i].position == 'right'){
				rightAxesCount++;
				this.rightAxesIndex =i;
			}
			if(this.axes[i].position == 'bottom'){
				bottomAxesCount++;
				this.bottomAxesIndex =i;
			}
			if(this.axes[i].position == 'top'){
				topAxesCount++;
				this.topAxesIndex =i;
			}
			if(this.axes[i].fontSize == undefined || this.axes[i].fontSize == null){
				this.axes[i].fontSize = 14;
			}
		}
		if(leftAxesCount >1){
			alert('차트의 left 축은 한개만 설정할 수 있습니다.')
		}
		if(rightAxesCount >1){
			alert('차트의 right 축은 한개만 설정할 수 있습니다.')
		}
		if(bottomAxesCount >1){
			alert('차트의 bottom 축은 한개만 설정할 수 있습니다.')
		}
		if(topAxesCount >1){
			alert('차트의 top 축은 한개만 설정할 수 있습니다.')
		}		
		let leftLegendCount = 0;		
		let rightLegendCount = 0;
		let bottomLegendCount = 0;
		let topLegendCount = 0;
		this.leftLegendIndex =-1;
		this.rightLegendIndex =-1;
		this.bottomLegendIndex =-1;
		this.topLegendIndex = -1;
		for(let i=0; i < this.legends.length; i++){
			if(this.legends[i].position == 'left'){
				leftLegendCount++;
				this.leftLegendIndex =i;
			}
			if(this.legends[i].position == 'right'){
				rightLegendCount++;
				this.rightLegendIndex =i;
			}
			if(this.legends[i].position == 'bottom'){
				bottomLegendCount++;
				this.bottomLegendIndex =i;
			}
			if(this.legends[i].position == 'top'){
				topLegendCount++;
				this.topLegendIndex =i;
			}
			if(this.legends[i].fontSize == undefined || this.legends[i].fontSize == null){
				this.legends[i].fontSize = 14;
			}
		}

		if(leftLegendCount >1){
			alert('차트의 left Legend는 한개만 설정할 수 있습니다.')
		}
		if(rightLegendCount >1){
			alert('차트의 right Legend는 한개만 설정할 수 있습니다.')
		}
		if(bottomLegendCount >1){
			alert('차트의 bottom Legend는 한개만 설정할 수 있습니다.')
		}
		if(topLegendCount >1){
			alert('차트의 top Legend는 한개만 설정할 수 있습니다.')
		}

		// 크기계산때문에 모든 legend와 axes 크기는 미리 계산해 놓아야 한다. 
		if(this.leftLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
		}
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
		}

		if(this.leftAxesIndex != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}
		}
		if(this.rightAxesIndex != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}
		}
		if(this.topAxesIndex != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}
		}
		if(this.bottomAxesIndex != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}
		}
		this.titleArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.bottomLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.leftLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.rightLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.leftAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.rightAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.bottomAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		// title
		if(this.title != undefined){
			this.titleArea.setAttribute('x', 0)
			this.titleArea.setAttribute('y', 0)
			this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.titleElement.textContent = this.title.text;
			if(this.title.height == undefined){
				this.title.height = 30;
			}
			if(this.title.fontSize == undefined){
				this.title.fontSize = 20
			}
			this.titleArea.setAttribute('height', this.title.height)
			this.titleArea.appendChild(this.titleElement);
			this.titleElement.width = this.svgElement.offsetWidth;
			this.titleElement.setAttribute('x', this.element.offsetWidth/2);
			this.titleElement.setAttribute('y', this.title.height/2);
			this.titleElement.setAttribute('text-anchor', 'middle');
			this.titleElement.setAttribute('alignment-baseline', 'middle');
			this.titleElement.setAttribute('font-size', this.title.fontSize);
			if(this.title.storke == undefined){
				this.titleElement.setAttribute('stroke', this.title.stroke);
			}
			if(this.title.fill == undefined){
				this.titleElement.setAttribute('fill', this.title.stroke);
			}
			this.svgElement.append(this.titleArea);				
		}
		// top Legend
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
			this.topLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.topLegendIndex].height);
			if(this.title == undefined){
				this.topLegendArea.setAttribute('y', this.area.marginTop );
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			} else {
				this.topLegendArea.setAttribute('y', this.area.marginTop + this.title.height);
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			}
			
			this.topLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.topLegendIndex].key;
			let display = this.legends[this.topLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%';//this.topLegendArea.offsetWidth;
			area.style.height = '100%';//this.topLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center; margin-left:3px')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.topLegendIndex].display[i];
				let fontSize = this.legends[this.topLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.topLegendArea.append(area);
			this.svgElement.appendChild(this.topLegendArea);
		}		
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
			this.bottomLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('y', this.element.offsetHeight - this.area.marginBottom - this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('width', this.element.offsetWidth)
			this.bottomLegendArea.setAttribute('height', this.legends[this.bottomLegendIndex].height);

			let key = this.legends[this.bottomLegendIndex].key;
			let display = this.legends[this.bottomLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.bottomLegendArea.offsetWidth;
			area.style.height = '100%'; //this.bottomLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.bottomLegendIndex].display[i];
				let fontSize = this.legends[this.bottomLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.bottomLegendArea.append(area);
			this.svgElement.appendChild(this.bottomLegendArea);
		}
		// left Legend
		if(this.leftLegendIndex != -1){
			if(this.legends[this.leftLegendIndex].width == undefined){
				this.legends[this.leftLegendIndex].width = 100;
			}
			this.leftLegendArea.setAttribute('x', this.area.marginLeft);
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;
			let width = this.legends[this.leftLegendIndex].width

			this.leftLegendArea.setAttribute('y', topPos);
			this.leftLegendArea.setAttribute('height', height);
			this.leftLegendArea.setAttribute('width', width);
			
			//this.leftLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.leftLegendIndex].key;
			let display = this.legends[this.leftLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%';//this.leftLegendArea.offsetWidth;
			area.style.height = '100%'; //this.leftLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:96%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.leftLegendIndex].display[i];
				let fontSize = this.legends[this.leftLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.leftLegendArea.append(area);
			this.svgElement.appendChild(this.leftLegendArea);
		}	
		// right Legend
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;

			let height = bottomPos - topPos;
			let width = this.legends[this.rightLegendIndex].width

			this.rightLegendArea.setAttribute('y', topPos);
			this.rightLegendArea.setAttribute('x', leftPos);

			this.rightLegendArea.setAttribute('height', height + 'px');
			this.rightLegendArea.setAttribute('width', width + 'px');
			
			//this.rightLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.rightLegendIndex].key;
			let display = this.legends[this.rightLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.rightLegendArea.offsetWidth + 'px';
			area.style.height = '100%'; //this.rightLegendArea.offsetHeight + 'px';
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:96%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.rightLegendIndex].display[i];
				let fontSize = this.legends[this.rightLegendIndex].fontSize;
				if(fontSize == undefined || fontSize == null){
					fontSize = '14px';					
				}
				if(typeof fontSize == 'number'){
					fontSize = fontSize + 'px';
				}
				div.style.fontSize = fontSize;
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.rightLegendArea.append(area);
			this.svgElement.appendChild(this.rightLegendArea);
		}	
		// Left축
		if(this.leftAxesIndex  != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}			
			let leftPos = this.area.marginLeft;
			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			this.axes[this.leftAxesIndex].height = height;
			let dataLength = this.data.length;
			let rowHeight = this.axes[this.leftAxesIndex].height / dataLength;
			this.axes[this.leftAxesIndex].axesRows = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.leftAxesIndex].axesRows[i] ={
					center: i * rowHeight  + rowHeight/2,				
					bottom: i * rowHeight,
					top: (i+1) * rowHeight,
					bottomInner: i * rowHeight + (rowHeight * 0.2),
					topInner: (i+1) * rowHeight - (rowHeight * 0.2),
				}
			}
			// console.log('this.axes[this.leftAxesIndex].axesRows', this.axes[this.leftAxesIndex].axesRows);


			let width = this.axes[this.leftAxesIndex].width;
			this.axes[this.leftAxesIndex].top = topPos;
			this.axes[this.leftAxesIndex].left = leftPos;
			this.axes[this.leftAxesIndex].height = height;
			this.axes[this.leftAxesIndex].width = width;

			this.leftAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.leftAxesArea);
			// 세로눈금을 그린다.----------------------------------
			/*
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.leftAxesIndex].key, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.leftAxesIndex].min = minMaxInfo.min;
			this.axes[this.leftAxesIndex].max = minMaxInfo.max;
			*/
			if(this.axes[this.leftAxesIndex].stroke == undefined){
				this.axes[this.leftAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.leftAxesIndex].labelStroke == undefined){
				this.axes[this.leftAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.leftAxesIndex].labelInterval == undefined){
				this.axes[this.leftAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.leftAxesIndex].labelMargin == undefined){
				this.axes[this.leftAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.leftAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.leftAxesIndex].grid = true;		
			}

			if(this.axes[this.leftAxesIndex].labelEl == undefined){
				this.axes[this.leftAxesIndex].labelEl = [];
			}
			
			let rowGap = Math.floor(100/rowHeight)
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.leftAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.leftAxesIndex].axesRows[j].center);
				// console.log(j, this.axes[this.leftAxesIndex].axesRows);
				//debugger;
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('y', this.axes[this.leftAxesIndex].axesRows[j].center);
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('x', this.axes[this.leftAxesIndex].width-this.axes[this.leftAxesIndex].labelMargin );
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke );
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
				this.axes[this.leftAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
				this.axes[this.leftAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.leftAxesIndex].key];

				// console.log('>>>>>>>>>', j, this.axes[this.leftAxesIndex].labelEl[j])

				this.leftAxesArea.appendChild(this.axes[this.leftAxesIndex].labelEl[j])	

				//let rect = this.axes[this.leftAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				/*
				if(j % rowGap != 0){
					this.axes[this.leftAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.leftAxesIndex].labelEl[j].style.visibility = 'visible';
				}
				*/
			}				

			// left축 타이틀
			this.axes[this.leftAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('x', 10); //this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.leftAxesIndex].top - this.axes[this.leftAxesIndex].fontSize - 10);
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke );
			//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'middle');
			this.axes[this.leftAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
			this.axes[this.leftAxesIndex].labelTitleEl.textContent = this.axes[this.leftAxesIndex].labelTitle;
			this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelTitleEl);

			

			/*
			if(this.axes[this.leftAxesIndex].labelInterval == 'auto'){
				//// console.log('>>', this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				this.axes[this.leftAxesIndex].labelInfo = labelInfo;
				this.axes[this.leftAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.leftAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('x', this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.leftAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelEl[j])
				}
			}
			*/
			this.leftAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.leftAxesLineElement.setAttribute('d',  'M' + this.axes[this.leftAxesIndex].width + ' ' + 0 + 
										' L' + this.axes[this.leftAxesIndex].width + ' ' + this.axes[this.leftAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.leftAxesLineElement.setAttribute('stroke', this.axes[this.leftAxesIndex].stroke);
			this.leftAxesLineElement.setAttribute('fill', 'transparent');
			this.leftAxesArea.append(this.leftAxesLineElement);				

		}
		// Right Axes
		if(this.rightAxesIndex  != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}			
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.axes[this.rightAxesIndex].width;
			if(this.rightLegendIndex != -1){
				leftPos -= this.legends[this.rightLegendIndex].width 
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let dataLength = this.data.length;
			this.axes[this.rightAxesIndex].height = height;
			let rowHeight = this.axes[this.rightAxesIndex].height / dataLength;
			this.axes[this.rightAxesIndex].axesRows = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.rightAxesIndex].axesRows[i] ={
					center: i * rowHeight  + rowHeight/2,				
					bottom: i * rowHeight,
					top: (i+1) * rowHeight,
					bottomInner: i * rowHeight + (rowHeight * 0.2),
					topInner: (i+1) * rowHeight - (rowHeight * 0.2),
				}
			}
			let width = this.axes[this.rightAxesIndex].width;
			this.axes[this.rightAxesIndex].top = topPos;
			this.axes[this.rightAxesIndex].left = leftPos;
			this.axes[this.rightAxesIndex].height = height;
			this.axes[this.rightAxesIndex].width = width;

			this.rightAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.rightAxesArea);
			/*
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.rightAxesIndex].key, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.rightAxesIndex].min = minMaxInfo.min;
			this.axes[this.rightAxesIndex].max = minMaxInfo.max;
			*/

			//// console.log('max', this.axes[this.rightAxesIndex].max);
			//// console.log('data', this.data);
			if(this.axes[this.rightAxesIndex].stroke == undefined){
				this.axes[this.rightAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.rightAxesIndex].labelStroke == undefined){
				this.axes[this.rightAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.rightAxesIndex].labelInterval == undefined){
				this.axes[this.rightAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.rightAxesIndex].labelMargin == undefined){
				this.axes[this.rightAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.rightAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.rightAxesIndex].grid = true;		
			}

			if(this.axes[this.rightAxesIndex].labelEl == undefined){
				this.axes[this.rightAxesIndex].labelEl = [];
			}
			
			let rowGap = Math.floor(100/rowHeight)
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.rightAxesIndex].axesRows[j].center);
				// console.log(j, this.axes[this.rightAxesIndex].axesRows);
				//debugger;
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].axesRows[j].center);
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].width-this.axes[this.rightAxesIndex].labelMargin );
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke );
				 
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
				this.axes[this.rightAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.rightAxesIndex].key];
				this.rightAxesArea.appendChild(this.axes[this.rightAxesIndex].labelEl[j])	

				//let rect = this.axes[this.rightAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % rowGap != 0){
					this.axes[this.rightAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.rightAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			// right축 타이틀
			this.axes[this.rightAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.rightAxesIndex].width -10);
			if(this.topAxesIndex != -1){
				console.log( this.axes[this.topAxesIndex]);
				//debugger;
				this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.rightAxesIndex].top - this.axes[this.rightAxesIndex].fontSize - 10 - this.axes[this.topAxesIndex].height);
			} else if(this.bottomAxesIndex != -1){
				this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.rightAxesIndex].top - this.axes[this.rightAxesIndex].fontSize - 10 );
			}			
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke );
			//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'middle');
			this.axes[this.rightAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
			this.axes[this.rightAxesIndex].labelTitleEl.textContent = this.axes[this.rightAxesIndex].labelTitle;
			this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelTitleEl);

			/*
			if(this.axes[this.rightAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				this.axes[this.rightAxesIndex].labelInfo = labelInfo;
				this.axes[this.rightAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].labelMargin);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'start');
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.rightAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelEl[j])
				}
			}
			*/
			this.rightAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.rightAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + 0 + ' ' + this.axes[this.rightAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.rightAxesLineElement.setAttribute('stroke', this.axes[this.rightAxesIndex].stroke);
			this.rightAxesLineElement.setAttribute('fill', 'transparent');
			this.rightAxesArea.append(this.rightAxesLineElement);		
		}
	
		let dataLength = this.data.length;

		if(this.bottomAxesIndex  != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.element.offsetHeight - this.area.marginBottom;
			
			if(this.bottomLegendIndex != -1){
				topPos -= this.legends[this.bottomLegendIndex].height;
			}
			
			if(this.bottomAxesIndex !=-1){
				topPos -= this.axes[this.bottomAxesIndex].height;
			}
			

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.bottomAxesIndex].top = topPos;
			this.axes[this.bottomAxesIndex].left = leftPos;
			this.axes[this.bottomAxesIndex].height = height;
			this.axes[this.bottomAxesIndex].width = width;

			/*
			let columnWidth = this.axes[this.bottomAxesIndex].width / dataLength;
			this.axes[this.bottomAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.bottomAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}
			*/

			this.bottomAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.bottomAxesArea);
			// 가로 눈금을 그린다.----------------------------------
			// 추가
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.bottomAxesIndex]);// this.axes[this.bottomAxesIndex].key, this.axes[this.bottomAxesIndex].min, this.axes[this.bottomAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.bottomAxesIndex].min = minMaxInfo.min;
			this.axes[this.bottomAxesIndex].max = minMaxInfo.max;


			// console.log('data', this.data);
			if(this.axes[this.bottomAxesIndex].stroke == undefined){
				this.axes[this.bottomAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.bottomAxesIndex].labelStroke == undefined){
				this.axes[this.bottomAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.bottomAxesIndex].labelInterval == undefined){
				this.axes[this.bottomAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.bottomAxesIndex].labelMargin == undefined){
				this.axes[this.bottomAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.bottomAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.bottomAxesIndex].grid = true;		
			}

			if(this.axes[this.bottomAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.bottomAxesIndex].height, this.axes[this.bottomAxesIndex].min, this.axes[this.bottomAxesIndex].max);

				let labelInfo = this.getHorizontalLabelUnit(this.axes[this.bottomAxesIndex].width, this.axes[this.bottomAxesIndex].min, this.axes[this.bottomAxesIndex].max);

				// console.log('labelInfo', labelInfo);
				this.axes[this.bottomAxesIndex].labelInfo = labelInfo;
				this.axes[this.bottomAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].x', labelInfo.label[j].x)
					this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', labelInfo.label[j].x);
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);
					 
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
					this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize);
					this.axes[this.bottomAxesIndex].labelEl[j].textContent = Va.Util.getFixedNumber(labelInfo.label[j].value);
					this.bottomAxesArea.append(this.axes[this.bottomAxesIndex].labelEl[j])
				}
			}
			// bottom축 타이틀
			this.axes[this.bottomAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('y', this.axes[this.bottomAxesIndex].height);
			if(this.leftAxesIndex != -1 && this.rightAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.bottomAxesIndex].width/2 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'center'); //'end');
			} else if(this.leftAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.bottomAxesIndex].width - 10 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			} else if(this.rightAxesIndex != -1){
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('x', 10 );
				this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			}
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'baseline');
			this.axes[this.bottomAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize);
			this.axes[this.bottomAxesIndex].labelTitleEl.textContent = this.axes[this.bottomAxesIndex].labelTitle;
			this.bottomAxesArea.append(this.axes[this.bottomAxesIndex].labelTitleEl);

			/*
			if(this.axes[this.bottomAxesIndex].labelEl == undefined){
				this.axes[this.bottomAxesIndex].labelEl = [];
			}
			
			let columnGap = Math.floor(100/columnWidth)
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.bottomAxesIndex].axesColumns[j].center);
				// console.log(j, this.axes[this.bottomAxesIndex].axesColumns);
				//debugger;
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', this.axes[this.bottomAxesIndex].axesColumns[j].center);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin );
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
				this.axes[this.bottomAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.bottomAxesIndex].key];
				this.bottomAxesArea.appendChild(this.axes[this.bottomAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			*/
			this.bottomAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.bottomAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + this.axes[this.bottomAxesIndex].width + ' ' + 0 );
			this.bottomAxesLineElement.setAttribute('stroke', this.axes[this.bottomAxesIndex].stroke);
			this.bottomAxesLineElement.setAttribute('fill', 'transparent');
			this.bottomAxesArea.append(this.bottomAxesLineElement);		
		}	

		// TopAxes
		if(this.topAxesIndex  != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}

			let bottomPos = topPos + this.axes[this.topAxesIndex].height;
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.topAxesIndex].top = topPos;
			this.axes[this.topAxesIndex].left = leftPos;
			this.axes[this.topAxesIndex].height = height;
			this.axes[this.topAxesIndex].width = width;

			let columnWidth = this.axes[this.topAxesIndex].width / dataLength;
			//this.axesColumns = [];
			this.axes[this.topAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.topAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}

			this.topAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.topAxesArea);
			// 가로 눈금을 그린다.----------------------------------
			// 추가
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.topAxesIndex]); //this.axes[this.topAxesIndex].key, this.axes[this.topAxesIndex].min, this.axes[this.topAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.topAxesIndex].min = minMaxInfo.min;
			this.axes[this.topAxesIndex].max = minMaxInfo.max;


			// console.log('data', this.data);
			if(this.axes[this.topAxesIndex].stroke == undefined){
				this.axes[this.topAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.topAxesIndex].labelStroke == undefined){
				this.axes[this.topAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.topAxesIndex].labelInterval == undefined){
				this.axes[this.topAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.topAxesIndex].labelMargin == undefined){
				this.axes[this.topAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.topAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.topAxesIndex].grid = true;		
			}

			
			if(this.axes[this.topAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.topAxesIndex].width, this.axes[this.topAxesIndex].min, this.axes[this.topAxesIndex].max);
				let labelInfo = this.getHorizontalLabelUnit(this.axes[this.topAxesIndex].width, this.axes[this.topAxesIndex].min, this.axes[this.topAxesIndex].max);
				this.axes[this.topAxesIndex].labelInfo = labelInfo;
				this.axes[this.topAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', labelInfo.label[j].x);
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', this.axes[this.topAxesIndex].labelMargin );// + this.axes[this.leftAxesIndex].top);
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'start');
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);
					
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.topAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.topAxesIndex].fontSize);
					this.axes[this.topAxesIndex].labelEl[j].textContent = Va.Util.getFixedNumber(labelInfo.label[j].value);
					// console.log(j, '>>>11', labelInfo.label[j].value, Va.Util.getFixedNumber(labelInfo.label[j].value));
					this.rightAxesArea.append(this.axes[this.topAxesIndex].labelEl[j])
				}
			}
			// top축 타이틀
			this.axes[this.topAxesIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('y', 10);
			if(this.leftAxesIndex != -1 && this.rightAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.topAxesIndex].width/2 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'center'); //'end');
			} else if(this.leftAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', this.axes[this.topAxesIndex].width - 10 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'end'); //'end');
			} else if(this.rightAxesIndex != -1){
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('x', 10 );
				this.axes[this.topAxesIndex].labelTitleEl.setAttribute('text-anchor', 'start'); //'end');
			}
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('font-weight', 'bold');
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('alignment-baseline', 'baseline');
			this.axes[this.topAxesIndex].labelTitleEl.setAttribute('font-size', this.axes[this.topAxesIndex].fontSize);
			this.axes[this.topAxesIndex].labelTitleEl.textContent = this.axes[this.topAxesIndex].labelTitle;
			this.topAxesArea.append(this.axes[this.topAxesIndex].labelTitleEl);

			/*
			if(this.axes[this.topAxesIndex].labelEl == undefined){
				this.axes[this.topAxesIndex].labelEl = [];
			}
			let columnGap = Math.floor(100/columnWidth)

			for(let j = 0; j < this.data.length; j++){
				this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', this.axes[this.topAxesIndex].axesColumns[j].center);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', this.axes[this.topAxesIndex].height - this.axes[this.topAxesIndex].labelMargin );
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'base-line');
				this.axes[this.topAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.topAxesIndex].key];
				this.topAxesArea.appendChild(this.axes[this.topAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			*/
			this.topAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.topAxesLineElement.setAttribute('d',  'M 0 ' + this.axes[this.topAxesIndex].height + 
										' L' + this.axes[this.topAxesIndex].width + ' ' + this.axes[this.topAxesIndex].height );
			this.topAxesLineElement.setAttribute('stroke', this.axes[this.topAxesIndex].stroke);
			this.topAxesLineElement.setAttribute('fill', 'transparent');
			this.topAxesArea.append(this.topAxesLineElement);		
		}				



		// -------------- chart ---------------------------------
		this.charts = this.option.charts;
		this.chartAreaElements = [];
		this.chartLabelAreaElements = [];
		let chartAreaTop  = this.area.marginTop;
		if(this.title != undefined){
			chartAreaTop += this.title.height;
		}
		if(this.topLegendIndex != -1){
			chartAreaTop += this.legends[this.topLegendIndex].height;
		}
		if(this.topAxesIndex != -1){
			chartAreaTop += this.axes[this.topAxesIndex].height;
		}

		let chartAreaBottom  = this.element.offsetHeight - this.area.marginBottom;
		if(this.bottomLegendIndex != -1){
			chartAreaBottom -= this.legends[this.bottomLegendIndex].height;
		}
		if(this.bottomAxesIndex != -1){
			chartAreaBottom -= this.axes[this.bottomAxesIndex].height;
		}

		let chartAreaLeft  = this.area.marginLeft;
		if(this.leftLegendIndex != -1){
			chartAreaLeft += this.legends[this.leftLegendIndex].width;
		}
		if(this.leftAxesIndex != -1){
			chartAreaLeft += this.axes[this.leftAxesIndex].width;
		}

		let chartAreaRight  = this.element.offsetWidth - this.area.marginRight;
		if(this.rightLegendIndex != -1){
			chartAreaRight -= this.legends[this.rightLegendIndex].width;
		}
		if(this.rightAxesIndex != -1){
			chartAreaRight -= this.axes[this.rightAxesIndex].width;
		}


		for(let i=0; i < this.charts.length ; i++){
			this.charts[i].top = chartAreaTop;
			this.charts[i].left = chartAreaLeft;
			this.charts[i].bottom = chartAreaBottom;
			this.charts[i].right = chartAreaRight;
			this.charts[i].width = chartAreaRight - chartAreaLeft;
			this.charts[i].height = chartAreaBottom - chartAreaTop;

			if(this.charts[i].textPosition == undefined){
				this.charts[i].textPosition = 'out';
			}
			if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
				this.charts[i].fontSize = 12;
			}
			//this.charts[i].axesIndex

			if(i==0){
				let rowsHeight = this.charts[i].height / dataLength;
				this.rows = [];
				for(let j=0; j < dataLength; j++){
					this.rows[j] ={
						center: j * rowsHeight  + rowsHeight/2,				
						bottom: j * rowsHeight,
						top: (j+1) * rowsHeight,
						bottomInner: j * rowsHeight + (rowsHeight * 0.2),
						topInner: (j+1) * rowsHeight - (rowsHeight * 0.2),
					}
				}		
			}
			/*
			this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
			this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
			this.svgElement.appendChild(this.chartAreaElements[i] );
			*/
			if(i==0){
				this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
				this.svgElement.appendChild(this.chartAreaElements[i] );
			} else {
				this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
				this.svgElement.insertBefore(this.chartAreaElements[i], this.chartLabelAreaElements[0]);
			}
			this.chartLabelAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
			this.chartLabelAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
			this.svgElement.appendChild(this.chartLabelAreaElements[i] );


			if(this.charts[i].axesPosition == undefined || this.charts[i].axesPosition == null){
				
				for(let j=0; j < this.axes.length; j++){					
					if(this.axes[j].position == 'bottom'){
						this.charts[i].axesPosition = 'bottom';
						break;
					} else if(this.axes[j].position == 'top'){
						this.charts[i].axesPosition = 'top';
					}
				}
			}
			
			for(let j=0; j < this.axes.length; j++){
				// console.log('j====>', this.axes[j].position, this.charts[i].axesPosition);
				if(this.axes[j].position == this.charts[i].axesPosition){
					this.charts[i].axesIndex = j;
					break;
				}
			}			
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
			if(this.charts[i].grid == undefined){
				this.charts[i].grid = true;
			}
			if(this.charts[i].grid == true){
				// console.log(this.charts[i].axesIndex);
				// console.log(this.axes[this.charts[i].axesIndex]);
				let labelInfo = this.axes[this.charts[i].axesIndex].labelInfo;
				for(let j=0; j < labelInfo.label.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M ' + labelInfo.label[j].x + ',0 L' + ' ' + labelInfo.label[j].x + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}


			if(this.charts[i].gridColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M 0,'+ this.rows[j].center + ' ' + ' L' + this.charts[i].height + ',' + this.rows[j].center );
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}						
			if(this.charts[i].gridBoundColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M 0,'+ this.rows[j].top + ' ' + ' L' + this.charts[i].height + ',' + this.rows[j].top );
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}	

			// 여기서부터 column을 row로만 수정했음..
			if(this.charts[i].type == 'bar'){
				this.charts[i].barTextElement = [];
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					// console.log('>>', this.charts[i].axesIndex, value);
					                          //this.charts[index]
					let w = this.getAxesWidth(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroW = this.getAxesWidth(this.charts[i].axesIndex, 0);
						barElement.setAttribute('d', 'M' + ((zeroW))  + ' ' +  this.rows[j].topInner + ' ' +  
						'L' + (w) + ' ' + this.rows[j].topInner + ' '  +
						'L' + (w) + ' ' +  this.rows[j].bottomInner + ' '  +
						'L' + (zeroW) + ' ' + this.rows[j].bottomInner + ' '  + 'Z');
					} else {
						barElement.setAttribute('d', 'M'  + 0   + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w) + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w)+ ' ' + this.rows[j].bottomInner + ' ' + 
						'L' + (0) + ' ' + this.rows[j].bottomInner + 'Z');
					}
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('y', this.rows[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('x', (w - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('x', (w + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('x', (w + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');	
								} else {
									this.charts[i].chartTextElement[j].setAttribute('x', (w - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');	

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
			} else if(this.charts[i].type == 'column'){
				this.charts[i].barTextElement = [];

				// 초기화.
				let totalColumnCount = 0;
				for(let j=0; j < this.charts.length; j++){
					if(this.charts[j].type == 'column'){
						totalColumnCount++;
					}
				}
				let columnCount = 0;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'column'){
						columnCount++;
					}
				}

				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					// console.log('>>', this.charts[i].axesIndex, value);
												//this.charts[index]
					let w = this.getAxesWidth(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroW = this.getAxesWidth(this.charts[i].axesIndex, 0);
						let gap = (this.rows[j].bottomInner -this.rows[j].topInner)/totalColumnCount;
						barElement.setAttribute('d', 
						'M' + ((zeroW))  + ' ' +  (this.rows[j].topInner + gap * columnCount) + ' ' +  
						'L' + (w) + ' ' + (this.rows[j].topInner + gap * columnCount) + ' '  +
						'L' + (w) + ' ' +  (this.rows[j].topInner + gap * (columnCount+1)) + ' '  +
						'L' + (zeroW) + ' ' + (this.rows[j].topInner + gap * (columnCount+1)) + ' '  + 'Z');
					/*} else {
						barElement.setAttribute('d', 'M'  + 0   + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w) + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w)+ ' ' + this.rows[j].bottomInner + ' ' + 
						'L' + (0) + ' ' + this.rows[j].bottomInner + 'Z');
					}*/
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('y', (this.rows[j].topInner+ gap *(columnCount+1) + this.rows[j].topInner+ gap *(columnCount))/2);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('x', (w - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('x', (w + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('x', (w + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');	
								} else {
									this.charts[i].chartTextElement[j].setAttribute('x', (w - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');	

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}				
			} else if(this.charts[i].type == 'stack'){
				this.charts[i].barTextElement = [];
				// 초기화.
				let checkFirstStack = true;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'stack'){
						checkFirstStack = false;						
					}
				}				
				if(checkFirstStack == true){
					this.stackDataSize = [];
					//let initH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					for(let j=0; j < this.data.length; j++){
						this.stackDataSize[j] = 0;
					}
				}

				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key] + this.stackDataSize[j];
					// console.log('>>', this.charts[i].axesIndex, value);
					                          //this.charts[index]
					let w = this.getAxesWidth(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroW = this.getAxesWidth(this.charts[i].axesIndex, this.stackDataSize[j]);
						barElement.setAttribute('d', 
						'M' + ((zeroW))  + ' ' +  this.rows[j].topInner + ' ' +  
						'L' + (w) + ' ' + this.rows[j].topInner + ' '  +
						'L' + (w) + ' ' +  this.rows[j].bottomInner + ' '  +
						'L' + (zeroW) + ' ' + this.rows[j].bottomInner + ' '  + 'Z');
					/*
					} else {
						barElement.setAttribute('d', 
						'M'  + 0   + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w) + ' ' + this.rows[j].topInner + ' ' + 
						'L' + (w)+ ' ' + this.rows[j].bottomInner + ' ' + 
						'L' + (0) + ' ' + this.rows[j].bottomInner + 'Z');
					} */
					this.stackDataSize[j] = value;
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('y', this.rows[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('x', (w - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('x', (w + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
								this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('x', (w + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'start');	
								} else {
									this.charts[i].chartTextElement[j].setAttribute('x', (w - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'middle');
									this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'end');	

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartLabelAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
			} 							 	
			//this.svgElement.appendChild(this.chartAreaElements[i]);	
		}
	}
	setData(data){
		this.data = data;

		this.draw();
		//this.drawData();
	}
	drawData(){
		let list = this.data;
		let interval = this.chartArea.width/ list.length;
		// console.log('interval', interval);
		this.charts = this.option.charts;
		let isBar = false;
		for(let i=0; i < this.option.charts.length; i++){
			if(this.charts[i].type == 'bar'){	// bar와  line이 같이 존재한다면 바 중심으로 세로축을 잡는다.
				isBar = true;
			}
			if(this.charts[i].fill == undefined){
				this.charts[i].fill = '#515EAC';
			}
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
		}
		
		for(let i=0; i < this.charts.length; i++){
			if(this.charts[i].type == 'bar'){
				this.charts[i].barTextEl = [];
				if(this.charts[i].followPosition == undefined || this.charts[i].followPosition == null){
					this.charts[i].followPosition = 'left';					
				}
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.15) ;
					let w = interval * 0.7;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					let bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
					if(this.axes[i].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].followIndex, 0);
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 

					} else {
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 						
					}
					this.svgElement.append(bar);
				

					// console.log('bar',bar);

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = '#000';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							if(this.axes[selectedBottomIndex].labelEl == undefined){
								this.axes[selectedBottomIndex].labelEl = [];
							}
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
		
						}
					}
					
				}
			} else if(this.charts[i].type == 'line'){
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', 'transparent') 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let posXBf = null;
				let posYBf = null;
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = '#000';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
		
						}
					}
					
				}
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'area'){
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', this.charts[i].fill) 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('opacity', this.charts[i].opacity) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;				
				for(let j=0; j < list.length; j++){
					
					let value= (list[j])[this.charts[i].key];

					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value);
					let h = this.getAxesHeight(i, value);



					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {					
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}
					if(j == list.length -1){
						lastPosX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
						lastPosY = (this.area.marginTop + this.chartArea.height - h)
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = '#000';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
				d = d + 'L' + (lastPosX) + ' ' + (this.chartArea.bottom) + ' ' + 
						'L' + (this.area.marginLeft + this.axes[i].width + interval * 0.8/ 2 + (interval * 0.1) ) +  ' ' + (this.chartArea.bottom) + 'Z ' ;
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'bubble'){
				this.charts[i].barTextEl = [];
				this.charts[i].barTextBackEl = [];
				// console.log(list);
				
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;		
				this.chartEl =[];
				for(let j=0; j < list.length; j++){
					

					// console.log('>>>', j, this.charts[i].radius)
					let value= (list[j])[this.charts[i].key];
					let radius= (list[j])[this.charts[i].radius];



					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value, 'radius', radius);
					let h = this.getAxesHeight(i, value);

					let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
					let posY = (this.area.marginTop + this.chartArea.height - h) ;
					this.chartEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					this.chartEl[j].setAttribute('cx', posX);
					this.chartEl[j].setAttribute('cy', posY);
					this.chartEl[j].setAttribute('r', radius);
					this.chartEl[j].setAttribute('fill', this.charts[i].fill) 
					this.chartEl[j].setAttribute('stroke', this.charts[i].stroke) 
					this.chartEl[j].setAttribute('opacity', this.charts[i].opacity) 
					this.chartEl[j].setAttribute('stroke-width', this.charts[i].strokeWidth) 
					this.svgElement.append(this.chartEl[j]);
	
					

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){

						this.charts[i].barTextBackEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextBackEl[j].setAttribute('x', labelX);
						this.charts[i].barTextBackEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textFill == undefined){
							this.charts[i].textFill = '#888';
						}
						if(this.charts[i].textStroke == undefined){
							this.charts[i].textStroke = 'white';
						}
						if(this.charts[i].textStrokeWidth == undefined){
							this.charts[i].textStrokeWidth = '4';
						}
						this.charts[i].barTextBackEl[j].setAttribute('stroke-width', this.charts[i].textStrokeWidth);
						this.charts[i].barTextBackEl[j].setAttribute('fill', this.charts[i].textFill);
						this.charts[i].barTextBackEl[j].setAttribute('stroke', this.charts[i].textStroke);
						if(this.charts[i].textPosition == 'in'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'hanging');
						} else if(this.charts[i].textPosition == 'out'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'base-line');
						} else {
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'middle');
						}
						this.charts[i].barTextBackEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextBackEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextBackEl[j])
					}


					this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.charts[i].barTextEl[j].setAttribute('x', labelX);
					this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
					if(this.charts[i].textFill == undefined){
						this.charts[i].textFill = '#000';
					}
					if(this.charts[i].textStroke == undefined){
						this.charts[i].textStroke = 'white';
					}
					//if(this.charts[i].textStrokeWidth == undefined){
					//	this.charts[i].textStrokeWidth = '2';
					//}
					this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
					this.charts[i].barTextEl[j].setAttribute('stroke-width', '0');
					// console.log('1j', i, j);
					if(this.charts[i].textPosition == 'in'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
					} else if(this.charts[i].textPosition == 'out'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
					} else {
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'middle');
					}
					this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
					this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
					this.svgElement.append(this.charts[i].barTextEl[j])
					
					// console.log('2j', i, j);
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							// console.log('3j', i, j);
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
			}
				
			
		
			let selectedBottomIndex = -1;
			for(let i=0; i < this.axes.length;i++){
				if(this.axes[i].position == 'bottom'){
					selectedBottomIndex = i;
					break;
				}
			}
			if(selectedBottomIndex != -1){
				if(this.axes[selectedBottomIndex].labelTitle !== undefined){
					if(this.axes[selectedBottomIndex].labelTitleX == undefined ){
						this.axes[selectedBottomIndex].labelTitleX = this.chartArea.left + this.chartArea.width/2;
					}
					if(this.axes[selectedBottomIndex].labelTitleY == undefined ){
						this.axes[selectedBottomIndex].labelTitleY = this.chartArea.bottom + this.axes[selectedBottomIndex].labelMargin + 17; // 기준점을 만들자.
					}
					// console.log('LLLLL', selectedBottomIndex, this.axes);
					this.axes[selectedBottomIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[selectedBottomIndex].labelTitleEl.textContent = this.axes[selectedBottomIndex].labelTitle
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('x',this.axes[selectedBottomIndex].labelTitleX)
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('y',this.axes[selectedBottomIndex].labelTitleY)
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('font-size', this.axes[selectedBottomIndex].fontSize)					
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('text-anchor', 'middle');
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('alignment-baseline', 'hanging');
					this.svgElement.append(this.axes[selectedBottomIndex].labelTitleEl )
				}
			}
		}
		
	}
	/*
	getAxesHeight(index, val){
		//this.chartArea.height : this.axes[index].max - this.axes[index].min = reaaHeight : val
		let height = (val-this.axes[index].min) * this.axes[index].height / (this.axes[index].max - this.axes[index].min)
		// console.log('height', height, val , this.axes[index].height ,'>>>max', this.axes[index].max, this.axes[index].min);
		return height;
	}
	*/
}
Va.registerComponent('horizontalChart', Va.HorizontalChart);

/////////////////////

/*
<svg width="40" height="40" viewBox="0 0 40 40">
      <circle
        r="10"
        cx="20"
        cy="20"
        fill="transparent"
        stroke="tomato"
        stroke-width="20"
        stroke-dasharray="calc(100 * calc(2*3.14*10) / 100) calc(2*3.14*10)"
        transform="rotate(-90)  translate(-40)"
      />
      <circle
        r="10"
        cx="20"
        cy="20"
        fill="transparent"
        stroke="pink"
        stroke-width="20"
        stroke-dasharray="calc(80 * calc(2*3.14*10) / 100) calc(2*3.14*10)"
        transform="rotate(-90)  translate(-40)"
      />
      <circle
        r="10"
        cx="20"
        cy="20"
        fill="transparent"
        stroke="yellow"
        stroke-width="20"
        stroke-dasharray="calc(50 * calc(2*3.14*10) / 100) calc(2*3.14*10)"
        transform="rotate(-90)  translate(-40)"
      />
    </svg>
*/

/*
Va.VerticalChart = class extends Va.Component {
    constructor( option){
        super('div', option)
        //this.setOption(option)
        //this.createEl();
    //}
    //createEl(){
        //this.element = super.createBaseEl('div');
        // 추가적인 코드
        //// console.log('div',  this.element)
        this.containerElement = this.element; // child 위치.
*/


// Vertical Chart
Va.PieChart = class extends Va.Component {
    constructor( option){
        super('div', option);
		this.tagName = 'pieChart';
		this.elements = ['element'];
        this.containerElement = this.element; // child 위치.
		this.element.innerHTML = 'chart. blank data';
		this.colors = ['#0f6cbd', '#da3b01', '#fde300', '#00723b', '#b4d6fa' , '#0027b4', '#eaa300', '#881798', '#dc626d' , '#a7e3a5', '#881798', '#d6d6d6' ]
		var resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
			// 관찰 대상의 resize이벤트시, 처리할 로직
			// console.log('entry', entry);
			if(entry.target== this.element){
				//setTimeout(()=>{
				this.resize(entry.contentBoxSize);
				//},100)
			}
			}
		});
		if(this.option.data != undefined){
			setTimeout(()=>{
				this.setData(this.option.data);
			},300);
		}
		if(this.equalClass(Va.PieChart)){			
			this.update();
		}
		resizeObserver.observe(this.element);
    }
	update(){
		if(this.equalClass(Va.PieChart)){
			this.updateStyles();
		}
	}
	resize (contentBoxSize){
		// console.log('resize********************************************', arguments);
		if(this.data != undefined && this.data != null){
			this.draw();
			//this.drawData();
		}
	}
	mounted(){

	}
	getColors(i){
		i = i % this.colors.length;
		return this.colors[i];
	}
	draw(){
		if(this.data == null){
			this.element.innerHTML = 'chart area';
		}

		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.element.append(this.svgElement);
		if(this.option.title != undefined){
			this.title = this.option.title
		} 
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.area.border == undefined){
			this.area.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.area.margin = 20
		} 
		if(this.area.marginTop == undefined){
			this.area.marginTop = 20
		}
		if(this.area.marginBottom == undefined){
			this.area.marginBottom = 20
		} 
		if(this.area.marginLeft == undefined){
			this.area.marginLeft = 20
		}
		if(this.area.marginRight == undefined){
			this.area.marginRight = 20
		} 		
		if(this.option.axes == undefined){
			this.axes =[];
		} else {
			this.axes = this.option.axes;
		}
		if(this.option.legends == undefined){
			this.legends =[];
		} else {
			this.legends = this.option.legends;
		}
		
		if(this.title == undefined){
			this.titleIndex = -1;
		}

		let leftAxesCount = 0;		
		let rightAxesCount = 0;
		let bottomAxesCount = 0;
		let topAxesCount = 0;
		this.leftAxesIndex =-1;
		this.rightAxesIndex =-1;
		this.bottomAxesIndex =-1;
		this.topAxesIndex = -1;

		for(let i=0; i < this.axes.length; i++){
			if( this.axes[i].position == 'left'){
				leftAxesCount++;
				this.leftAxesIndex = i;
			}
			if(this.axes[i].position == 'right'){
				rightAxesCount++;
				this.rightAxesIndex =i;
			}
			if(this.axes[i].position == 'bottom'){
				bottomAxesCount++;
				this.bottomAxesIndex =i;
			}
			if(this.axes[i].position == 'top'){
				topAxesCount++;
				this.topAxesIndex =i;
			}
			if(this.axes[i].fontSize == undefined || this.axes[i].fontSize == null){
				this.axes[i].fontSize = 14;
			}
		}
		if(leftAxesCount >1){
			alert('차트의 left 축은 한개만 설정할 수 있습니다.')
		}
		if(rightAxesCount >1){
			alert('차트의 right 축은 한개만 설정할 수 있습니다.')
		}
		if(bottomAxesCount >1){
			alert('차트의 bottom 축은 한개만 설정할 수 있습니다.')
		}
		if(topAxesCount >1){
			alert('차트의 top 축은 한개만 설정할 수 있습니다.')
		}		
		let leftLegendCount = 0;		
		let rightLegendCount = 0;
		let bottomLegendCount = 0;
		let topLegendCount = 0;
		this.leftLegendIndex =-1;
		this.rightLegendIndex =-1;
		this.bottomLegendIndex =-1;
		this.topLegendIndex = -1;
		for(let i=0; i < this.legends.length; i++){
			if(this.legends[i].position == 'left'){
				leftLegendCount++;
				this.leftLegendIndex =i;
			}
			if(this.legends[i].position == 'right'){
				rightLegendCount++;
				this.rightLegendIndex =i;
			}
			if(this.legends[i].position == 'bottom'){
				bottomLegendCount++;
				this.bottomLegendIndex =i;
			}
			if(this.legends[i].position == 'top'){
				topLegendCount++;
				this.topLegendIndex =i;
			}
			if(this.legends[i].fontSize == undefined || this.legends[i].fontSize == null){
				this.legends[i].fontSize = 14;
			}

		}

		if(leftLegendCount >1){
			alert('차트의 left Legend는 한개만 설정할 수 있습니다.')
		}
		if(rightLegendCount >1){
			alert('차트의 right Legend는 한개만 설정할 수 있습니다.')
		}
		if(bottomLegendCount >1){
			alert('차트의 bottom Legend는 한개만 설정할 수 있습니다.')
		}
		if(topLegendCount >1){
			alert('차트의 top Legend는 한개만 설정할 수 있습니다.')
		}

		// 크기계산때문에 모든 legend와 axes 크기는 미리 계산해 놓아야 한다. 
		if(this.leftLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
		}
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
		}

		if(this.leftAxesIndex != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}
		}
		if(this.rightAxesIndex != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}
		}
		if(this.topAxesIndex != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}
		}
		if(this.bottomAxesIndex != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}
		}


		//// console.log('columnGap --------------------> ', columnGap);	

		this.titleArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		//this.titleArea.style.backgroundColor = 'yellow';
		this.bottomLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.leftLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.rightLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.leftAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.rightAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.bottomAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");


		// title
		if(this.title != undefined){
			this.titleArea.setAttribute('x', 0)
			this.titleArea.setAttribute('y', 0)
			this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.titleElement.textContent = this.title.text;

			if(this.title.height == undefined){
				this.title.height = 30;
			}
			if(this.title.fontSize == undefined){
				this.title.fontSize = 20
			}
			this.titleArea.setAttribute('height', this.title.height)
			this.titleArea.appendChild(this.titleElement);
			this.titleElement.width = this.svgElement.offsetWidth;
			this.titleElement.setAttribute('x', this.element.offsetWidth/2);
			this.titleElement.setAttribute('y', this.title.height/2);
			this.titleElement.setAttribute('text-anchor', 'middle');
			this.titleElement.setAttribute('alignment-baseline', 'middle');
			this.titleElement.setAttribute('font-size', this.title.fontSize);
			if(this.title.storke == undefined){
				this.title.stroke == 'var(--colorStroke)';
				this.titleElement.setAttribute('stroke', this.title.stroke);
			}
			if(this.title.fill == undefined){
				this.titleElement.setAttribute('fill', this.title.stroke);
			}
			this.svgElement.append(this.titleArea);				
		}
		// top Legend
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
			this.topLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.topLegendIndex].height);
			if(this.title == undefined){
				this.topLegendArea.setAttribute('y', this.area.marginTop );
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			} else {
				this.topLegendArea.setAttribute('y', this.area.marginTop + this.title.height);
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			}
			
			this.topLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.topLegendIndex].key;
			let display = this.legends[this.topLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%';//this.topLegendArea.offsetWidth;
			area.style.height = '100%';//this.topLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < this.data.length; i++){
				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center; margin-left:3px')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.getColors(i));
				
				let span = document.createElement('span')
				span.innerHTML = this.data[key];
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.topLegendArea.append(area);
			this.svgElement.appendChild(this.topLegendArea);
		}		
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
			this.bottomLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('y', this.element.offsetHeight - this.area.marginBottom - this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('width', this.element.offsetWidth)
			this.bottomLegendArea.setAttribute('height', this.legends[this.bottomLegendIndex].height);

			let key = this.legends[this.bottomLegendIndex].key;
			let display = this.legends[this.bottomLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.bottomLegendArea.offsetWidth;
			area.style.height = '100%'; //this.bottomLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < this.data.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;');
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.getColors(i));
				
				let span = document.createElement('span')
				span.innerHTML = (this.data[i])[key];
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.bottomLegendArea.append(area);
			this.svgElement.appendChild(this.bottomLegendArea);
		}
		// left Legend
		if(this.leftLegendIndex != -1){
			if(this.legends[this.leftLegendIndex].width == undefined){
				this.legends[this.leftLegendIndex].width = 100;
			}
			this.leftLegendArea.setAttribute('x', this.area.marginLeft);
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;
			let width = this.legends[this.leftLegendIndex].width

			this.leftLegendArea.setAttribute('y', topPos);
			this.leftLegendArea.setAttribute('height', height);
			this.leftLegendArea.setAttribute('width', width);
			
			//this.leftLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.leftLegendIndex].key;
			let display = this.legends[this.leftLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '98%';//this.leftLegendArea.offsetWidth;
			area.style.height = '98%'; //this.leftLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < this.data.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:95%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.getColors(i));
				
				let span = document.createElement('span')
				span.innerHTML = (this.data[i])[key];
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.leftLegendArea.append(area);
			this.svgElement.appendChild(this.leftLegendArea);
		}	
		// right Legend
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;

			let height = bottomPos - topPos;
			let width = this.legends[this.rightLegendIndex].width

			this.rightLegendArea.setAttribute('y', topPos);
			this.rightLegendArea.setAttribute('x', leftPos);

			this.rightLegendArea.setAttribute('height', height + 'px');
			this.rightLegendArea.setAttribute('width', width + 'px');
			
			//this.rightLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.rightLegendIndex].key;
			//let display = this.legends[this.rightLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.rightLegendArea.offsetWidth + 'px';
			area.style.height = '100%'; //this.rightLegendArea.offsetHeight + 'px';
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < this.data.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:95%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.getColors(i));
				
				let span = document.createElement('span')
				span.innerHTML = (this.data[i])[key];
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.rightLegendArea.append(area);
			this.svgElement.appendChild(this.rightLegendArea);
		}	
		// Left축
		if(this.leftAxesIndex  != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}			
			let leftPos = this.area.marginLeft;
			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.leftAxesIndex].width;
			this.axes[this.leftAxesIndex].top = topPos;
			this.axes[this.leftAxesIndex].left = leftPos;
			this.axes[this.leftAxesIndex].height = height;
			this.axes[this.leftAxesIndex].width = width;

			this.leftAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.leftAxesArea);
			// 세로눈금을 그린다.----------------------------------
			
			let minMaxInfo = this.getMinMax(this.data, this.axes[this.leftAxesIndex]);//this.axes[this.leftAxesIndex].key, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.leftAxesIndex].min = minMaxInfo.min;
			this.axes[this.leftAxesIndex].max = minMaxInfo.max;
			/*
			if(this.data == undefined || this.data == null || this.data.length ==0){
				if(this.axes[this.leftAxesIndex].max == undefined || this.axes[this.leftAxesIndex].max == null){
					this.axes[this.leftAxesIndex].max = 100;
				}
				if(this.axes[this.leftAxesIndex].min == undefined || this.axes[this.leftAxesIndex].min == null){
					this.axes[this.leftAxesIndex].max = 0;
				}
			} else {
				let max = null;
				let min = null;			
				for(let j=0; j< this.data.length; j++){
					if(j==0){
						max = (this.data[j])[this.axes[this.leftAxesIndex].key];
						min = (this.data[j])[this.axes[this.leftAxesIndex].key];
					} else{
						if(max < (this.data[j])[this.axes[this.leftAxesIndex].key]){
							max = (this.data[j])[this.axes[this.leftAxesIndex].key];
						}
						if(min > (this.data[j])[this.axes[this.leftAxesIndex].key]){
							min = (this.data[j])[this.axes[this.leftAxesIndex].key];
						}						
					}
				}
				if(this.axes[this.leftAxesIndex].max == undefined || this.axes[this.leftAxesIndex].max == null){
					this.axes[this.leftAxesIndex].max = max;
				}
				if(this.axes[this.leftAxesIndex].min == undefined || this.axes[this.leftAxesIndex].min == null){
					if(min > 0){
						this.axes[this.leftAxesIndex].min = 0;
					} else {
						this.axes[this.leftAxesIndex].min = min;
					}
				}
			}
			*/
			// console.log('max', this.axes[this.leftAxesIndex].max);
			// console.log('data', this.data);
			if(this.axes[this.leftAxesIndex].stroke == undefined){
				this.axes[this.leftAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.leftAxesIndex].labelStroke == undefined){
				this.axes[this.leftAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.leftAxesIndex].labelInterval == undefined){
				this.axes[this.leftAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.leftAxesIndex].labelMargin == undefined){
				this.axes[this.leftAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.leftAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.leftAxesIndex].grid = true;		
			}

			if(this.axes[this.leftAxesIndex].labelInterval == 'auto'){
				//// console.log('>>', this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				this.axes[this.leftAxesIndex].labelInfo = labelInfo;
				this.axes[this.leftAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.leftAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('x', this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke);
					
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
					this.axes[this.leftAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelEl[j])
				}
			}
			this.leftAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.leftAxesLineElement.setAttribute('d',  'M' + this.axes[this.leftAxesIndex].width + ' ' + 0 + 
										' L' + this.axes[this.leftAxesIndex].width + ' ' + this.axes[this.leftAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.leftAxesLineElement.setAttribute('stroke', this.axes[this.leftAxesIndex].stroke);
			this.leftAxesLineElement.setAttribute('fill', 'transparent');
			this.leftAxesArea.append(this.leftAxesLineElement);				

		}
		// Right Axes
		if(this.rightAxesIndex  != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}			
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.axes[this.rightAxesIndex].width;
			if(this.rightLegendIndex != -1){
				leftPos -= this.legends[this.rightLegendIndex].width 
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.rightAxesIndex].width;
			this.axes[this.rightAxesIndex].top = topPos;
			this.axes[this.rightAxesIndex].left = leftPos;
			this.axes[this.rightAxesIndex].height = height;
			this.axes[this.rightAxesIndex].width = width;

			this.rightAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.rightAxesArea);

			let minMaxInfo = this.getMinMax(this.data, this.axes[this.rightAxesIndex]);// this.axes[this.rightAxesIndex].key, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
			// console.log('minMaxInfo===>', minMaxInfo);
			this.axes[this.rightAxesIndex].min = minMaxInfo.min;
			this.axes[this.rightAxesIndex].max = minMaxInfo.max;
			/*
			// 세로눈금을 그린다.----------------------------------
			if(this.data == undefined || this.data == null || this.data.length ==0){
				if(this.axes[this.rightAxesIndex].max == undefined || this.axes[this.rightAxesIndex].max == null){
					this.axes[this.rightAxesIndex].max = 100;
				}
				if(this.axes[this.rightAxesIndex].min == undefined || this.axes[this.rightAxesIndex].min == null){
					this.axes[this.rightAxesIndex].max = 0;
				}
			} else {
				let max = null;
				let min = null;			
				for(let j=0; j< this.data.length; j++){
					if(j==0){
						max = (this.data[j])[this.axes[this.rightAxesIndex].key];
						min = (this.data[j])[this.axes[this.rightAxesIndex].key];
					} else{
						if(max < (this.data[j])[this.axes[this.rightAxesIndex].key]){
							max = (this.data[j])[this.axes[this.rightAxesIndex].key];
						}
						if(min > (this.data[j])[this.axes[this.rightAxesIndex].key]){
							min = (this.data[j])[this.axes[this.rightAxesIndex].key];
						}						
					}
				}
				if(this.axes[this.rightAxesIndex].max == undefined || this.axes[this.rightAxesIndex].max == null){
					this.axes[this.rightAxesIndex].max = max;
				}
				if(this.axes[this.rightAxesIndex].min == undefined || this.axes[this.rightAxesIndex].min == null){
					if(min > 0){
						this.axes[this.rightAxesIndex].min = 0;
					} else {
						this.axes[this.rightAxesIndex].min = min;
					}
				}
			}
			*/
			// console.log('max', this.axes[this.rightAxesIndex].max);
			// console.log('data', this.data);
			if(this.axes[this.rightAxesIndex].stroke == undefined){
				this.axes[this.rightAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.rightAxesIndex].labelStroke == undefined){
				this.axes[this.rightAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.rightAxesIndex].labelInterval == undefined){
				this.axes[this.rightAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.rightAxesIndex].labelMargin == undefined){
				this.axes[this.rightAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.rightAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.rightAxesIndex].grid = true;		
			}

			if(this.axes[this.rightAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				this.axes[this.rightAxesIndex].labelInfo = labelInfo;
				this.axes[this.rightAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].labelMargin);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'start');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke);
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
					this.axes[this.rightAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelEl[j])
				}
			}
			this.rightAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.rightAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + 0 + ' ' + this.axes[this.rightAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.rightAxesLineElement.setAttribute('stroke', this.axes[this.rightAxesIndex].stroke);
			this.rightAxesLineElement.setAttribute('fill', 'transparent');
			this.rightAxesArea.append(this.rightAxesLineElement);		
		}
	
		let dataLength = this.data.length;

		if(this.bottomAxesIndex  != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.element.offsetHeight - this.area.marginBottom;
			
			if(this.bottomLegendIndex != -1){
				topPos -= this.legends[this.bottomLegendIndex].height;
			}
			
			if(this.bottomAxesIndex !=-1){
				topPos -= this.axes[this.bottomAxesIndex].height;
			}
			

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.bottomAxesIndex].top = topPos;
			this.axes[this.bottomAxesIndex].left = leftPos;
			this.axes[this.bottomAxesIndex].height = height;
			this.axes[this.bottomAxesIndex].width = width;

			let columnWidth = this.axes[this.bottomAxesIndex].width / dataLength;
			this.axes[this.bottomAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.bottomAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}

			this.bottomAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.bottomAxesArea);
			// 가로 눈금을 그린다.----------------------------------

			// console.log('data', this.data);
			if(this.axes[this.bottomAxesIndex].stroke == undefined){
				this.axes[this.bottomAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.bottomAxesIndex].labelStroke == undefined){
				this.axes[this.bottomAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.bottomAxesIndex].labelInterval == undefined){
				this.axes[this.bottomAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.bottomAxesIndex].labelMargin == undefined){
				this.axes[this.bottomAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.bottomAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.bottomAxesIndex].grid = true;		
			}

			

			if(this.axes[this.bottomAxesIndex].labelEl == undefined){
				this.axes[this.bottomAxesIndex].labelEl = [];
			}
			
			let columnGap = Math.floor(100/columnWidth)
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.bottomAxesIndex].axesColumns[j].center);
				// console.log(j, this.axes[this.bottomAxesIndex].axesColumns);
				//debugger;
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', this.axes[this.bottomAxesIndex].axesColumns[j].center);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin );
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize);
				this.axes[this.bottomAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.bottomAxesIndex].key];
				this.bottomAxesArea.appendChild(this.axes[this.bottomAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			this.bottomAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.bottomAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + this.axes[this.bottomAxesIndex].width + ' ' + 0 );											
			this.bottomAxesLineElement.setAttribute('stroke', this.axes[this.bottomAxesIndex].stroke);
			this.bottomAxesLineElement.setAttribute('fill', 'transparent');
			this.bottomAxesArea.append(this.bottomAxesLineElement);		
		}	

		// TopAxes
		if(this.topAxesIndex  != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}

			let bottomPos = topPos + this.axes[this.topAxesIndex].height;
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.topAxesIndex].top = topPos;
			this.axes[this.topAxesIndex].left = leftPos;
			this.axes[this.topAxesIndex].height = height;
			this.axes[this.topAxesIndex].width = width;

			let columnWidth = this.axes[this.topAxesIndex].width / dataLength;
			//this.axesColumns = [];
			this.axes[this.topAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.topAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}

			this.topAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.topAxesArea);
			// 가로 눈금을 그린다.----------------------------------

			// console.log('data', this.data);
			if(this.axes[this.topAxesIndex].stroke == undefined){
				this.axes[this.topAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.topAxesIndex].labelStroke == undefined){
				this.axes[this.topAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.topAxesIndex].labelInterval == undefined){
				this.axes[this.topAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.topAxesIndex].labelMargin == undefined){
				this.axes[this.topAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.topAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.topAxesIndex].grid = true;		
			}

			


			if(this.axes[this.topAxesIndex].labelEl == undefined){
				this.axes[this.topAxesIndex].labelEl = [];
			}
			let columnGap = Math.floor(100/columnWidth)

			for(let j = 0; j < this.data.length; j++){
				this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', this.axes[this.topAxesIndex].axesColumns[j].center);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', this.axes[this.topAxesIndex].height - this.axes[this.topAxesIndex].labelMargin );
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'base-line');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.topAxesIndex].fontSize);
				this.axes[this.topAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.topAxesIndex].key];
				this.topAxesArea.appendChild(this.axes[this.topAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			this.topAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.topAxesLineElement.setAttribute('d',  'M 0 ' + this.axes[this.topAxesIndex].height + 
										' L' + this.axes[this.topAxesIndex].width + ' ' + this.axes[this.topAxesIndex].height );
			this.topAxesLineElement.setAttribute('stroke', this.axes[this.topAxesIndex].stroke);
			this.topAxesLineElement.setAttribute('fill', 'transparent');
			this.topAxesArea.append(this.topAxesLineElement);		
		}				



		// -------------- chart ---------------------------------
		this.charts = this.option.charts;
		this.chartAreaElements = [];

		let chartAreaTop  = this.area.marginTop;
		if(this.title != undefined){
			chartAreaTop += this.title.height;
		}
		if(this.topLegendIndex != -1){
			chartAreaTop += this.legends[this.topLegendIndex].height;
		}
		if(this.topAxesIndex != -1){
			chartAreaTop += this.axes[this.topAxesIndex].height;
		}

		let chartAreaBottom  = this.element.offsetHeight - this.area.marginBottom;
		if(this.bottomLegendIndex != -1){
			chartAreaBottom -= this.legends[this.bottomLegendIndex].height;
		}
		if(this.bottomAxesIndex != -1){
			chartAreaBottom -= this.axes[this.bottomAxesIndex].height;
		}

		let chartAreaLeft  = this.area.marginLeft;
		if(this.leftLegendIndex != -1){
			chartAreaLeft += this.legends[this.leftLegendIndex].width;
		}
		if(this.leftAxesIndex != -1){
			chartAreaLeft += this.axes[this.leftAxesIndex].width;
		}

		let chartAreaRight  = this.element.offsetWidth - this.area.marginRight;
		if(this.rightLegendIndex != -1){
			chartAreaRight -= this.legends[this.rightLegendIndex].width;
		}
		if(this.rightAxesIndex != -1){
			chartAreaRight -= this.axes[this.rightAxesIndex].width;
		}


		for(let i=0; i < this.charts.length ; i++){
			this.charts[i].top = chartAreaTop;
			this.charts[i].left = chartAreaLeft;
			this.charts[i].bottom = chartAreaBottom;
			this.charts[i].right = chartAreaRight;
			this.charts[i].width = chartAreaRight - chartAreaLeft;
			this.charts[i].height = chartAreaBottom - chartAreaTop;
			if(this.charts[i].fontSize == undefined || this.charts[i].fontSize == null){
				this.charts[i].fontSize =14
			}
			if(this.charts[i].textPosition == undefined){
				this.charts[i].textPosition = 'out';
			}

			//this.charts[i].axesIndex

			if(i==0){
				let columnWidth = this.charts[i].width / dataLength;
				this.columns = [];
				for(let j=0; j < dataLength; j++){
					this.columns[j] ={
						center: j * columnWidth  + columnWidth/2,				
						left: j * columnWidth,
						right: (j+1) * columnWidth,
						leftInner: j * columnWidth + (columnWidth * 0.2),
						rightInner: (j+1) * columnWidth - (columnWidth * 0.2),
					}
				}		
			}

			this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
			this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
			this.svgElement.appendChild(this.chartAreaElements[i] );
			if(this.charts[i].axesPosition == undefined || this.charts[i].axesPosition == null){
				
				for(let j=0; j < this.axes.length; j++){					
					if(this.axes[j].position == 'left'){
						this.charts[i].axesPosition = 'left';
					} else if(this.axes[j].position == 'right'){
						this.charts[i].axesPosition = 'right';
					}
				}
			}
			
			for(let j=0; j < this.axes.length; j++){
				// console.log('j====>', this.axes[j].position, this.charts[i].axesPosition);
				if(this.axes[j].position == this.charts[i].axesPosition){
					this.charts[i].axesIndex = j;
					break;
				}
			}			
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
			if(this.charts[i].grid == undefined){
				this.charts[i].grid = true;
			}
			if(this.charts[i].grid == true && this.axes.length > 0){
				// console.log(this.charts[i].axesIndex);
				// console.log(this.axes[this.charts[i].axesIndex]);
				let labelInfo = this.axes[this.charts[i].axesIndex].labelInfo;
				for(let j=0; j < labelInfo.label.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M 0 ' + labelInfo.label[j].y + ' L' + this.charts[i].width + ' ' + labelInfo.label[j].y);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}


			if(this.charts[i].gridColumn == true  && this.axes.length > 0){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].center + ' ' + '0' + ' L' + this.columns[j].center + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}						
			if(this.charts[i].gridBoundColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].right + ' ' + '0' + ' L' + this.columns[j].right + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}	

			if(this.charts[i].type == 'pie'){
				let list = this.data;
				this.width = this.charts[i].width;
				this.height = this.charts[i].height;
				this.centerX = (this.charts[i].right - this.charts[i].left)/2;
				this.centerY = (this.charts[i].bottom - this.charts[i].top)/2;
				this.radius = this.width/2 * 0.8;
				if(this.width > this.height){
					this.radius = this.height/2 * 0.8;
				}
				const circumference = 2 * Math.PI * this.centerR ;
				let filled = 0;
				let bfFilled = 0;
				this.chartEl = [];
				this.labelEl = [];
				this.labelDotEl = [];
				this.valueEl = [];
				let sum = 0;
				for(let i=0; i < list.length; i++){
					sum += (list[i])[this.option.key]
				}
				let quadrantSmall1 = 0;
				let quadrantSmall2 = 0;
				let quadrantSmall3 = 0;
				let quadrantSmall4 = 0;
				for(let j=0; j < list.length; j++){
					let val =(list[j])[this.option.key]  /sum * 360; 
					filled += (val);
					// console.log('val', val);
					if(val < 5){
						if(filled <= 90){
							quadrantSmall1++;
						}
						if(filled <= 180){
							quadrantSmall2++;
						}
						if(filled <= 270){
							quadrantSmall3++;
						}
						if(filled <= 360){
							quadrantSmall4++;
						}
					}
					bfFilled = filled;
				}
				// console.log('quadrantSmall -========>', quadrantSmall1, quadrantSmall2, quadrantSmall3, quadrantSmall4);
				filled = 0;
				bfFilled = 0;		
				let quadrantSmallCount1 = 0;
				let quadrantSmallCount2 = 0;
				let quadrantSmallCount3 = 0;
				let quadrantSmallCount4 = 0;
				if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
					this.charts[i].textFill = 'var(--colorStroke)'
				}
				let lineBasePoint = 0;
				for(let j=0; j < list.length; j++){
					// sum:x = 100:x
					let val =(list[j])[this.option.key]  /sum * 360; 
		
					filled += (val );
					
					this.labelDotEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
					this.labelDotEl[j].setAttribute('r', 5);
					this.labelDotEl[j].setAttribute('fill', this.getColors(j));

					this.chartEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path')
					var d = Va.Util.makePieD(this.centerX , this.centerY, 0, this.radius, bfFilled, filled);
					this.chartEl[i].setAttribute('d', d);//  + opt.w/2 );
					this.chartEl[i].setAttribute('fill', this.getColors(j))
					this.svgElement.append(this.chartEl[i])
					
					// console.log('this.charts[i].text', this.charts[i]);
					if(this.narrowOuter == undefined || this.narrowOuter == true){
						if(val < 5){
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('fill', this.charts[i].textFill );							
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
							if(val < 5){
								if(filled <= 90){
									//quadrantSmall1++;
									quadrantSmallCount1++;
									let temp = quadrantSmall1 - quadrantSmallCount1 + 1;
									let tempStart = this.centerY - this.radius - 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'hanging');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 30);
									this.labelEl[j].setAttribute('y', (temp) * 20);

									this.labelDotEl[j].setAttribute('cx', this.centerX + this.radius + 20)
									this.labelDotEl[j].setAttribute('cy', (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])
									
									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + ' L' + (this.centerX + this.radius/2) + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');
									//pathEl.setAttribute('d', 'M' + (this.centerX - this.radius ) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									//pathEl.setAttribute('stroke', 'gray');
									this.svgElement.append(pathEl);
								}
								if(filled <= 180){
									//quadrantSmall2++;
									quadrantSmallCount2++;
									let temp = quadrantSmall2 - quadrantSmallCount2 + 1;
									let tempStart = this.centerY + this.radius + 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'start');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 30);
									this.labelEl[j].setAttribute('y', charts[i].bottom - (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX + this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', charts[i].bottom - (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + ' L' + (this.centerX + this.radius/2) + ',' + (tempStart + quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');

									//pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									//pathEl.setAttribute('stroke', 'gray');
									this.svgElement.append(pathEl);									
								}
								if(filled <= 270){
									//quadrantSmall3++;
									//quadrantSmall4++;
									quadrantSmallCount3++;
									let temp = quadrantSmall3 - quadrantSmallCount3 + 1;
									let tempStart = this.centerY + this.radius + 20;
									
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'end');
									this.labelEl[j].setAttribute('x', this.centerX - this.radius - 30);
									this.labelEl[j].setAttribute('y', charts[i].bottom - (temp) * 20);

									this.labelDotEl[j].setAttribute('cx', this.centerX - this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', charts[i].bottom - (temp)  * 20);
									this.svgElement.append(this.labelDotEl[j])
									
									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									//pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius - 20) + ',' + (temp)*20 + ' L' + (this.centerX - this.radius/2) + ',' + (tempStart + quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');									
									//pathEl.setAttribute('stroke', 'gray');
									this.svgElement.append(pathEl);
								}

								if(filled <= 360){
									//quadrantSmall4++;
									quadrantSmallCount4++;
									let temp = quadrantSmall4 - quadrantSmallCount4 + 1;	
									let tempStart = this.centerY - this.radius - 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'end');
									this.labelEl[j].setAttribute('x', this.centerX - this.radius - 30);
									this.labelEl[j].setAttribute('y', (temp) * 20);

									this.labelDotEl[j].setAttribute('cx', this.centerX - this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius - 20) + ',' + (temp)*20 + ' L' + (this.centerX - this.radius/2) + ',' + (tempStart + quadrantSmall4 - quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart + quadrantSmall4 - quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');
									this.svgElement.append(pathEl);
								}
							}

						} else {
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
						}
					} else {
						this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
						let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
						this.labelEl[j].setAttribute('alignment-baseline', 'middle');
						this.labelEl[j].setAttribute('text-anchor', 'middle');
						this.labelEl[j].setAttribute('x' ,posText.x);
						this.labelEl[j].setAttribute('y' ,posText.y);
						this.labelEl[j].setAttribute('fill', this.charts[i].textFill);
						this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.labelEl[j].textContent = (list[j])[this.charts[i].text]
						this.svgElement.append(this.labelEl[j])
					}
					bfFilled = filled;
				}
				/*
				this.legendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
				let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;
		
				let height = bottomPos - topPos;
				let width = this.legends[this.rightLegendIndex].width
		
				this.rightLegendArea.setAttribute('y', topPos);
				this.rightLegendArea.setAttribute('x', leftPos);
	
				this.rightLegendArea.setAttribute('height', height + 'px');
				this.rightLegendArea.setAttribute('width', width + 'px');
				*/
			} else if(this.charts[i].type == 'donut'){
				let list = this.data;
				this.width = this.charts[i].width;
				this.height = this.charts[i].height;
				this.centerX = (this.charts[i].right - this.charts[i].left)/2;
				this.centerY = (this.charts[i].bottom - this.charts[i].top)/2;
				this.radius = this.width/2 * 0.8;
				if(this.width > this.height){
					this.radius = this.height/2 * 0.8;
				}
				const circumference = 2 * Math.PI * this.centerR ;
				let filled = 0;
				let bfFilled = 0;
				this.chartEl = [];
				this.labelEl = [];
				this.labelDotEl =[]
				this.valueEl = [];
				let sum = 0;
				for(let i=0; i < list.length; i++){
					sum += (list[i])[this.option.key]
				}
				let quadrantSmall1 = 0;
				let quadrantSmall2 = 0;
				let quadrantSmall3 = 0;
				let quadrantSmall4 = 0;
				for(let j=0; j < list.length; j++){
					let val =(list[j])[this.option.key]  /sum * 360; 
					filled += (val);
					// console.log('val', val);
					if(val < 5){
						if(filled <= 90){
							quadrantSmall1++;
						}
						if(filled <= 180){
							quadrantSmall2++;
						}
						if(filled <= 270){
							quadrantSmall3++;
						}
						if(filled <= 360){
							quadrantSmall4++;
						}
					}
					bfFilled = filled;
				}
				// console.log('quadrantSmall -========>', quadrantSmall1, quadrantSmall2, quadrantSmall3, quadrantSmall4);
				filled = 0;
				bfFilled = 0;		
				let quadrantSmallCount1 = 0;
				let quadrantSmallCount2 = 0;
				let quadrantSmallCount3 = 0;
				let quadrantSmallCount4 = 0;
				if(this.charts[i].innerRadius == undefined){
					this.charts[i].innerRadius = 30;
				}
				for(let j=0; j < list.length; j++){
					// sum:x = 100:x
					let val =(list[j])[this.option.key]  /sum * 360; 
		
					filled += (val );
		
					this.labelDotEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
					this.labelDotEl[j].setAttribute('r', 5);
					this.labelDotEl[j].setAttribute('fill', this.getColors(j));

					this.chartEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path')

					let innerRadius = this.radius * this.charts[i].innerRadius /100;
					var d = Va.Util.makePieD(this.centerX , this.centerY, innerRadius, this.radius, bfFilled, filled);
					this.chartEl[i].setAttribute('d', d);//  + opt.w/2 );
					this.chartEl[i].setAttribute('fill', this.getColors(j))
					this.svgElement.append(this.chartEl[i])
					
					if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
						this.charts[i].textFill = 'var(--colorStroke)';
					}
					// console.log('this.charts[i].text', this.charts[i]);
					if(this.narrowOuter == undefined || this.narrowOuter == true){
						if(val < 5){
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('fill', this.charts[i].textFill);
							
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
							if(val < 5){
								if(filled <= 90){
									//quadrantSmall1++;
									quadrantSmallCount1++;
									let temp = quadrantSmall1 - quadrantSmallCount1 + 1;
									let tempStart = this.centerY - this.radius - 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'hanging');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 30);
									this.labelEl[j].setAttribute('y', (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX + this.radius + 20)
									this.labelDotEl[j].setAttribute('cy', (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);
									/*
									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + ' L' + (this.centerX + this.radius/2) + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');									
									this.svgElement.append(pathEl);
								}
								if(filled <= 180){
									//quadrantSmall2++;
									quadrantSmallCount2++;
									let temp = quadrantSmall2 - quadrantSmallCount2 + 1;
									let tempStart = this.centerY + this.radius + 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'start');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 30);
									this.labelEl[j].setAttribute('y', this.charts[i].bottom - (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX + this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', charts[i].bottom - (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);
									/*
									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + ' L' + (this.centerX + this.radius/2) + ',' + (tempStart + quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');
									this.svgElement.append(pathEl);									
								}
								if(filled <= 270){
									//quadrantSmall3++;
									//quadrantSmall4++;
									quadrantSmallCount3++;
									let temp = quadrantSmall3 - quadrantSmallCount3 + 1;
									let tempStart = this.centerY + this.radius + 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'end');
									this.labelEl[j].setAttribute('x', this.centerX - this.radius -30);
									this.labelEl[j].setAttribute('y', this.charts[i].bottom - (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX - this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', charts[i].bottom - (temp)  * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									/*
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius - 20) + ',' + (temp)*20 + ' L' + (this.centerX - this.radius/2) + ',' + (tempStart + quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');											
									this.svgElement.append(pathEl);
								}
								if(filled <= 360){
									//quadrantSmall4++;
									quadrantSmallCount4++;
									let temp = quadrantSmall4 - quadrantSmallCount4 + 1;
									let tempStart = this.centerY - this.radius - 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'end');
									this.labelEl[j].setAttribute('x', this.centerX - this.radius -30);
									this.labelEl[j].setAttribute('y', (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX - this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])


									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled)/2 -90);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									/*
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius - 20) + ',' + (temp)*20 + ' L' + (this.centerX - this.radius/2) + ',' + (tempStart + quadrantSmall4 - quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart + quadrantSmall4 - quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');									
									this.svgElement.append(pathEl);
								}
							}

						} else {
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
						}
					} else {
						this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
						let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
						this.labelEl[j].setAttribute('alignment-baseline', 'middle');
						this.labelEl[j].setAttribute('text-anchor', 'middle');
						this.labelEl[j].setAttribute('x' ,posText.x);
						this.labelEl[j].setAttribute('y' ,posText.y);
						this.labelEl[j].setAttribute('fill', this.charts[i].textFill);
						this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.labelEl[j].textContent = (list[j])[this.charts[i].text]
						this.svgElement.append(this.labelEl[j])
					}
					bfFilled = filled;
				}
				/*
				this.legendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
				let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;
		
				let height = bottomPos - topPos;
				let width = this.legends[this.rightLegendIndex].width
		
				this.rightLegendArea.setAttribute('y', topPos);
				this.rightLegendArea.setAttribute('x', leftPos);
	
				this.rightLegendArea.setAttribute('height', height + 'px');
				this.rightLegendArea.setAttribute('width', width + 'px');
				*/
			
			} else if(this.charts[i].type == 'guage'){	// guage
				let list = this.data;
				this.width = this.charts[i].width;
				this.height = this.charts[i].height;
				this.centerX = (this.charts[i].right - this.charts[i].left)/2;
				//this.centerY = (this.charts[i].bottom - this.charts[i].top)/2;
				this.centerY = (this.charts[i].bottom -10);
				this.radius = this.width/2 * 0.8;
				if(this.width > this.height){
					//this.radius = this.height/2 * 0.8;
					this.radius = (this.height-10) * 0.8;
				}
				const circumference = 2 * Math.PI * this.centerR ;
				let filled = 0;
				let bfFilled = 0;
				this.chartEl = [];
				this.labelEl = [];
				this.labelDotEl = [];
				this.valueEl = [];
				let sum = 0;
				for(let i=0; i < list.length; i++){
					sum += (list[i])[this.option.key]
				}
				let quadrantSmall1 = 0;
				let quadrantSmall2 = 0;
				for(let j=0; j < list.length; j++){
					let val =(list[j])[this.option.key]  / sum * 180; 
					filled += (val);
					// console.log('val', val);
					if(val < 5){
						if(filled <= 90){
							quadrantSmall1++;
						}
						if(filled > 90){
							quadrantSmall2++;
						}
					}
					bfFilled = filled;
				}
				//// console.log('quadrantSmall -========>', quadrantSmall1, quadrantSmall2, quadrantSmall3, quadrantSmall4);
				filled = 0;
				bfFilled = 0;		
				let quadrantSmallCount1 = 0;
				let quadrantSmallCount2 = 0;

				for(let j=0; j < list.length; j++){
					// sum:x = 100:x
					let val =(list[j])[this.option.key]  /sum * 180; 
		
					filled += (val );
					this.labelDotEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
					this.labelDotEl[j].setAttribute('r', 5);
					this.labelDotEl[j].setAttribute('fill', this.getColors(j));

					this.chartEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path')
					var d = Va.Util.makePieD(this.centerX , this.centerY, 0, this.radius, bfFilled -90, filled -90);
					this.chartEl[i].setAttribute('d', d);//  + opt.w/2 );
					this.chartEl[i].setAttribute('fill', this.getColors(j))
					//this.chartEl[i]
					this.svgElement.append(this.chartEl[i]) 
					if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
						this.charts[i].textFill = 'var(--colorStroke)';
					}
					
					// console.log('this.charts[i].text', this.charts[i]);
					if(this.narrowOuter == undefined || this.narrowOuter == true){
						if(val < 5){
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled -360)/2 );
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('fill', this.charts[i].textFill);
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
							if(val < 5){
								if(filled <= 90){
									/*
									//quadrantSmall1++;
									quadrantSmallCount1++;
									let temp = quadrantSmall1 - quadrantSmallCount1 + 1;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'hanging');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 10);
									this.labelEl[j].setAttribute('y', (temp) * 20);
									
									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled -360)/2 );

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									this.svgElement.append(pathEl);
									*/
									
									quadrantSmallCount1++;
									let temp = quadrantSmall1 - quadrantSmallCount1 + 1;
									let tempStart = this.centerY - this.radius - 20;

									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'end');
									this.labelEl[j].setAttribute('x', this.centerX - this.radius - 30);
									this.labelEl[j].setAttribute('y', (temp) * 20);
									
									this.labelDotEl[j].setAttribute('cx', this.centerX - this.radius - 20)
									this.labelDotEl[j].setAttribute('cy', (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])

									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled - 360)/2 );

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + ' L' + (this.centerX + this.radius/2) + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + (tempStart - quadrantSmall4 + quadrantSmallCount4) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');
									/*
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius -10) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									this.svgElement.append(pathEl);		
									
														
								}
								if(filled <= 180){
									//quadrantSmall2++;
									/*
									quadrantSmallCount2++;
									let temp = quadrantSmall2 - quadrantSmallCount2 + 1;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'start');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 10);
									this.labelEl[j].setAttribute('y', this.charts[i].bottom - (temp) * 20);
									
									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled - 360)/2);

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX - this.radius) + ',' + (temp)*20 + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									this.svgElement.append(pathEl);		
									*/
									quadrantSmallCount2++;
									//let temp = quadrantSmall2 - quadrantSmallCount2 + 1;
									let temp = quadrantSmallCount2 + 1;
									let tempStart = this.centerY + this.radius + 20;
									// temp만큼 밑으로
									this.labelEl[j].setAttribute('alignment-baseline', 'middle');
									this.labelEl[j].setAttribute('text-anchor', 'start');
									this.labelEl[j].setAttribute('x', this.centerX + this.radius + 40);
									this.labelEl[j].setAttribute('y',  (temp) * 20 );
									
									this.labelDotEl[j].setAttribute('cx', this.centerX + this.radius + 30)
									this.labelDotEl[j].setAttribute('cy',  (temp) * 20);
									this.svgElement.append(this.labelDotEl[j])


									let bfPos = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 1, (bfFilled + filled -360)/2 );

									let pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 30) + ',' + (temp)*20 + 
															' L' + (this.centerX + this.radius + 20) + ',' + (temp)*20 + 
															' L' + (bfPos.x+10) + ',' + bfPos.y + 
															' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', '#000');
									pathEl.setAttribute('stroke-width', 0.1);
									pathEl.setAttribute('fill', 'transparent');

									/*
									pathEl.setAttribute('d', 'M' + (this.centerX + this.radius + 10) + ',' + ((this.centerY ) - (temp) * 20) + ' L' + bfPos.x + ',' + bfPos.y);
									pathEl.setAttribute('stroke', 'gray');
									*/
									this.svgElement.append(pathEl);																
								}
							}

						} else {
							this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
							let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled -360)/2);
							this.labelEl[j].setAttribute('alignment-baseline', 'middle');
							this.labelEl[j].setAttribute('text-anchor', 'middle');
							this.labelEl[j].setAttribute('x', posText.x);
							this.labelEl[j].setAttribute('y', posText.y);
							this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
							this.labelEl[j].textContent = (list[j])[this.charts[i].text]
							this.svgElement.append(this.labelEl[j]);
						}
					} else {
						this.labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
						let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled -360)/2);
						this.labelEl[j].setAttribute('alignment-baseline', 'middle');
						this.labelEl[j].setAttribute('text-anchor', 'middle');
						this.labelEl[j].setAttribute('x' ,posText.x);
						this.labelEl[j].setAttribute('y' ,posText.y);
						this.labelEl[j].setAttribute('fill', this.charts[i].textFill);
						this.labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.labelEl[j].textContent = (list[j])[this.charts[i].text]
						this.svgElement.append(this.labelEl[j])
					}
					bfFilled = filled;
				}
				/*
				this.legendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
				let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;
		
				let height = bottomPos - topPos;
				let width = this.legends[this.rightLegendIndex].width
		
				this.rightLegendArea.setAttribute('y', topPos);
				this.rightLegendArea.setAttribute('x', leftPos);
	
				this.rightLegendArea.setAttribute('height', height + 'px');
				this.rightLegendArea.setAttribute('width', width + 'px');
				*/
			} else if(this.charts[i].type == 'radar'){
				let list = this.data;
				this.width = this.charts[i].width;
				this.height = this.charts[i].height;
				this.centerX = (this.charts[i].right - this.charts[i].left)/2;
				this.centerY = (this.charts[i].bottom - this.charts[i].top)/2;
				this.charts[i].radius = this.width/2 * 0.8;
				if(this.width > this.height){
					this.charts[i].radius = this.height/2 * 0.8;
				}
				const circumference = 2 * Math.PI * this.centerR ;
				let filled = 0;
				let bfFilled = 0;
				this.chartEl = [];
				this.labelEl = [];
				this.valueEl = [];
				let sum = 0;
				for(let i=0; i < list.length; i++){
					sum += (list[i])[this.option.key]
				}
				let keyLength = this.charts[i].keys.length;
				let perRadian = 360/keyLength;

				this.charts[i].radarAxisEl = [];
				for(let j=0; j < keyLength; j++){
					let posAxis = Va.Util.radianToXY(this.centerX, this.centerY, this.charts[i].radius, perRadian * j - 90);
					this.charts[i].radarAxisEl[j] = document.createElementNS('http://www.w3.org/2000/svg', 'path');		
					this.charts[i].radarAxisEl[j].setAttribute('stroke', 'gray');			
					this.charts[i].radarAxisEl[j].setAttribute('d', 'M' + this.centerX + ',' + this.centerY + ' L' + posAxis.x + ',' + posAxis.y);
					this.svgElement.appendChild(this.charts[i].radarAxisEl[j]);
				}
				if(this.charts[i].textFill == undefined || this.charts[i].textFill == null){
					this.charts[i].textFill = 'var(--colorStroke)';
				
				}
				this.charts[i].radarAxisTextEl = [];
				for(let j=0; j < keyLength; j++){
					let posAxis = Va.Util.radianToXY(this.centerX, this.centerY, this.charts[i].radius * 1.1, perRadian * j - 90);
					this.charts[i].radarAxisTextEl[j] = document.createElementNS('http://www.w3.org/2000/svg', 'text');		
					this.charts[i].radarAxisTextEl[j].setAttribute('fill', '#000');			
					this.charts[i].radarAxisTextEl[j].setAttribute('text-anchor', 'middle');
					this.charts[i].radarAxisTextEl[j].setAttribute('alignment-baseline', 'middle');
					this.charts[i].radarAxisTextEl[j].setAttribute('fill', this.charts[i].textFill);
					this.charts[i].radarAxisTextEl[j].setAttribute('x', posAxis.x);
					this.charts[i].radarAxisTextEl[j].setAttribute('y', posAxis.y);
					this.charts[i].radarAxisTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
					this.charts[i].radarAxisTextEl[j].textContent =this.charts[i].label[j]
					this.svgElement.appendChild(this.charts[i].radarAxisTextEl[j]);
				}

				let maxValue = 0;
				let minValue = 0;
				for(let j=0; j < list.length; j++){
					for(let k=0; k < this.charts[i].keys.length; k++){
						let tempVal = (list[j])[this.charts[i].keys[k]];
						if(j==0 && k==0){
							maxValue = tempVal;
							minValue = tempVal;
						} else if(tempVal < minValue){
							minValue = tempVal;
						} else if(tempVal > maxValue){
							maxValue = tempVal;
						}
					}
				}
				// console.log('minValue maxValue', minValue, maxValue);
				this.charts[i].min = minValue;

				if(this.charts[i].min > 0){
					this.charts[i].min = 0;
				}
				this.charts[i].max = maxValue;
				// 눈금을 그린다.... 
				let labelInfo = this.getRadiusLabelUnit(this.charts[i].radius, this.charts[i].min, this.charts[i].max);
				this.charts[i].labelInfo = labelInfo;
				this.charts[i].labelEl = [];
				// console.log(i, labelInfo);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.charts[i].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.charts[i].labelEl[j].setAttribute('x', this.centerX + 10);
					this.charts[i].labelEl[j].setAttribute('y', Va.Util.getFixedNumber(this.centerY -labelInfo.label[j].y));// + this.axes[this.leftAxesIndex].top);
					this.charts[i].labelEl[j].setAttribute('text-anchor', 'start');
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.charts[i].labelEl[j].setAttribute('fill', this.charts[i].textFill);
					this.charts[i].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.charts[i].labelEl[j].setAttribute('font-size', this.charts[i].fontSize);
					this.charts[i].labelEl[j].textContent = Va.Util.getFixedNumber(labelInfo.label[j].value);
					this.svgElement.append(this.charts[i].labelEl[j]);

					let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					let d= '';
					for(let k=0; k < this.charts[i].keys.length; k++){
						//let key = this.charts[i].keys[k];
						let value = labelInfo.label[j].y;
						// console.log('value---------->',j, k, value);
						let h = this.getRadarHeight(i, value);
						// console.log('h', h);
						let pos = Va.Util.radianToXY(this.centerX, this.centerY, value, perRadian * k -90);
						// console.log('pos----->',   pos.x, pos.y);
						if(k == 0){
							d = 'M' + pos.x + ',' + pos.y + ' ';
						} else {
							d = d + 'L' + pos.x + ',' + pos.y + ' ';
						}
					}
					d = d + 'Z';
					// console.log('d', d);
					path.setAttribute('d', d);
					path.setAttribute('stroke', 'gray');
					path.setAttribute('fill', 'none');
					//path.setAttribute('fill-opacity', '0.5');
					
					this.svgElement.appendChild(path);

				}

				///////////////

				for(let j=0; j < list.length; j++){
					
					let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					let d= '';
					for(let k=0; k < this.charts[i].keys.length; k++){
						let key = this.charts[i].keys[k];
						let value = (list[j])[key];
						// console.log('value---------->',j, k, value);
						let h = this.getRadarHeight(i, value);
						// console.log('h', h);

						let pos = Va.Util.radianToXY(this.centerX, this.centerY, h, perRadian * k -90);
						// console.log('pos----->',   pos.x, pos.y);
						if(k == 0){
							d = 'M' + pos.x + ',' + pos.y + ' ';
						} else {
							d = d + 'L' + pos.x + ',' + pos.y + ' ';
						}
					}
					d = d + 'Z';
					// console.log('d', d);
					path.setAttribute('d', d);
					path.setAttribute('stroke', this.getColors(j));
					path.setAttribute('fill', this.getColors(j));
					path.setAttribute('fill-opacity', '0.5');					
					this.svgElement.appendChild(path);
				}

			} 				 							
		}
	}
	setData(data){
		if(this.sortData == undefined || this.sortData == true){
			data.sort( (a, b) => {
				return  b[this.option.key] - a[this.option.key];
			});
		}
		this.data = data;
		this.draw();
	}
	getAxesHeight(index, val){
		let height = (val-this.axes[index].min) * this.axes[index].height / (this.axes[index].max - this.axes[index].min)	// charts --> axes
		// console.log('height', height, val , this.charts[index].height ,'>>>max', this.axes[index].max, this.axes[index].min);
		return height;
	}
	getRadarHeight(index, val){
		let height = (val-this.charts[index].min) * this.charts[index].radius / (this.charts[index].max - this.charts[index].min)
		// console.log('height', height, val , this.charts[index].radius ,'>>>max', this.charts[index].max, this.charts[index].min);
		return height;
	}

	getMinMax(data, key, pMin, pMax){
		let min = null;
		let max = null;
		if(pMin != undefined && pMax != undefined){
			max = pMax;
			min = pMin;
		} else {
			for(let j=0; j< data.length; j++){
				if(j==0){
					max = (data[j])[key];
					min = (data[j])[key];
				} else{
					if(max < (data[j])[key]){
						max = (data[j])[key];
					}
					if(min > (data[j])[key]){
						min = (data[j])[key];
					}						
				}
			}
			if(min > 0){
				min = 0;
			}
			// console.log('min max',min, max);
			
			let size =  (max - min);

			let changeMax = max + size * 0.1;
			let changeMin = min - size * 0.1;

			size =  (changeMax - changeMin);

			let digit = Va.Util.getDigit(size);
			// console.log('digit', digit);
			let pow = Math.pow(10, digit-1);
			let basePow = pow/10;
			// console.log('!!!!!!!!!!!!!', basePow)
			if(basePow >=1){
				max = Math.floor(changeMax / basePow)*basePow;
				min = Math.floor(changeMin / basePow)*basePow;
			} else {
				max = Math.floor(changeMax / basePow)*basePow;
				min = Math.floor(changeMin / basePow)*basePow;

			}
		}
		return {
			max: max,
			min: min
		}
	}	
	getVerticalLabelUnit(height, min, max){
		let labelCount = 2;
		let valueHeight = (max - min);
		if(height < 40){
			labelCount = 2;
		} else if(height < 100){
			labelCount = 4;
		} else if(height < 200){
			labelCount = 5;
		} else if(height < 300){
			labelCount = 10;
		} else if(height < 500){
			labelCount = 15;
		} else if(height < 800){
			labelCount = 18;
		}  else {
			labelCount = 20;
		}

		/*
		let baseMax = max;
		if(Math.abs(min) > max){
			baseMax = Math.abs(min);
		}
		*/
		// console.log('min--------------------------------', min, max)
		let size = max -min;
		let digit = Va.Util.getDigit(size);
		// console.log('digit', digit);
		let pow = Math.pow(10, digit-1);
		let basePow = pow/100;
		
		// console.log('basePow---->', basePow)
		
		// 100이란 단위는 1/100 단위로 놓으면 될듯하다. 
		// console.log('labelCount', labelCount);
		let interval = (max-min)/labelCount;
		let label = [];
		
		if(min < 0){
			//max - min: 0 - min = height: 0pos

			let pos0 = height - (-1 * min * height / (max - min));
			// 양수

			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow < max; i++){
					// console.log('양수', i, Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow , max)
				
					label.push({ 
						y: pos0 - (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) / basePow)*basePow < max; i++){
					label.push({ 
						y: pos0 - (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
			label.push({
				y: pos0,
				value: 0
			})
			// 음수
			
			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow > min; i++){
					label.push({ 
						y: pos0 + (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) / basePow)*basePow > min; i++){
					label.push({ 
						y: pos0 + (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}			

		} else {

			
			for(let i=0; i <labelCount  + 1; i++){
				// console.log('>>>', i, height, labelCount, interval, basePow );
				// console.log('>>>>>>>',Number(min) + (interval * i) )
				// console.log('>>>>>>>',Math.floor(Number(min) + (interval * i) * basePow)/basePow)
				if(basePow >= 1){
					label.push({ 
						y: height - (height/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) * basePow)/basePow
					})
				} else {
					label.push({ 
						y: height - (height/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
		}
		return {			
			max:max,
			min:min,
			interval:interval,
			label:label
		}
	}
	getRadiusLabelUnit(height, min, max){
		let labelCount = 2;
		let valueHeight = (max - min);
		if(height < 40){
			labelCount = 2;
		} else if(height < 100){
			labelCount = 4;
		} else if(height < 200){
			labelCount = 5;
		} else if(height < 300){
			labelCount = 10;
		} else if(height < 500){
			labelCount = 15;
		} else if(height < 800){
			labelCount = 18;
		}  else {
			labelCount = 20;
		}

		/*
		let baseMax = max;
		if(Math.abs(min) > max){
			baseMax = Math.abs(min);
		}
		*/
		// console.log('min--------------------------------', min, max)
		let size = max -min;
		let digit = Va.Util.getDigit(size);
		// console.log('digit', digit);
		let pow = Math.pow(10, digit-1);
		let basePow = pow/100;
		
		// console.log('basePow---->', basePow)
		
		// 100이란 단위는 1/100 단위로 놓으면 될듯하다. 
		// console.log('labelCount', labelCount);
		let interval = (max-min)/labelCount;
		let label = [];
		
		if(min < 0){
			//max - min: 0 - min = height: 0pos

			let pos0 = 0;//height - (-1 * min * height / (max - min));
			// 양수

			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow < max; i++){
					// console.log('양수', i, Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow , max)
				
					label.push({ 
						y: pos0 - (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) + (interval * (i+1))) / basePow)*basePow < max; i++){
					label.push({ 
						y: pos0 - (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) + (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
			label.push({
				y: pos0,
				value: 0
			})
			// 음수
			
			if(basePow >= 1){
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow > min; i++){
					label.push({ 
						y: pos0 + (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) * basePow)/basePow
					})
				} 
			} else {
				for(let i=0; Math.floor( (Number(0) - (interval * (i+1))) / basePow)*basePow > min; i++){
					label.push({ 
						y: pos0 + (height/labelCount * (i+1)),
						value: Math.floor( (Number(0) - (interval * (i+1))) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}			

		} else {

			
			for(let i=0; i <labelCount  + 1; i++){
				// console.log('>>>', i, height, labelCount, interval, basePow );
				// console.log('>>>>>>>',Number(min) + (interval * i) )
				// console.log('>>>>>>>',Math.floor(Number(min) + (interval * i) * basePow)/basePow)
				if(basePow >= 1){
					label.push({ 
						y: (height/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) * basePow)/basePow
					})
				} else {
					label.push({ 
						y: (height/labelCount * i),
						value: Math.floor( (Number(min) + (interval * i)) / basePow) * basePow
						//value: Math.floor(Number(min) + (interval * i) / basePow) * basePow
					})
				}
			}
		}
		return {			
			max:max,
			min:min,
			interval:interval,
			label:label
		}
	}	
}
Va.registerComponent('piechart', Va.PieChart);

// Pie Chart
Va.PieChartOld = class extends Va.Component {
    constructor(option){
        super('div', option)
        //this.setOption(option)
        //this.createEl();
    //}
    //createEl(){
        //this.element = super.createBaseEl('div');
        // 추가적인 코드
        //// console.log('div',  this.element)
        this.containerElement = this.element; // child 위치.

		
		// 이벤트 처리
		if(this.option.onClick !== undefined ){
			this.element.onclick = function(event){
				// console.log('여기는 들어옴')
				const controller = Va.getPresenter(this);
				//// console.log('controller', controller, this.parentNode.component)

				controller[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onChange !== undefined ){
			this.element.onchange = function(event){
				const controller = Va.getPresenter(this);
				//// console.log('controller', controller, this, this.parentNode.component)

				controller[this.component.option.onChange](this.component, event);
			}
		}
		if(this.option.onBlur !== undefined ){
			this.element.onblur = function(event){
				const controller = Va.getPresenter(this);
			// // console.log('controller', controller, this.parentNode.component)
				controller[this.component.option.onBlur](this.component, event);
			}
		}
		if(this.option.onFocus !== undefined ){
			this.element.onfocus = function(event){
				const controller = Va.getPresenter(this);
				//// console.log('controller', controller, this.parentNode.component)
				controller[this.component.option.onFocus](this.component, event);
			}
		}
		if(this.option.onKeyDown !== undefined ){
			this.fieldEl.onkeydown = function(event){
				const controller = Va.getPresenter(this);
				//// console.log('controller', controller, this.parentNode.component)
				controller[this.parentNode.component.option.onKeyDown](this.parentNode.component, event);
			}
		}
		if(this.option.onKeyUp !== undefined ){
			this.fieldEl.onkeyup = function(event){
			const controller = Va.getPresenter(this);
			//// console.log('controller', controller, this.parentNode.component)
			controller[this.parentNode.component.option.onKeyUp](this.parentNode.component, event);
			}
		}
		var resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
			// 관찰 대상의 resize이벤트시, 처리할 로직
			// console.log('entry', entry);
			if(entry.target== this.element){
				//setTimeout(()=>{
				this.resize(entry.contentBoxSize);
				//},100)
			}
			}
		});
		resizeObserver.observe(this.element);

        //return this.element;
    }
	resize (contentBoxSize){
		// console.log('resize********************************************', arguments);
		//this.draw();

		if(this.data != undefined && this.data != null){
			this.drawData();
		}
		/*
		if(contentBoxSize == null){
		//	this.grid.style.height = this.element.offsetHeight + 'px';
		//	this.grid.style.width = this.element.offsetWidth + 'px';
		}
		else  {
			this.grid.style.height = contentBoxSize.height + 'px';
			this.grid.style.width = contentBoxSize.width + 'px';	// 뺄지모름
		}
		*/
	}
    getEl(){
        return (this.element)
    }
	afterRender(comp, compEl, parentEl){
		// console.log('...........afterRender')
		this.draw();
	}
	draw(){
		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.containerElement.append(this.svgElement);
		this.element.append(this.svgElement);
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.option.border == undefined){
			this.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.margin = 20
		} 
		if(this.area.marginTop == undefined){
			this.marginTop = 20
		}
		if(this.area.marginBottom == undefined){
			this.marginBottom = 20
		} 
		if(this.area.marginLeft == undefined){
			this.marginLeft = 20
		}
		if(this.area.marginRight == undefined){
			this.marginRight = 20
		} 		
		if(this.option.fill == undefined){
			this.fill = ['red', 'yellow', 'green', 'blue', 'gray', 'lightgreeen', 'yelloworange' ,'orange', 'white', 'cyan', 'darkblue', 'lightblue', 'pink']
			this.colors = ['#0f6cbd', '#da3b01', '#d6d6d6', '#fde300', '#00723b', '#b4d6fa' , '#0027b4', '#eaa300', '#881798', '#dc626d' , '#a7e3a5', '#881798' ];
		}
	}
	getColors(i){
		i = i % this.colors.length;
		return this.colors[i];
	}	
	setData(data){
		let isStack = false;
		for(let i=0; i < this.option.charts.length; i++){
			if(this.option.charts[i].type == 'stack'){
				isStack = true;
			}
		}		
		if(isStack == true){
			data.sort( (a, b) => {
				if(b[this.option.stackKey] > a[this.option.stackKey]){
					return 1;
				} else {
					return  b[this.option.key] - a[this.option.key];
				}
			});
		} else {
			data.sort( (a, b) => {
				return  b[this.option.key] - a[this.option.key];
			});
		}
		this.data = data;
		this.draw();
		this.drawData();
	}
	drawData(){
		let list = this.data;
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;



		this.centerX = this.width/2;
		this.centerY = this.height/2;
		this.radius = this.width/2 * 0.8;
		if(this.width > this.height){
			this.radius = this.height/2 * 0.8;
		}

		const circumference = 2 * Math.PI * this.centerR ;
		let filled = 0;
		let bfFilled = 0;


		this.chartEl = [];
		this.labelEl = [];
		let sum = 0;
		for(let i=0; i < list.length; i++){
			sum += (list[i])[this.option.key]
		}
		for(let i=0; i < list.length; i++){
			// sum:x = 100:x
			let val =(list[i])[this.option.key]  /sum * 360; 

			filled += (val );

			this.chartEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path')
			var d = Va.Util.makePieD(this.centerX , this.centerY, 0, this.radius, bfFilled, filled);
			this.chartEl[i].setAttribute('d', d);//  + opt.w/2 );
			this.chartEl[i].setAttribute('fill', this.getColors(i))
			this.svgElement.append(this.chartEl[i])

			this.labelEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
			let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
			this.labelEl[i].setAttribute('alignment-baseline', 'middle');
			this.labelEl[i].setAttribute('text-anchor', 'middle');
			this.labelEl[i].setAttribute('x' ,posText.x);
			this.labelEl[i].setAttribute('y' ,posText.y);
			this.labelEl[i].textContent = (list[i])[this.option.display]
			this.svgElement.append(this.labelEl[i])

			this.valueEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
			let posValueText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
			this.valueEl[i].setAttribute('alignment-baseline', 'middle');
			this.valueEl[i].setAttribute('text-anchor', 'middle');
			this.valueEl[i].setAttribute('x' ,posValueText.x);
			this.valueEl[i].setAttribute('y' ,posValueText.y);
			this.valueEl[i].textContent = (list[i])[this.option.display]
			this.svgElement.append(this.valueEl[i]);
			bfFilled = filled;
		}
		this.legendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;

		let height = bottomPos - topPos;
		let width = this.legends[this.rightLegendIndex].width

		this.rightLegendArea.setAttribute('y', topPos);
		this.rightLegendArea.setAttribute('x', leftPos);

		this.rightLegendArea.setAttribute('height', height + 'px');
		this.rightLegendArea.setAttribute('width', width + 'px');
	}
	
}
Va.registerComponent('piechartold', Va.PieChartOld);


// Donut Chart
Va.DonutChart = class extends Va.Component {
    constructor(option){
        super('div', option);
		this.tagName = 'donutChart';
		this.elements = ['element'];
        this.containerElement = this.element; 

		if(this.option.innerRadius != undefined){
			this.innerRadius = this.option.innerRadius;
		}
		// 이벤트 처리
		if(this.option.onClick !== undefined ){
			this.element.onclick = function(event){
				// console.log('여기는 들어옴')
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onChange !== undefined ){
			this.element.onchange = function(event){
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onBlur !== undefined ){
			this.element.onblur = function(event){
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onFocus !== undefined ){
			this.element.onfocus = function(event){
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onKeyDown !== undefined ){
			this.fieldEl.onkeydown = function(event){
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}
		if(this.option.onKeyUp !== undefined ){
			this.fieldEl.onkeyup = function(event){
				const view = Va.getView(this);
				view[this.component.option.onClick](this.component, event);
			}
		}

		if(this.equalClass(Va.DonutChart)){
			this.update();
		}

		var resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
			// 관찰 대상의 resize이벤트시, 처리할 로직
			// console.log('entry', entry);
			if(entry.target== this.element){
				//setTimeout(()=>{
				this.resize(entry.contentBoxSize);
				//},100)
			}
			}
		});
		resizeObserver.observe(this.element);

        //return this.element;
    }
	update(){
		if(this.equalClass(Va.DonutChart)){
			this.updateStyles();
		}
	}
	resize (contentBoxSize){
		// console.log('resize********************************************', arguments);
		this.draw();

		if(this.data != undefined && this.data != null){
			this.drawData();
		}
		/*
		if(contentBoxSize == null){
		//	this.grid.style.height = this.element.offsetHeight + 'px';
		//	this.grid.style.width = this.element.offsetWidth + 'px';
		}
		else  {
			this.grid.style.height = contentBoxSize.height + 'px';
			this.grid.style.width = contentBoxSize.width + 'px';	// 뺄지모름
		}
		*/
	}
    getEl(){
        return (this.element)
    }
	afterRender(comp, compEl, parentEl){
		// console.log('...........afterRender')
		this.draw();
	}
	draw(){
		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.containerElement.append(this.svgElement);
		this.element.append(this.svgElement);
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.option.border == undefined){
			this.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.margin = 20
		} 
		if(this.area.marginTop == undefined){
			this.marginTop = 20
		}
		if(this.area.marginBottom == undefined){
			this.marginBottom = 20
		} 
		if(this.area.marginLeft == undefined){
			this.marginLeft = 20
		}
		if(this.area.marginRight == undefined){
			this.marginRight = 20
		} 		
		if(this.option.fill == undefined){
			this.fill = ['red', 'yellow', 'green', 'blue', 'gray', 'lightgreeen', 'yelloworange' ,'orange', 'white', 'cyan', 'darkblue', 'lightblue', 'pink']
		}
		if(this.option.fontSize == undefined || this.option.fontSize == null){
			this.fontSize = 14;
		}
	}
	setData(data){
		this.data = data;
		this.drawData();
	}
	drawData(){
		let list = this.data;
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;

		this.centerX = this.width/2;
		this.centerY = this.height/2;
		this.radius = this.width/2 * 0.8;
		if(this.width > this.height){
			this.radius = this.height/2 * 0.8;
			this.innerRadius = this.height/2 * 0.2;
		}



		const circumference = 2 * Math.PI * this.centerR ;
		let filled = 0;
		let bfFilled = 0;


		this.chartEl = [];
		this.labelEl = [];
		let sum = 0;
		for(let i=0; i < list.length; i++){
			sum += (list[i])[this.option.key]
		}
		for(let i=0; i < list.length; i++){
			// sum:x = 100:x
			let val =(list[i])[this.option.key]  /sum * 360; 

			filled += (val );

			this.chartEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path')
			var d = Va.Util.makePieD(this.centerX , this.centerY, this.innerRadius, this.radius, bfFilled, filled);
			this.chartEl[i].setAttribute('d', d);//  + opt.w/2 );
			this.chartEl[i].setAttribute('fill', this.fill[i])
			this.svgElement.append(this.chartEl[i])
			this.labelEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'text')
			let posText = Va.Util.radianToXY(this.centerX, this.centerY, this.radius * 0.7, (bfFilled + filled)/2 -90);
			this.labelEl[i].setAttribute('alignment-baseline', 'middle');
			this.labelEl[i].setAttribute('text-anchor', 'middle');
			this.labelEl[i].setAttribute('x' ,posText.x);
			this.labelEl[i].setAttribute('y' ,posText.y);
			this.labelEl[i].setAttribute('font-size', this.option.fontSize);
			this.labelEl[i].textContent = (list[i])[this.option.display]
			this.svgElement.append(this.labelEl[i])
			bfFilled = filled;
		}
	}
	
}
Va.registerComponent('donutchart', Va.DonutChart);


// Grid Chart

Va.GridChart = class extends Va.AxisChart {
    constructor( option){
		
        super(option);
		this.tagName = 'gridChart';
		this.elements = [...this.elements];
		this.properties = [...this.properties];
		this.innerComponents = [...this.innerComponents];
		this.events = [...this.events];
		this.setOption();
		if(this.option.data != undefined){
			setTimeout(()=>{
				this.setData(this.option.data);
			},300);
		}
		if(this.equalClass(Va.GridChart)){
			this.update();
		}
    }
	update(){
		if(this.equalClass(Va.GridChart)){
			this.updateStyles();
		}
	}
	draw(){
		if(this.data == null){
			this.element.innerHTML = 'chart area';
		}

		this.element.innerHTML = '';
		this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
		this.svgElement.setAttribute('width', '100%')
		this.svgElement.setAttribute('height', '100%')
		this.element.append(this.svgElement);
		if(this.option.title != undefined){
			this.title = this.option.title
		} 
		if(this.option.area == undefined){
			this.area = {}
		} else {
			this.area = this.option.area
		}
		if(this.area.border == undefined){
			this.area.border = '0.5px solid darkgray';
		} 
		if(this.area.margin == undefined){
			this.area.margin = 20
		} 
		if(this.area.marginTop == undefined){
			this.area.marginTop = 20
		}
		if(this.area.marginBottom == undefined){
			this.area.marginBottom = 20
		} 
		if(this.area.marginLeft == undefined){
			this.area.marginLeft = 20
		}
		if(this.area.marginRight == undefined){
			this.area.marginRight = 20
		} 		
		if(this.option.axes == undefined){
			this.axes =[{
				position:'left'
			}]
		} else {
			this.axes = this.option.axes;
		}
		if(this.option.legends == undefined){
			this.legends =[];
		} else {
			this.legends = this.option.legends;
		}
		
		if(this.title == undefined){
			this.titleIndex = -1;
		}

		let leftAxesCount = 0;		
		let rightAxesCount = 0;
		let bottomAxesCount = 0;
		let topAxesCount = 0;
		this.leftAxesIndex =-1;
		this.rightAxesIndex =-1;
		this.bottomAxesIndex =-1;
		this.topAxesIndex = -1;
		// console.log(this.axes);

		for(let i=0; i < this.axes.length; i++){
			if( this.axes[i].position == undefined || this.axes[i].position == 'left'){
				leftAxesCount++;
				this.leftAxesIndex = i;
			}
			if(this.axes[i].position == 'right'){
				rightAxesCount++;
				this.rightAxesIndex =i;
			}
			if(this.axes[i].position == 'bottom'){
				bottomAxesCount++;
				this.bottomAxesIndex =i;
			}
			if(this.axes[i].position == 'top'){
				topAxesCount++;
				this.topAxesIndex =i;
			}
			if(this.axes[i].fontSize == undefined || this.axes[i].fontSize == null){
				this.axes[i].fontSize = 14;
			}
		}
		if(leftAxesCount >1){
			alert('차트의 left 축은 한개만 설정할 수 있습니다.')
		}
		if(rightAxesCount >1){
			alert('차트의 right 축은 한개만 설정할 수 있습니다.')
		}
		if(bottomAxesCount >1){
			alert('차트의 bottom 축은 한개만 설정할 수 있습니다.')
		}
		if(topAxesCount >1){
			alert('차트의 top 축은 한개만 설정할 수 있습니다.')
		}		
		let leftLegendCount = 0;		
		let rightLegendCount = 0;
		let bottomLegendCount = 0;
		let topLegendCount = 0;
		this.leftLegendIndex =-1;
		this.rightLegendIndex =-1;
		this.bottomLegendIndex =-1;
		this.topLegendIndex = -1;
		for(let i=0; i < this.legends.length; i++){
			if(this.legends[i].position == 'left'){
				leftLegendCount++;
				this.leftLegendIndex =i;
			}
			if(this.legends[i].position == 'right'){
				rightLegendCount++;
				this.rightLegendIndex =i;
			}
			if(this.legends[i].position == 'bottom'){
				bottomLegendCount++;
				this.bottomLegendIndex =i;
			}
			if(this.legends[i].position == 'top'){
				topLegendCount++;
				this.topLegendIndex =i;
			}
			if(this.legends[i].fontSize == undefined || this.legends[i].fontSize == null){
				this.legends[i].fontSize = 14;
			}
		}

		if(leftLegendCount >1){
			alert('차트의 left Legend는 한개만 설정할 수 있습니다.')
		}
		if(rightLegendCount >1){
			alert('차트의 right Legend는 한개만 설정할 수 있습니다.')
		}
		if(bottomLegendCount >1){
			alert('차트의 bottom Legend는 한개만 설정할 수 있습니다.')
		}
		if(topLegendCount >1){
			alert('차트의 top Legend는 한개만 설정할 수 있습니다.')
		}

		// 크기계산때문에 모든 legend와 axes 크기는 미리 계산해 놓아야 한다. 
		if(this.leftLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
		}
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
		}
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
		}

		if(this.leftAxesIndex != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}
		}
		if(this.rightAxesIndex != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}
		}
		if(this.topAxesIndex != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}
		}
		if(this.bottomAxesIndex != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}
		}


		//// console.log('columnGap --------------------> ', columnGap);	

		this.titleArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		//this.titleArea.style.backgroundColor = 'yellow';
		this.bottomLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.leftLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.rightLegendArea = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.topAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.leftAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.rightAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.bottomAxesArea = document.createElementNS("http://www.w3.org/2000/svg", "g");


		// title
		if(this.title != undefined){
			this.titleArea.setAttribute('x', 0)
			this.titleArea.setAttribute('y', 0)
			this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.titleElement.textContent = this.title.text;

			if(this.title.height == undefined){
				this.title.height = 30;
			}
			if(this.title.fontSize == undefined){
				this.title.fontSize = 20
			}
			this.titleArea.setAttribute('height', this.title.height)
			this.titleArea.appendChild(this.titleElement);
			this.titleElement.width = this.svgElement.offsetWidth;
			this.titleElement.setAttribute('x', this.element.offsetWidth/2);
			this.titleElement.setAttribute('y', this.title.height/2);
			this.titleElement.setAttribute('text-anchor', 'middle');
			this.titleElement.setAttribute('alignment-baseline', 'middle');
			this.titleElement.setAttribute('font-size', this.title.fontSize);
			if(this.title.storke == undefined){
				this.titleElement.setAttribute('stroke', this.title.stroke);
			}
			if(this.title.fill == undefined){
				this.titleElement.setAttribute('fill', this.title.stroke);
			}
			this.svgElement.append(this.titleArea);				
		}
		// top Legend
		if(this.topLegendIndex != -1){
			if(this.legends[this.topLegendIndex].height == undefined){
				this.legends[this.topLegendIndex].height = 40;
			}
			this.topLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.topLegendIndex].height);
			if(this.title == undefined){
				this.topLegendArea.setAttribute('y', this.area.marginTop );
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			} else {
				this.topLegendArea.setAttribute('y', this.area.marginTop + this.title.height);
				this.topLegendArea.setAttribute('height', this.legends[this.topLegendIndex].height);
			}
			
			this.topLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.topLegendIndex].key;
			let display = this.legends[this.topLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%';//this.topLegendArea.offsetWidth;
			area.style.height = '100%';//this.topLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center; margin-left:3px')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.topLegendIndex].display[i];
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.topLegendArea.append(area);
			this.svgElement.appendChild(this.topLegendArea);
		}		
		if(this.bottomLegendIndex != -1){
			if(this.legends[this.bottomLegendIndex].height == undefined){
				this.legends[this.bottomLegendIndex].height = 40;
			}
			this.bottomLegendArea.setAttribute('x', this.area.marginLeft);
			// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('y', this.element.offsetHeight - this.area.marginBottom - this.legends[this.bottomLegendIndex].height);
			this.bottomLegendArea.setAttribute('width', this.element.offsetWidth)
			this.bottomLegendArea.setAttribute('height', this.legends[this.bottomLegendIndex].height);

			let key = this.legends[this.bottomLegendIndex].key;
			let display = this.legends[this.bottomLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '100%'; //this.bottomLegendArea.offsetWidth;
			area.style.height = '100%'; //this.bottomLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'row';
			area.style.alignItems = 'center';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.bottomLegendIndex].display[i];
				span.setAttribute('style', 'margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.bottomLegendArea.append(area);
			this.svgElement.appendChild(this.bottomLegendArea);
		}
		// left Legend
		if(this.leftLegendIndex != -1){
			if(this.legends[this.leftLegendIndex].width == undefined){
				this.legends[this.leftLegendIndex].width = 100;
			}
			this.leftLegendArea.setAttribute('x', this.area.marginLeft);
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;
			let width = this.legends[this.leftLegendIndex].width

			this.leftLegendArea.setAttribute('y', topPos);
			this.leftLegendArea.setAttribute('height', height);
			this.leftLegendArea.setAttribute('width', width);
			
			//this.leftLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.leftLegendIndex].key;
			let display = this.legends[this.leftLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '98%';//this.leftLegendArea.offsetWidth;
			area.style.height = '98%'; //this.leftLegendArea.offsetHeight;
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:100%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.leftLegendIndex].display[i];
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.leftLegendArea.append(area);
			this.svgElement.appendChild(this.leftLegendArea);
		}	
		// right Legend
		if(this.rightLegendIndex != -1){
			if(this.legends[this.rightLegendIndex].width == undefined){
				this.legends[this.rightLegendIndex].width = 100;
			}
			//// console.log(this.element.offsetHeight, this.area.marginBottom, this.legends[this.leftLegendIndex].height);
			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.legends[this.rightLegendIndex].width;

			let height = bottomPos - topPos;
			let width = this.legends[this.rightLegendIndex].width

			this.rightLegendArea.setAttribute('y', topPos);
			this.rightLegendArea.setAttribute('x', leftPos);

			this.rightLegendArea.setAttribute('height', height + 'px');
			this.rightLegendArea.setAttribute('width', width + 'px');
			
			//this.rightLegendArea.setAttribute('width', this.element.offsetWidth)

			let key = this.legends[this.rightLegendIndex].key;
			let display = this.legends[this.rightLegendIndex].display;
			let area = document.createElement('div');
			area.style.width = '98%'; //this.rightLegendArea.offsetWidth + 'px';
			area.style.height = '98%'; //this.rightLegendArea.offsetHeight + 'px';
			area.style.flex = 1;
			area.style.display ='flex';
			area.style.flexDirection = 'column';
			area.style.alignItems = 'stretch';
			area.style.alignContent = 'center';
			area.style.overflow = 'hidden';
			for(let i=0; i < display.length; i++){

				let div = document.createElement('div');
				div.setAttribute('style','width:100%;display:flex;flex-direction:row;align-items:center;margin-left:3px;margin-top:3px;')
				let rect = document.createElement('div');
				rect.setAttribute('style', 'width:40px;height:25px;background-color:' + this.colors[i]);
				
				let span = document.createElement('span')
				span.innerHTML = this.legends[this.rightLegendIndex].display[i];
				span.setAttribute('style', 'flex:1;margin:0 10px 0 5px');
				div.appendChild(rect);
				div.appendChild(span);
				area.appendChild(div);				
			}
			this.rightLegendArea.append(area);
			this.svgElement.appendChild(this.rightLegendArea);
		}	

		// 각축별로 

		// Left축
		if(this.leftAxesIndex  != -1){
			if(this.axes[this.leftAxesIndex].width == undefined){
				this.axes[this.leftAxesIndex].width = 80;
			}			
			let leftPos = this.area.marginLeft;
			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.leftAxesIndex].width;
			this.axes[this.leftAxesIndex].top = topPos;
			this.axes[this.leftAxesIndex].left = leftPos;
			this.axes[this.leftAxesIndex].height = height;
			this.axes[this.leftAxesIndex].width = width;

			this.leftAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.leftAxesArea);

			// 눈금을 그린다.----------------------------------
			let key = this.axes[this.leftAxesIndex].key;
			let items= [];
			// console.log('>>>', this.data);
			for(let i=0; i< this.data.length; i++){
				let checkExist = false;
				for(let j=0; j < items.length; j++){
					if((this.data[i])[key] == items[j]){
						checkExist = true;
						break;						
					}
				}
				if(checkExist == false){
					items.push((this.data[i])[key])
				}
			}
			// console.log('leftItems', items);
			this.axes[this.leftAxesIndex].list = items;
			//-------------------


			// console.log('data', this.data);
			if(this.axes[this.leftAxesIndex].stroke == undefined){
				this.axes[this.leftAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.leftAxesIndex].labelStroke == undefined){
				this.axes[this.leftAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.leftAxesIndex].labelInterval == undefined){
				this.axes[this.leftAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.leftAxesIndex].labelMargin == undefined){
				this.axes[this.leftAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.leftAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.leftAxesIndex].grid = true;		
			}

			//if(this.axes[this.leftAxesIndex].labelInterval == 'auto'){
				//// console.log('>>', this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].min, this.axes[this.leftAxesIndex].max);
				let labelInfo = this.getGridLabelUnit(this.axes[this.leftAxesIndex].height, this.axes[this.leftAxesIndex].list);
				this.axes[this.leftAxesIndex].labelInfo = labelInfo;
				this.axes[this.leftAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.leftAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('x', this.axes[this.leftAxesIndex].width - this.axes[this.leftAxesIndex].labelMargin);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].pos);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.leftAxesIndex].labelStroke);
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.leftAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.leftAxesIndex].fontSize);
					this.axes[this.leftAxesIndex].labelEl[j].textContent = labelInfo.label[j].text;
					this.leftAxesArea.append(this.axes[this.leftAxesIndex].labelEl[j])
				}
			//}
			this.leftAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.leftAxesLineElement.setAttribute('d',  'M' + this.axes[this.leftAxesIndex].width + ' ' + 0 + 
										' L' + this.axes[this.leftAxesIndex].width + ' ' + this.axes[this.leftAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.leftAxesLineElement.setAttribute('stroke', this.axes[this.leftAxesIndex].stroke);
			this.leftAxesLineElement.setAttribute('fill', 'transparent');
			this.leftAxesArea.append(this.leftAxesLineElement);				

		}
		// Right Axes
		if(this.rightAxesIndex  != -1){
			if(this.axes[this.rightAxesIndex].width == undefined){
				this.axes[this.rightAxesIndex].width = 80;
			}			
			let leftPos = this.element.offsetWidth - this.area.marginRight - this.axes[this.rightAxesIndex].width;
			if(this.rightLegendIndex != -1){
				leftPos -= this.legends[this.rightLegendIndex].width 
			}

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}
			if(this.topAxesIndex !=-1){
				topPos += this.axes[this.topAxesIndex].height;
			}

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			if(this.bottomAxesIndex != -1){
				bottomPos -= this.axes[this.bottomAxesIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = this.axes[this.rightAxesIndex].width;
			this.axes[this.rightAxesIndex].top = topPos;
			this.axes[this.rightAxesIndex].left = leftPos;
			this.axes[this.rightAxesIndex].height = height;
			this.axes[this.rightAxesIndex].width = width;

			this.rightAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.rightAxesArea);

			
			// 눈금을 그린다.----------------------------------
			let key = this.axes[this.rightAxesIndex].key;
			let items= [];
			// console.log('>>>', this.data);
			for(let i=0; i< this.data.length; i++){
				let checkExist = false;
				for(let j=0; j < items.length; j++){
					if((this.data[i])[key] == items[j]){
						checkExist = true;
						break;						
					}
				}
				if(checkExist == false){
					items.push((this.data[i])[key])
				}
			}
			// console.log('leftItems', items);
			this.axes[this.rightAxesIndex].list = items;
			//-------------------

			// console.log('max', this.axes[this.rightAxesIndex].max);
			// console.log('data', this.data);
			if(this.axes[this.rightAxesIndex].stroke == undefined){
				this.axes[this.rightAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.rightAxesIndex].labelStroke == undefined){
				this.axes[this.rightAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.rightAxesIndex].labelInterval == undefined){
				this.axes[this.rightAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.rightAxesIndex].labelMargin == undefined){
				this.axes[this.rightAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.rightAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.rightAxesIndex].grid = true;		
			}

			let labelInfo = this.getGridLabelUnit(this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].list);
			this.axes[this.rightAxesIndex].labelInfo = labelInfo;
			this.axes[this.rightAxesIndex].labelEl = [];
			//// console.log(i, labelInfo.label);
			for(let j=0; j <labelInfo.label.length; j++){
				//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
				this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].width - this.axes[this.rightAxesIndex].labelMargin);
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].pos);// + this.axes[this.leftAxesIndex].top);
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.rightAxesIndex].labelStroke);
				 
				//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
				this.axes[this.rightAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.rightAxesIndex].fontSize);
				this.axes[this.rightAxesIndex].labelEl[j].textContent = labelInfo.label[j].text;
				this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelEl[j])
			}			
			/*
			if(this.axes[this.rightAxesIndex].labelInterval == 'auto'){
				// console.log('>>', this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				let labelInfo = this.getVerticalLabelUnit(this.axes[this.rightAxesIndex].height, this.axes[this.rightAxesIndex].min, this.axes[this.rightAxesIndex].max);
				this.axes[this.rightAxesIndex].labelInfo = labelInfo;
				this.axes[this.rightAxesIndex].labelEl = [];
				//// console.log(i, labelInfo.label);
				for(let j=0; j <labelInfo.label.length; j++){
					// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
					this.axes[this.rightAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('x', this.axes[this.rightAxesIndex].labelMargin);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].y);// + this.axes[this.leftAxesIndex].top);
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('text-anchor', 'start');
					//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
					this.axes[this.rightAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
					this.axes[this.rightAxesIndex].labelEl[j].textContent = labelInfo.label[j].value;
					this.rightAxesArea.append(this.axes[this.rightAxesIndex].labelEl[j])
				}
			}
			*/
			this.rightAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

			this.rightAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + 0 + ' ' + this.axes[this.rightAxesIndex].height);
										//' L' + this.chartArea.left + ' ' + this.chartArea.bottom);
			this.rightAxesLineElement.setAttribute('stroke', this.axes[this.rightAxesIndex].stroke);
			this.rightAxesLineElement.setAttribute('fill', 'transparent');
			this.rightAxesArea.append(this.rightAxesLineElement);		
		}
	
		let dataLength = this.data.length;

		if(this.bottomAxesIndex  != -1){
			if(this.axes[this.bottomAxesIndex].height == undefined){
				this.axes[this.bottomAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.element.offsetHeight - this.area.marginBottom;
			
			if(this.bottomLegendIndex != -1){
				topPos -= this.legends[this.bottomLegendIndex].height;
			}
			
			if(this.bottomAxesIndex !=-1){
				topPos -= this.axes[this.bottomAxesIndex].height;
			}
			

			let bottomPos = this.element.offsetHeight -  this.area.marginBottom;
			if(this.bottomLegendIndex != -1){
				bottomPos -= this.legends[this.bottomLegendIndex].height;
			}
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.bottomAxesIndex].top = topPos;
			this.axes[this.bottomAxesIndex].left = leftPos;
			this.axes[this.bottomAxesIndex].height = height;
			this.axes[this.bottomAxesIndex].width = width;

			/*
			let columnWidth = this.axes[this.bottomAxesIndex].width / dataLength;
			this.axes[this.bottomAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.bottomAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}
			*/

			this.bottomAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.bottomAxesArea);
			// 눈금을 그린다.----------------------------------
			let key = this.axes[this.bottomAxesIndex].key;
			let items= [];
			// console.log('>>>', this.data);
			for(let i=0; i< this.data.length; i++){
				let checkExist = false;
				for(let j=0; j < items.length; j++){
					if((this.data[i])[key] == items[j]){
						checkExist = true;
						break;						
					}
				}
				if(checkExist == false){
					items.push((this.data[i])[key])
				}
			}
			// console.log('bottomItems', items);
			this.axes[this.bottomAxesIndex].list = items;
			//-------------------

			// console.log('data', this.data);
			if(this.axes[this.bottomAxesIndex].stroke == undefined){
				this.axes[this.bottomAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.bottomAxesIndex].labelStroke == undefined){
				this.axes[this.bottomAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.bottomAxesIndex].labelInterval == undefined){
				this.axes[this.bottomAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.bottomAxesIndex].labelMargin == undefined){
				this.axes[this.bottomAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.bottomAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.bottomAxesIndex].grid = true;		
			}

			

			if(this.axes[this.bottomAxesIndex].labelEl == undefined){
				this.axes[this.bottomAxesIndex].labelEl = [];
			}
			
			//let columnGap = Math.floor(100/columnWidth)

			let labelInfo = this.getGridLabelUnit(this.axes[this.bottomAxesIndex].width, this.axes[this.bottomAxesIndex].list);
			this.axes[this.bottomAxesIndex].labelInfo = labelInfo;
			this.axes[this.bottomAxesIndex].labelEl = [];
			// console.log( 'labelInfo-------------->', labelInfo);
			for(let j=0; j <labelInfo.label.length; j++){
				//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
				this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', labelInfo.label[j].pos);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin);// + this.axes[this.leftAxesIndex].top);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.bottomAxesIndex].labelStroke);
				 
				//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.bottomAxesIndex].fontSize);
				this.axes[this.bottomAxesIndex].labelEl[j].textContent = labelInfo.label[j].text;
				this.bottomAxesArea.append(this.axes[this.bottomAxesIndex].labelEl[j])
			}

			/*
			//// console.log('columnGap --------------------> ', columnGap);
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.bottomAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				// console.log(this.axes[this.bottomAxesIndex].axesColumns[j].center);
				// console.log(j, this.axes[this.bottomAxesIndex].axesColumns);
				//debugger;
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('x', this.axes[this.bottomAxesIndex].axesColumns[j].center);
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('y', this.axes[this.bottomAxesIndex].labelMargin );
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.bottomAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
				this.axes[this.bottomAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.bottomAxesIndex].key];
				this.bottomAxesArea.appendChild(this.axes[this.bottomAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.bottomAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			*/
			this.bottomAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.bottomAxesLineElement.setAttribute('d',  'M' + 0 + ' ' + 0 + 
										' L' + this.axes[this.bottomAxesIndex].width + ' ' + 0 );
			this.bottomAxesLineElement.setAttribute('stroke', this.axes[this.bottomAxesIndex].stroke);
			this.bottomAxesLineElement.setAttribute('fill', 'transparent');
			this.bottomAxesArea.append(this.bottomAxesLineElement);		
		}	

		// TopAxes
		if(this.topAxesIndex  != -1){
			if(this.axes[this.topAxesIndex].height == undefined){
				this.axes[this.topAxesIndex].height = 40;
			}			
			let leftPos = this.area.marginLeft;

			if(this.leftLegendIndex != -1){
				leftPos += this.legends[this.leftLegendIndex].width;
			}
			if(this.leftAxesIndex != -1){
				leftPos += this.axes[this.leftAxesIndex].width;
			}
			
			let rightPos = this.element.offsetWidth - this.area.marginLeft

			if(this.rightLegendIndex != -1){
				rightPos -= this.legends[this.rightLegendIndex].width;
			}
			if(this.rightAxesIndex != -1){
				rightPos -= this.axes[this.rightAxesIndex].width;
			}
			

			let topPos = this.area.marginTop;
			if(this.title != undefined){
				topPos += this.title.height;
			}
			if(this.topLegendIndex != -1){
				topPos += this.legends[this.topLegendIndex].height;
			}

			let bottomPos = topPos + this.axes[this.topAxesIndex].height;
			let height = bottomPos - topPos;

			// console.log('확인', bottomPos, topPos)
			let width = rightPos - leftPos;
			this.axes[this.topAxesIndex].top = topPos;
			this.axes[this.topAxesIndex].left = leftPos;
			this.axes[this.topAxesIndex].height = height;
			this.axes[this.topAxesIndex].width = width;

			let columnWidth = this.axes[this.topAxesIndex].width / dataLength;
			//this.axesColumns = [];
			/*
			this.axes[this.topAxesIndex].axesColumns = [];
			for(let i=0; i < dataLength; i++){
				this.axes[this.topAxesIndex].axesColumns[i] ={
					center: i * columnWidth  + columnWidth/2,				
					left: i * columnWidth,
					right: (i+1) * columnWidth,
					leftInner: i * columnWidth + (columnWidth * 0.2),
					rightInner: (i+1) * columnWidth - (columnWidth * 0.2),
				}
			}
			*/
			this.topAxesArea.setAttribute('transform', 'translate(' + leftPos + ' ' + topPos +')');
			this.svgElement.appendChild(this.topAxesArea);
			// 가로 눈금을 그린다.----------------------------------
			// 눈금을 그린다.----------------------------------
			let key = this.axes[this.bottomAxesIndex].key;
			let items= [];
			// console.log('>>>', this.data);
			for(let i=0; i< this.data.length; i++){
				let checkExist = false;
				for(let j=0; j < items.length; j++){
					if((this.data[i])[key] == items[j]){
						checkExist = true;
						break;						
					}
				}
				if(checkExist == false){
					items.push((this.data[i])[key])
				}
			}
			// console.log('leftItems', items);
			this.axes[this.bottomAxesIndex].list = items;
			//-------------------

			// console.log('data', this.data);
			if(this.axes[this.topAxesIndex].stroke == undefined){
				this.axes[this.topAxesIndex].stroke = 'darkgray';
			}
			if(this.axes[this.topAxesIndex].labelStroke == undefined){
				this.axes[this.topAxesIndex].labelStroke = 'var(--colorStroke)';
			}
			if(this.axes[this.topAxesIndex].labelInterval == undefined){
				this.axes[this.topAxesIndex].labelInterval = 'auto';
			}
			if(this.axes[this.topAxesIndex].labelMargin == undefined){
				this.axes[this.topAxesIndex].labelMargin = 5;
			}
			if(this.axes[this.topAxesIndex].grid == undefined){		// grid는 area  ?? 두군데면 ??
				this.axes[this.topAxesIndex].grid = true;		
			}

			


			if(this.axes[this.topAxesIndex].labelEl == undefined){
				this.axes[this.topAxesIndex].labelEl = [];
			}
			//let columnGap = Math.floor(100/columnWidth)

			
			let labelInfo = this.getGridLabelUnit(this.axes[this.topAxesIndex].width, this.axes[this.topAxesIndex].list);
			this.axes[this.topAxesIndex].labelInfo = labelInfo;
			this.axes[this.topAxesIndex].labelEl = [];
			//// console.log(i, labelInfo.label);
			for(let j=0; j <labelInfo.label.length; j++){
				//// console.log('labelInfo.label[j].y', labelInfo.label[j].y)
				this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', this.axes[this.topAxesIndex].width - this.axes[this.topAxesIndex].labelMargin);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', labelInfo.label[j].pos);// + this.axes[this.leftAxesIndex].top);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'end');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('fill', this.axes[this.topAxesIndex].labelStroke);
				
				//this.axes[i].labelEl[j].setAttribute('stroke', 'red');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'middle');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('font-size', this.axes[this.topAxesIndex].fontSize);
				this.axes[this.topAxesIndex].labelEl[j].textContent = labelInfo.label[j].text;
				this.topAxesArea.append(this.axes[this.topAxesIndex].labelEl[j])
			}
			/*
			for(let j = 0; j < this.data.length; j++){
				this.axes[this.topAxesIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('x', this.axes[this.topAxesIndex].axesColumns[j].center);
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('y', this.axes[this.topAxesIndex].height - this.axes[this.topAxesIndex].labelMargin );
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('text-anchor', 'middle');
				this.axes[this.topAxesIndex].labelEl[j].setAttribute('alignment-baseline', 'base-line');
				this.axes[this.topAxesIndex].labelEl[j].textContent = (this.data[j])[this.axes[this.topAxesIndex].key];
				this.topAxesArea.appendChild(this.axes[this.topAxesIndex].labelEl[j])	

				//let rect = this.axes[this.bottomAxesIndex].labelEl[j].getClientRects();
				//// console.log('rect', rect);
				//if(columnWidth /rect)
				if(j % columnGap != 0){
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'hidden';
				} else {
					this.axes[this.topAxesIndex].labelEl[j].style.visibility = 'visible';
				}
			}
			*/
			this.topAxesLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.topAxesLineElement.setAttribute('d',  'M 0 ' + this.axes[this.topAxesIndex].height + 
										' L' + this.axes[this.topAxesIndex].width + ' ' + this.axes[this.topAxesIndex].height );
			this.topAxesLineElement.setAttribute('stroke', this.axes[this.topAxesIndex].stroke);
			this.topAxesLineElement.setAttribute('fill', 'transparent');
			this.topAxesArea.append(this.topAxesLineElement);		
		}				



		// -------------- chart ---------------------------------
		this.charts = this.option.charts;
		this.chartAreaElements = [];

		let chartAreaTop  = this.area.marginTop;
		if(this.title != undefined){
			chartAreaTop += this.title.height;
		}
		if(this.topLegendIndex != -1){
			chartAreaTop += this.legends[this.topLegendIndex].height;
		}
		if(this.topAxesIndex != -1){
			chartAreaTop += this.axes[this.topAxesIndex].height;
		}

		let chartAreaBottom  = this.element.offsetHeight - this.area.marginBottom;
		if(this.bottomLegendIndex != -1){
			chartAreaBottom -= this.legends[this.bottomLegendIndex].height;
		}
		if(this.bottomAxesIndex != -1){
			chartAreaBottom -= this.axes[this.bottomAxesIndex].height;
		}

		let chartAreaLeft  = this.area.marginLeft;
		if(this.leftLegendIndex != -1){
			chartAreaLeft += this.legends[this.leftLegendIndex].width;
		}
		if(this.leftAxesIndex != -1){
			chartAreaLeft += this.axes[this.leftAxesIndex].width;
		}

		let chartAreaRight  = this.element.offsetWidth - this.area.marginRight;
		if(this.rightLegendIndex != -1){
			chartAreaRight -= this.legends[this.rightLegendIndex].width;
		}
		if(this.rightAxesIndex != -1){
			chartAreaRight -= this.axes[this.rightAxesIndex].width;
		}


		for(let i=0; i < this.charts.length ; i++){
			this.charts[i].top = chartAreaTop;
			this.charts[i].left = chartAreaLeft;
			this.charts[i].bottom = chartAreaBottom;
			this.charts[i].right = chartAreaRight;
			this.charts[i].width = chartAreaRight - chartAreaLeft;
			this.charts[i].height = chartAreaBottom - chartAreaTop;

			if(this.charts[i].textPosition == undefined){
				this.charts[i].textPosition = 'out';
			}

			//this.charts[i].axesIndex

			if(i==0){
				let columnWidth = this.charts[i].width / dataLength;
				this.columns = [];
				for(let j=0; j < dataLength; j++){
					this.columns[j] ={
						center: j * columnWidth  + columnWidth/2,				
						left: j * columnWidth,
						right: (j+1) * columnWidth,
						leftInner: j * columnWidth + (columnWidth * 0.2),
						rightInner: (j+1) * columnWidth - (columnWidth * 0.2),
					}
				}		
			}

			this.chartAreaElements[i] = document.createElementNS("http://www.w3.org/2000/svg", "g");
			this.chartAreaElements[i] .setAttribute('transform', 'translate(' + this.charts[i].left + ' ' + this.charts[i].top +')');
			this.svgElement.appendChild(this.chartAreaElements[i] );
			if(this.charts[i].verticalAxesPosition == undefined || this.charts[i].verticalAxesPosition == null){				
				for(let j=0; j < this.axes.length; j++){					
					if(this.axes[j].position == 'left'){
						this.charts[i].verticalAxesPosition = 'left';
					} else if(this.axes[j].position == 'right'){
						this.charts[i].verticalAxesPosition = 'right';
					}
				}
			}
			if(this.charts[i].horizontalAxesPosition == undefined || this.charts[i].horizontalAxesPosition == null){				
				for(let j=0; j < this.axes.length; j++){					
					if(this.axes[j].position == 'bottom'){
						this.charts[i].horizontalAxesPosition = 'bottom';
					} else if(this.axes[j].position == 'top'){
						this.charts[i].horizontalAxesPosition = 'top';
					}
				}
			}
			
			for(let j=0; j < this.axes.length; j++){
				if(this.axes[j].position == this.charts[i].horizontalAxesPosition){
					this.charts[i].horizontalAxesIndex = j;
					break;
				}
			}			
			for(let j=0; j < this.axes.length; j++){
				if(this.axes[j].position == this.charts[i].verticalAxesPosition){
					this.charts[i].verticalAxesIndex = j;
					break;
				}
			}			
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
			if(this.charts[i].grid == undefined){
				this.charts[i].grid = true;
			}

			/* 일단주석
			if(this.charts[i].grid == true){
				// console.log(this.charts[i].verticalAxesIndex);
				// console.log(this.axes[this.charts[i].verticalAxesIndex]);
				let labelInfo = this.axes[this.charts[i].verticalAxesIndex].labelInfo;
				for(let j=0; j < labelInfo.label.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M 0 ' + labelInfo.label[j].y + ' L' + this.charts[i].width + ' ' + labelInfo.label[j].y);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}


			if(this.charts[i].gridColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].center + ' ' + '0' + ' L' + this.columns[j].center + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}						
			if(this.charts[i].gridBoundColumn == true){
				for(let j=0; j < this.data.length; j++){
					let gridElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					gridElement.setAttribute('d', 'M '+ this.columns[j].right + ' ' + '0' + ' L' + this.columns[j].right + ' ' + this.charts[i].height);
					gridElement.setAttribute('stroke', 'darkgray');
					gridElement.setAttribute('stroke-width', '0.5');
					this.chartAreaElements[i].append(gridElement);		
					// console.log(gridElement);
				}
			}	
			*/
			if(this.charts[i].type == 'heat'){
				this.charts[i].barTextElement = [];
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let gridInfo =  this.getGridColor(value, this.charts[i]);
					// console.log('gridInfo------------->', gridInfo);
					let color = gridInfo.color;
					let colorIndex = gridInfo.index;
					let verticalKey = this.axes[this.charts[i].verticalAxesIndex].key;
					let horizontalKey = this.axes[this.charts[i].horizontalAxesIndex].key;
					let verticalIndex = -1;
					for(let k=0; k < this.axes[this.charts[i].verticalAxesIndex].list.length; k++){
						if( (this.data[j])[verticalKey] == this.axes[this.charts[i].verticalAxesIndex].list[k]){
							verticalIndex = k;
							break;
						}
					}
					let top = this.axes[this.charts[i].verticalAxesIndex].labelInfo.label[verticalIndex].startPos;
					let bottom = this.axes[this.charts[i].verticalAxesIndex].labelInfo.label[verticalIndex].endPos;

					let horizontalIndex = -1;
					for(let k=0; k < this.axes[this.charts[i].horizontalAxesIndex].list.length; k++){
						if( (this.data[j])[horizontalKey] == this.axes[this.charts[i].horizontalAxesIndex].list[k]){
							horizontalIndex = k;
							break;
						}
					}
					let left = this.axes[this.charts[i].horizontalAxesIndex].labelInfo.label[horizontalIndex].startPos;
					let right = this.axes[this.charts[i].horizontalAxesIndex].labelInfo.label[horizontalIndex].endPos;

					// console.log('left, right, top, bottom', left, right, top, bottom);



					//let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					barElement.setAttribute('d', 
						'M' + left + ' ' +  top + ' ' + 
						'L' + right + ' ' + top + ' ' + 
						'L' + right + ' ' + bottom + ' ' + 
						'L' + left + ' ' + bottom + 'Z');
					
					barElement.setAttribute('fill', color); 

					this.chartAreaElements[i].append(barElement);
					/*
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'darkgray';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					*/
				}
			} else if(this.charts[i].type == 'stock'){
				this.charts[i].barTextElement = [];
				for(let j=0; j < this.data.length; j++){
					let startValue= (this.data[j])[this.charts[i].startKey];
					let startH = this.getAxesHeight(this.charts[i].axesIndex, startValue);
					let endValue= (this.data[j])[this.charts[i].endKey];
					let endH = this.getAxesHeight(this.charts[i].axesIndex, endValue);
					let highValue= (this.data[j])[this.charts[i].highKey];
					let highH = this.getAxesHeight(this.charts[i].axesIndex, highValue);
					let lowValue= (this.data[j])[this.charts[i].lowKey];
					let lowH = this.getAxesHeight(this.charts[i].axesIndex, lowValue);

					let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					lineElement.setAttribute('d', 
						'M' + this.columns[j].center + ' ' + (this.charts[i].height - highH) + ' ' +	
						'L' + this.columns[j].center + ' ' + (this.charts[i].height - lowH));
					this.chartAreaElements[i].append(lineElement);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);

					barElement.setAttribute('d', 
					'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * startH))  + ' ' + 
					'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - endH) + ' ' + 
					'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - endH)+ ' ' + 
					'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * startH)) + 'Z');
					
					if( startValue <= endValue){
						barElement.setAttribute('fill', this.charts[i].upColor); 
						lineElement.setAttribute('stroke', this.charts[i].upColor); 
					} else {
						barElement.setAttribute('fill', this.charts[i].downColor); 
						lineElement.setAttribute('stroke', this.charts[i].downColor); 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					/*
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}							
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'darkgray';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					*/
				}
			} else if(this.charts[i].type == 'column'){
				this.charts[i].barTextElement = [];
				// 초기화.
				let totalColumnCount = 0;
				for(let j=0; j < this.charts.length; j++){
					if(this.charts[j].type == 'column'){
						totalColumnCount++;
					}
				}
				let columnCount = 0;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'column'){
						columnCount++;
					}
				}
				

				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
						let gap = (this.columns[j].rightInner -this.columns[j].leftInner)/totalColumnCount;
						barElement.setAttribute('d', 
						'M' + (this.columns[j].leftInner + gap * columnCount) + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
						'L' + (this.columns[j].leftInner + gap * columnCount) + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
					/*} else {
						barElement.setAttribute('d', 
						'M' + (this.columns[j].leftInner + gap * columnCount) + ' ' + this.charts[i].height   + ' ' + 
						'L' + (this.columns[j].leftInner + gap * columnCount) + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + (this.columns[j].leftInner + gap * (columnCount+1)) + ' ' + this.charts[i].height  + 'Z');
					}
					*/
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						//let gap = (this.columns[j].rightInner -this.columns[j].leftInner)/totalColumnCount;

						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('x', ((this.columns[j].leftInner + gap * columnCount) + (this.columns[j].leftInner + (gap) * (columnCount+1)))/2);
						
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}				
			} else if(this.charts[i].type == 'stack'){
				this.charts[i].barTextElement = [];
				// 초기화.
				let checkFirstStack = true;
				for(let j=0; j < i; j++){
					if(this.charts[j].type == 'stack'){
						checkFirstStack = false;						
					}
				}				
				if(checkFirstStack == true){
					this.stackDataSize = [];
					//let initH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					for(let j=0; j < this.data.length; j++){
						this.stackDataSize[j] = 0;
					}
				}
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key] + this.stackDataSize[j];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
					//if(this.axes[this.charts[i].axesIndex].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, this.stackDataSize[j]);
						//let zeroH = this.stackDataSize[j];
						barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
						'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
					/*} else {
						let zeroH = this.getAxesHeight(this.charts[i].axesIndex, this.stackDataSize[j]);
						barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' + this.charts[i].height   + (-1 * zeroH) + ' ' + 
						'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
						'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
						'L' + this.columns[j].rightInner + ' ' + this.charts[i].height  + (-1 * zeroH) + 'Z');
					}
					*/
					this.stackDataSize[j] = value;
					if( this.charts[i].fill == undefined){
						barElement.setAttribute('fill', this.getColors(i)); 
					} else {
						barElement.setAttribute('fill', this.charts[i].fill) 
					}
					if(this.charts[i].opacity != undefined){
						barElement.setAttribute('opacity', this.charts[i].opacity);
					}

					this.chartAreaElements[i].append(barElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}				
				/*
				this.charts[i].barTextElement = [];
				let stackKeyArray = [];
				for(let j=0; j < this.data.length; j++){
					if(j == 0){
						stackKeyArray.push( (this.data[j])[this.option.stackKey]);
						stackKeyArray[stackKeyArray.length-1].list = [];
						stackKeyArray[stackKeyArray.length-1].list.push(this.data[j])
					} else {
						if((this.data[j])[this.option.stackKey] != (this.data[j-1])[this.option.stackKey]){
							stackKeyArray.push( (this.data[j])[this.option.stackKey]);
							stackKeyArray[stackKeyArray.length-1].list = [];
							stackKeyArray[stackKeyArray.length-1].list.push(this.data[j]);
						} else {
							stackKeyArray[stackKeyArray.length-1].list.push(this.data[j]);
						}
					}
				}
				// console.log('stackKeyArray', stackKeyArray);

				for(let j=0; j < stackKeyArray.length; j++){
					for(let k=0; k < stackKeyArray[j].list.length; k++){
						//if((this.data[j])[this.option.stackKey] != (this.data[j-1])[this.option.stackKey]){}
						let value= (stackKeyArray[j].list[k])[this.charts[i].key];
						let h = this.getAxesHeight(this.charts[i].axesIndex, value);
						let barElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
						if(this.axes[this.charts[i].axesIndex].min < 0){
							let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
							barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' +  (this.charts[i].height  + (-1 * zeroH))  + ' ' + 
							'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z');
						} else {
							barElement.setAttribute('d', 'M' + this.columns[j].leftInner + ' ' + this.charts[i].height   + ' ' + 
							'L' + this.columns[j].leftInner + ' ' + (this.charts[i].height - h) + ' ' + 
							'L' + this.columns[j].rightInner + ' ' + (this.charts[i].height - h)+ ' ' + 
							'L' + this.columns[j].rightInner + ' ' + this.charts[i].height  + 'Z');
						}
						if( this.charts[i].fill == undefined){
							barElement.setAttribute('fill', this.getColors(i)); 
						} else {
							barElement.setAttribute('fill', this.charts[i].fill) 
						}
						if(this.charts[i].opacity != undefined){
							barElement.setAttribute('opacity', this.charts[i].opacity);
						}

						this.chartAreaElements[i].append(barElement);
						this.charts[i].chartTextElement = [];
						if(this.charts[i].text != undefined){						
							if(this.charts[i].textInterval == undefined){
								this.charts[i].textInterval = 5;
							}
							this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
							this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
							if(this.charts[i].textPosition == 'in'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'white';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							} else {
								if(this.charts[i].textPosition == 'out'){
									if(this.charts[i].textFill == undefined){
										this.charts[i].textFill = 'darkgray';
									}
									if(value >= 0){
										this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
										this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
									} else {
										this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
										this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

									}
									this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
								}
							}
							this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
							this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
						}
					}
				}	
				*/			
			} else if(this.charts[i].type == 'line'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', 'transparent') 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;


				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (this.data[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (this.data[j-2])[this.charts[i].key];
							}
							let curValue = (this.data[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < this.data.length-1){
								nextValue = (this.data[j+1])[this.charts[i].key];
							}
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(this.charts[i].axesIndex, bfValue);
								posYBf = (this.charts[i].height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(this.charts[i].axesIndex, bfBfValue);
								posYBfBf = (this.charts[i].height - hBfBf);
							}
							if(j < this.data.length -1){
								hAf = this.getAxesHeight(this.charts[i].axesIndex, nextValue);
								posYAf = (this.charts[i].height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						
						if(j == 0){
							d = 'M' + this.columns[j].center + ' ' + (this.charts[i].height - h) + ' ';
						} else {
							d = d + 'L' + this.columns[j].center  + ' ' + (this.charts[i].height - h) + ' ';
						}
					}
					lineElement.setAttribute('d', d);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					this.chartAreaElements[i].append(lineElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							if(value >= 0){
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							} else {
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							}
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								if(value >= 0){
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								} else {
									this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h + this.charts[i].textInterval) );
									this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');

								}
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
				lineElement.setAttribute('d', d);
			} else if(this.charts[i].type == 'area'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill) 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;


				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (this.data[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (this.data[j-2])[this.charts[i].key];
							}
							let curValue = (this.data[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < this.data.length-1){
								nextValue = (this.data[j+1])[this.charts[i].key];
							}
							let posX = (this.columns[j].center);
							let posY = (this.charts[i].height - h) ;
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(this.charts[i].axesIndex, bfValue);
								posYBf = (this.charts[i].height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(this.charts[i].axesIndex, bfBfValue);
								posYBfBf = (this.charts[i].height - hBfBf);
							}
							if(j < this.data.length -1){
								hAf = this.getAxesHeight(this.charts[i].axesIndex, nextValue);
								posYAf = (this.charts[i].height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						
						if(j == 0){
							d = 'M' + this.columns[j].center + ' ' + (this.charts[i].height - h) + ' ';
						} else {
							d = d + 'L' + this.columns[j].center  + ' ' + (this.charts[i].height - h) + ' ';
						}
					}	


					lineElement.setAttribute('d', d);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					this.chartAreaElements[i].append(lineElement);
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
				}
				if(this.axes[this.charts[i].axesIndex].min < 0){
					let zeroH = this.getAxesHeight(this.charts[i].axesIndex, 0);
					d = d + 'L' + this.columns[this.columns.length-1].center + ' ' + (this.charts[i].height  + (-1 * zeroH)) + ' ' + 
							'L' + this.columns[0].center + ' ' + (this.charts[i].height  + (-1 * zeroH)) + 'Z'; 
				} else {
					d = d + 'L' + this.columns[this.columns.length-1].center + ' ' + this.columns[j].height + ' ' + 
							'L' + this.columns[0].center + ' ' + this.columns[j].height + 'Z'; 
				}
				lineElement.setAttribute('d', d);
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} else if(this.charts[i].type == 'scatter'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill)
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;
				let interval = this.charts[i].width/ this.data.length;
				if(this.charts[i].stroke == undefined){
					this.charts[i].stroke = this.getColors(i);
				}
				if(this.charts[i].fill == undefined){
					this.charts[i].fill = this.getColors(i);
				}
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 
					let dotElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					dotElement.setAttribute('cx', this.columns[j].center);
					dotElement.setAttribute('cy', this.charts[i].height -h);
					dotElement.setAttribute('r', 3);
					dotElement.setAttribute('fill', this.charts[i].fill) 
					dotElement.setAttribute('stroke', this.charts[i].stroke) 
					dotElement.setAttribute('opacity', this.charts[i].opacity) 
					dotElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
			
					this.chartAreaElements[i].append(dotElement);
					
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 10;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
								this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					
				}
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} else if(this.charts[i].type == 'bubble'){
				let lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				lineElement.setAttribute('fill', this.charts[i].fill) 
				lineElement.setAttribute('stroke', this.charts[i].stroke) 
				lineElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				//this.svgElement.append(lineElement);
				
				let posXBf = null;
				let posYBf = null;
				let radiusMin = 0;
				let radiusMax = 0;
				for(let j=0; j < this.data.length; j++){
					let r = (this.data[j])[this.charts[i].sizeKey];
					if(j==0){
						radiusMin = r;
						radiusMax = r;
					} else {
						if(r < radiusMin){
							radiusMin = r;
						}
						if(r > radiusMax){
							radiusMax = r;
						}
					}
				}
				let rangeTemp = (radiusMax - radiusMin) ;


				if(this.charts[i].minSize == undefined){
					this.charts[i].minSize = 1;
				}
				if(this.charts[i].maxSize == undefined){
					this.charts[i].maxSize = 10;
				}
				// console.log('minSize', this.charts[i].minSize);
				// console.log('maxSize', this.charts[i].maxSize);
				// console.log('radiusMax', radiusMax, radiusMin);

				let interval = this.charts[i].width/ this.data.length;
				for(let j=0; j < this.data.length; j++){
					let value= (this.data[j])[this.charts[i].key];
					let h = this.getAxesHeight(this.charts[i].axesIndex, value);
					let r = (this.data[j])[this.charts[i].sizeKey];
					let sizeR = r / rangeTemp * (this.charts[i].maxSize - this.charts[i].minSize);
					// console.log(r , rangeTemp , (this.charts[i].maxSize - this.charts[i].minSize));
					// console.log('sizeR---------------->', sizeR);
					//let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 
					let dotElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					dotElement.setAttribute('cx', this.columns[j].center);
					dotElement.setAttribute('cy', this.charts[i].height -h);
					dotElement.setAttribute('r', sizeR);
					dotElement.setAttribute('fill', this.charts[i].fill) 
					dotElement.setAttribute('stroke', this.charts[i].stroke) 
					dotElement.setAttribute('opacity', this.charts[i].opacity) 
					dotElement.setAttribute('stroke-width', this.charts[i].strokeWidth) 
			
					this.chartAreaElements[i].append(dotElement);
					
					this.charts[i].chartTextElement = [];
					if(this.charts[i].text != undefined){						
						if(this.charts[i].textInterval == undefined){
							this.charts[i].textInterval = 5;
						}
						this.charts[i].chartTextElement[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].chartTextElement[j].setAttribute('x', this.columns[j].center);
						this.charts[i].chartTextElement[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.chart[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						} else if(this.charts[i].textPosition == 'out'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h - this.charts[i].textInterval) );
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						
						} else {
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].chartTextElement[j].setAttribute('y', (this.charts[i].height - h));
							this.charts[i].chartTextElement[j].setAttribute('alignment-baseline', 'base-line');
							this.charts[i].chartTextElement[j].setAttribute('fill', this.charts[i].textFill);
						
						}
						this.charts[i].chartTextElement[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].chartTextElement[j].textContent = (this.data[j])[this.charts[i].text];
						this.chartAreaElements[i].append(this.charts[i].chartTextElement[j])
					}
					
				}
				if(this.charts[i].opacity != undefined){
					lineElement.setAttribute('opacity', this.charts[i].opacity);
				}
			} 							 	
			this.svgElement.appendChild(this.chartAreaElements[i]);	
		}
	}
	setData(data){
		this.data = data;

		

		this.draw();
	}
	drawData(){
		let list = this.data;
		let interval = this.chartArea.width/ list.length;
		// console.log('interval', interval);
		this.charts = this.option.charts;
		let isBar = false;
		for(let i=0; i < this.option.charts.length; i++){
			if(this.charts[i].type == 'bar'){	// bar와  line이 같이 존재한다면 바 중심으로 세로축을 잡는다.
				isBar = true;
			}
			if(this.charts[i].fill == undefined){
				this.charts[i].fill = '#515EAC';
			}
			if(this.charts[i].strokeWidth == undefined){
				this.charts[i].strokeWidth = 3
			}
			if(this.charts[i].stroke == undefined){
				this.charts[i].stroke = '#515EAC'
			}
		}
		
		for(let i=0; i < this.charts.length; i++){
			if(this.charts[i].type == 'bar'){
				this.charts[i].barTextEl = [];
				if(this.charts[i].followPosition == undefined || this.charts[i].followPosition == null){
					this.charts[i].followPosition = 'left';					
				}
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.15) ;
					let w = interval * 0.7;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					let bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
					if(this.axes[i].min < 0){
						let zeroH = this.getAxesHeight(this.charts[i].followIndex, 0);
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - zeroH) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 

					} else {
						bar.setAttribute('d', 'M' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y)  + ' ' + 
						'L' + (x + this.area.marginLeft + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginTop + this.chartArea.height - h)+ ' ' + 
						'L' + (x + w + this.area.marginRight + this.axes[i].width) + ' ' + (this.area.marginBottom + this.chartArea.height - y) + 'Z');
						bar.setAttribute('fill', this.charts[i].fill) 						
					}
					this.svgElement.append(bar);
				

					// console.log('bar',bar);

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'white';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'darkgray';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							if(this.axes[selectedBottomIndex].labelEl == undefined){
								this.axes[selectedBottomIndex].labelEl = [];
							}
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', 'var(--colorStroke)');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize );
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
		
						}
					}
					
				}
			} else if(this.charts[i].type == 'line'){
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', 'transparent') 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let posXBf = null;
				let posYBf = null;
				for(let j=0; j < this.axes.length; j++){
					if(this.axes[j].position == this.charts[i].followPosition){
						this.charts[i].followIndex = j;
						break;
					}
				}
				for(let j=0; j < list.length; j++){
					let value= (list[j])[this.charts[i].key];
					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					let y = 0;
					let h = this.getAxesHeight(this.charts[i].followIndex, value);
					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
		
						if(selectedBottomIndex != -1){
							
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', 'var(--colorStroke)');							
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize );
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
		
		
						}
					}
					
				}
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'area'){
				this.charts[i].barTextEl = [];
				// console.log(list);
				
				let chartEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = '';
				chartEl.setAttribute('fill', this.charts[i].fill) 
				chartEl.setAttribute('stroke', this.charts[i].stroke) 
				chartEl.setAttribute('opacity', this.charts[i].opacity) 
				chartEl.setAttribute('stroke-width', this.charts[i].strokeWidth) 
				this.svgElement.append(chartEl);
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;				
				for(let j=0; j < list.length; j++){
					
					let value= (list[j])[this.charts[i].key];

					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value);
					let h = this.getAxesHeight(i, value);



					if(this.charts[i].curve == true){
						if(j == 0){
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h) ;
							d = 'M' + posX + ' ' + posY + ' ';
							posXBf = posX;
							posYBf = posY;
						} else {
							let bfValue = (list[j-1])[this.charts[i].key];
							let bfBfValue = bfValue;
							if(j > 1){
								bfBfValue = (list[j-2])[this.charts[i].key];
							}
							let curValue = (list[j])[this.charts[i].key];
							let nextValue = curValue;
							if(j < list.length-1){
								nextValue = (list[j+1])[this.charts[i].key];
							}
							let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
							let posY = (this.area.marginTop + this.chartArea.height - h);
							let posYAf = posY;
							let hAf = h; 
							let hBf = h;
							if( j > 0){
								hBf = this.getAxesHeight(i, bfValue);
								posYBf = (this.area.marginTop + this.chartArea.height - hBf);
							}
							let hBfBf = hBf;
							let posYBfBf = posYBf;
							if(j > 1){
								hBfBf = this.getAxesHeight(i, bfBfValue);
								posYBfBf = (this.area.marginTop + this.chartArea.height - hBfBf);
							}
							if(j < list.length -1){
								hAf = this.getAxesHeight(i, nextValue);
								posYAf = (this.area.marginTop + this.chartArea.height - hAf);
							}
							let bfGap = hBf - hBfBf;
							let currGap = h - hBf;
							let afGap = hAf - h;
							let m1 = 1 * (posY - posYBfBf )/8;
							let m2 = 1 * (posYAf - posYBf)/ 8;
							let posYM1 = m1 * 1 + posYBf;
							let posYM2 = m2 * -1 + posY;
							let posXM1 = posXBf + w/3;
							let posXM2 = posX - w/3;
							if(currGap >=0  && bfGap <=0){
								posYM1= posYBf;
							} else if(currGap <= 0 && bfGap >=0){
								posYM1 = posYBf;
							} 
							if(currGap >=0  && afGap <= 0){
								posYM2= posY;
							} else if(currGap <= 0 && afGap >= 0){
								posYM2= posY;
							}
							d = d + 'C' + posXM1  + ',' + posYM1 + ' ' + posXM2  + ',' + posYM2 + ' ' + posX + ',' + posY + ' ';
							// console.log('d', d);
							posXBf = posX;
							posYBf = posY;

						}
					} else {					
						if(j == 0){
							d = 'M' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						} else {
							d = d+ 'L' + (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap) + ' ' + (this.area.marginTop + this.chartArea.height - h) + ' ';
						}
					}
					if(j == list.length -1){
						lastPosX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
						lastPosY = (this.area.marginTop + this.chartArea.height - h)
					}

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){
						
						this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextEl[j].setAttribute('x', labelX);
						this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textPosition == 'in'){
							if(this.charts[i].textFill == undefined){
								this.charts[i].textFill = 'var(--colorStroke)';
							}
							this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
							this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
						} else {
							if(this.charts[i].textPosition == 'out'){
								if(this.charts[i].textFill == undefined){
									this.charts[i].textFill = 'var(--colorStroke)';
								}
								this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
								this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
								this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
							}
						}
						this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize );
						this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextEl[j])
					}
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', 'var(--colorStroke)');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
				d = d + 'L' + (lastPosX) + ' ' + (this.chartArea.bottom) + ' ' + 
						'L' + (this.area.marginLeft + this.axes[i].width + interval * 0.8/ 2 + (interval * 0.1) ) +  ' ' + (this.chartArea.bottom) + 'Z ' ;
				chartEl.setAttribute('d', d);
			} else if(this.charts[i].type == 'bubble'){
				this.charts[i].barTextEl = [];
				this.charts[i].barTextBackEl = [];
				// console.log(list);
				
				
				let lastPosX = 0;
				let lastPosY = 0;
				let posXBf = null;
				let posYBf = null;		
				this.chartEl =[];
				for(let j=0; j < list.length; j++){
					

					// console.log('>>>', j, this.charts[i].radius)
					let value= (list[j])[this.charts[i].key];
					let radius= (list[j])[this.charts[i].radius];



					let x = j * interval + (interval * 0.1) ;
					let w = interval * 0.8;
					let colPosGap = 0;
					//if(isBar == false){
					//colPosGap = interval/2;
					//}
					let y = 0;
					// console.log('value', value, 'radius', radius);
					let h = this.getAxesHeight(i, value);

					let posX = (x + this.area.marginLeft + this.axes[i].width + w/2 - colPosGap);
					let posY = (this.area.marginTop + this.chartArea.height - h) ;
					this.chartEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					this.chartEl[j].setAttribute('cx', posX);
					this.chartEl[j].setAttribute('cy', posY);
					this.chartEl[j].setAttribute('r', radius);
					this.chartEl[j].setAttribute('fill', this.charts[i].fill) 
					this.chartEl[j].setAttribute('stroke', this.charts[i].stroke) 
					this.chartEl[j].setAttribute('opacity', this.charts[i].opacity) 
					this.chartEl[j].setAttribute('stroke-width', this.charts[i].strokeWidth) 
					this.svgElement.append(this.chartEl[j]);
	
					

					let labelX = (x + w/2 + this.area.margin + this.axes[i].width - colPosGap); 

					if(this.charts[i].text != undefined){

						this.charts[i].barTextBackEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.charts[i].barTextBackEl[j].setAttribute('x', labelX);
						this.charts[i].barTextBackEl[j].setAttribute('text-anchor', 'middle');
						if(this.charts[i].textFill == undefined){
							this.charts[i].textFill = 'var(--colorStroke)';
						}
						if(this.charts[i].textStroke == undefined){
							this.charts[i].textStroke = 'var(--colorStroke)';
						}
						if(this.charts[i].textStrokeWidth == undefined){
							this.charts[i].textStrokeWidth = '4';
						}
						this.charts[i].barTextBackEl[j].setAttribute('stroke-width', this.charts[i].textStrokeWidth);
						this.charts[i].barTextBackEl[j].setAttribute('fill', this.charts[i].textFill);
						this.charts[i].barTextBackEl[j].setAttribute('stroke', this.charts[i].textStroke);
						if(this.charts[i].textPosition == 'in'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'hanging');
						} else if(this.charts[i].textPosition == 'out'){
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'base-line');
						} else {
							this.charts[i].barTextBackEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
							this.charts[i].barTextBackEl[j].setAttribute('alignment-baseline', 'middle');
						}
						this.charts[i].barTextBackEl[j].setAttribute('font-size', this.charts[i].fontSize);
						this.charts[i].barTextBackEl[j].textContent = (list[j])[this.charts[i].text];
						this.svgElement.append(this.charts[i].barTextBackEl[j])
					}


					this.charts[i].barTextEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.charts[i].barTextEl[j].setAttribute('x', labelX);
					this.charts[i].barTextEl[j].setAttribute('text-anchor', 'middle');
					if(this.charts[i].textFill == undefined){
						this.charts[i].textFill = '#888';
					}
					if(this.charts[i].textStroke == undefined){
						this.charts[i].textStroke = 'white';
					}
					//if(this.charts[i].textStrokeWidth == undefined){
					//	this.charts[i].textStrokeWidth = '2';
					//}
					this.charts[i].barTextEl[j].setAttribute('fill', this.charts[i].textFill);
					this.charts[i].barTextEl[j].setAttribute('stroke-width', '0');
					// console.log('1j', i, j);
					if(this.charts[i].textPosition == 'in'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h + 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'hanging');
					} else if(this.charts[i].textPosition == 'out'){
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h - 5) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'base-line');
					} else {
						this.charts[i].barTextEl[j].setAttribute('y', (this.area.margin + this.chartArea.height - h) );
						this.charts[i].barTextEl[j].setAttribute('alignment-baseline', 'middle');
					}
					this.charts[i].barTextEl[j].setAttribute('font-size', this.charts[i].fontSize);
					this.charts[i].barTextEl[j].textContent = (list[j])[this.charts[i].text];
					this.svgElement.append(this.charts[i].barTextEl[j])
					
					// console.log('2j', i, j);
					if(i==0){
						let selectedBottomIndex = -1;
						for(let k=0; k < this.axes.length; k++){
							if(this.axes[k].position == 'bottom'){
								selectedBottomIndex = k;
								break;
							}
						}
						if(selectedBottomIndex != -1){
							// console.log('3j', i, j);
							this.axes[selectedBottomIndex].labelEl[j] = document.createElementNS("http://www.w3.org/2000/svg", "text");
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('x', labelX);
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('y', this.axes[selectedBottomIndex].labelMargin + this.chartArea.bottom );
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('fill', 'var(--colorStroke)');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('text-anchor', 'middle');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('alignment-baseline', 'hanging');
							this.axes[selectedBottomIndex].labelEl[j].setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
							this.axes[selectedBottomIndex].labelEl[j].textContent = (list[j])[this.axes[selectedBottomIndex].key];
							this.svgElement.append(this.axes[selectedBottomIndex].labelEl[j])
						}
					}
					
				}
			}
				
			
		
			let selectedBottomIndex = -1;
			for(let i=0; i < this.axes.length;i++){
				if(this.axes[i].position == 'bottom'){
					selectedBottomIndex = i;
					break;
				}
			}
			if(selectedBottomIndex != -1){
				if(this.axes[selectedBottomIndex].labelTitle !== undefined){
					if(this.axes[selectedBottomIndex].labelTitleFontSize == undefined){
						this.axes[selectedBottomIndex].labelTitleFontSize  = 14
					}
					if(this.axes[selectedBottomIndex].labelTitleX == undefined ){
						this.axes[selectedBottomIndex].labelTitleX = this.chartArea.left + this.chartArea.width/2;
					}
					if(this.axes[selectedBottomIndex].labelTitleY == undefined ){
						this.axes[selectedBottomIndex].labelTitleY = this.chartArea.bottom + this.axes[selectedBottomIndex].labelMargin + 17; // 기준점을 만들자.
					}
					// console.log('LLLLL', selectedBottomIndex, this.axes);
					this.axes[selectedBottomIndex].labelTitleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('font-size', this.axes[selectedBottomIndex].fontSize);
					this.axes[selectedBottomIndex].labelTitleEl.textContent = this.axes[selectedBottomIndex].labelTitle;
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('fill', 'var(--colorStroke)');
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('x',this.axes[selectedBottomIndex].labelTitleX)
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('y',this.axes[selectedBottomIndex].labelTitleY)
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('font-size',this.axes[selectedBottomIndex].titleFontSize)
					
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('text-anchor', 'middle');
					this.axes[selectedBottomIndex].labelTitleEl.setAttribute('alignment-baseline', 'hanging');
					this.svgElement.append(this.axes[selectedBottomIndex].labelTitleEl )
				}
			}
		}
		
	}

}
Va.registerComponent('gridChart', Va.GridChart);
