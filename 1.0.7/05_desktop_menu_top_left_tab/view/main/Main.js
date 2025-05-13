
import Va from '../../lib/va.js';
import MenuService from "../../service/MenuService.js";
import CustList from "../cust/CustList.js";
export default class Main extends Va.View{
    constructor(option){
		console.log('option************', option);
		super(arguments);
    }
	mounted(){
		Va.setAreaAsName(this.getRef('mainTab'), 'mainTab')

		//Va.setAreaUrl( 'mainTab', '/view/cust/CustList');
		// getAreaByName
		let mainTab = Va.getAreaByName('mainTab');
		let view = new Va.viewDefine['/view/cust/CustList']();

		mainTab.add(view.rootComponent);
		this.getMenuList();
	}
	getMenuList(){
		let params = {}
		MenuService.list(this, params, (me, result, responseJson, message) => {
			if(result == true){
				this.menuData = responseJson.data.list;
				this.getTopMenu();
			} else {
				new Va.Alert({
					title:'확인',
					message: '메뉴가져오기 오류:' + message
				}).show(this);
			}
		})
	}
	getTopMenu(){
		const naviagationBar = this.getRef('naviagationBar');
		for(let i=0; i < this.menuData.length; i++){
			let button = new Va.Button({
				text: this.menuData[i].menuName,
				key: this.menuData[i].key,
				appearance:'primary',
				popWidth:200,
				onClick:'onTopClick'
				//style:'pop_background-color:var(--colorPrimary);'
			})
			naviagationBar.append(button);
			/*
			for(let j=0; this.menuData[i].list != undefined && j < this.menuData[i].list.length; j++){
				let button = new Va.Button({
					text: this.menuData[i].list[j].menuName,
					key: this.menuData[i].list[j].key,
					routerName: this.menuData[i].list[j].routerName,
					appearance:'primary'				
				})
				expandButton.append(button);
				button.addEventListener('click', (btn) =>{					
					this.getRef('naviagationBar').collapse();
					let routerName = btn.option.routerName;
					Va.setRouterUrl('main', routerName);	
					
				});
			}
			*/
		}
	}
	onTopClick( component, element, evt){
		console.log('ontopClick')
		let key = component.option.key;
		// 2 depth의 메뉴를 가져온다.
		for(let i=0; i < this.menuData.length; i++){
			if(key == this.menuData[i].key){
				this.setLeftMenu(this.menuData[i].list);
				break;
			}
		}
	}
	setLeftMenu(list){
		console.log('setLeftMenu', list);
		let leftMenu = this.getRef('leftMenu');
		leftMenu.removeAll();
		for(let i=0; i < list.length; i++){
			let expandButton = new Va.ExpandButton({
				text: list[i].menuName
			});
			leftMenu.append(expandButton);
			for(let j=0; j < list[i].list.length; j++){
				let button = new Va.Button({
					text: list[i].list[j].menuName,
					url: list[i].list[j].url,
					onClick:'setMainUrl'
				});
				expandButton.append(button);
			}
		}
	}
	setMainUrl(component){
		console.log('url', component.option.url);
		if(component.option.url == null || component.option.url.trim() == ''){
			return;
		}
		// 중복된 탭은 활성화만 시킴
		let mainTab = Va.getAreaByName('mainTab');
		let childComponents = mainTab.getChildComponents();
		let existCheck = false;
		for(let i=0; i < childComponents.length; i++){
			let view = Va.getView(childComponents[i].element);
			console.log(i, view.tagName);
			if(view.tagName == component.option.url){
				mainTab.setActive(view.rootComponent);
				existCheck = true;
			}
		}
		if(existCheck == false){
			Va.createViewByUrl( '../' + component.option.url + '.js', component.option.url, {}, (view)=>{
				mainTab.add(view.rootComponent);
				console.log(view.rootComponent);
				mainTab.setActive(view.rootComponent);			
			})
		}
	}
    config(){
        return ({
			tagName:"article" ,
			style:"flex:1" ,
			layout:"ds-flex fd-column ai-stretch" ,
			tags:[{
				tagName:"navigationBar" ,
				ref:"naviagationBar" ,
				appearance:"primary" ,
				menuAlign:"left" ,
				title:"인사정보" ,
				style:{
					padding:"3px" ,
					titleDiv_width:"300px" 
				} 
			},{
				tagName:"div" ,
				style:"flex:1" ,
				layout:"ds-flex fd-row ai-stretch" ,
				tags:[{
					tagName:"div" ,
					style:"min-width:20px;min-height:20px;width:200px" ,
					layout:"ds-flex fd-column gap-xs pad-m" ,
					ref:"leftMenu" ,
					innerScroll:true 
				},{
					tagName:"divider" ,
					thumb:true ,
					direction:"vertical" ,
					resizable:true ,
					resizeTarget:"before" ,
					expanded:true ,
					style:"min-height:100px;height:100%;" ,
					collapsible:true ,
					collapseTargetDisplay:"flex" ,
					collapseTarget:"before" ,
					ref:"leftMenuDivider" ,
					expandedSize:200 ,
					thumbSize:"large" 
				},{
					tagName:"div" ,
					ref:"mainArea" ,
					style:"min-width:600px;flex:1;overflow:auto;innerScroll_display:flex;innerScroll_flex-direction:column;padding:10px;" ,				
					tags:[{
						tagName:"tab" ,
						ref:'mainTab',
						appearance:"classic" ,
						style:{
							flex:1
						} ,
						otherContainer:true ,
						tags:[]
					}]
				},{
					tagName:"div" ,
					style:"display:flex;min-width:20px;min-height:20px;width:280px;" ,
					tabletStyle:"display:none" ,
					layout:"ds-flex fd-column gap-xs pad-m" ,
					ref:"rightArea" ,
					tags:[{
						tagName:"div" ,
						ref:"helpArea" ,
						innerHTML:"help area" ,
						style:"flex:1;border:var(--sizeBorderM) solid var(--colorNeutralBorder); border-radius:var(--sizeBorderRadiusM);padding:var(--sizeSpacingM)" 
					}]
				}]
			}]
		})
    }
}
Va.registerView('/view/main/Main', Main);