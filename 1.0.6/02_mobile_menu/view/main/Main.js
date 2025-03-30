
import Va from '../../lib/va.js';
import MenuService from "../../service/MenuService.js";
export default class Main extends Va.View{
    constructor(option){
		console.log('option************', option);
		super(arguments);
    }
	mounted(){
		Va.setRouterAreaAsName(this.getRef('mainArea'), 'main')
		Va.setAreaAsName(this.getRef('mainArea'), 'main')
		// CustList는 라우터를 통해 설정된 화면이 아니라 초기설정으로 추가하는 경우임. 라우터 동작에서 제외함.
		if(Va.getRouterAreaHistoryCheck('main') == false){
			Va.setAreaUrl( 'main', '/view/cust/CustList');
		}
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
			let expandButton = new Va.ExpandButton({
				text: this.menuData[i].menuName,
				key: this.menuData[i].key,
				appearance:'primary'				
			})
			naviagationBar.append(expandButton);
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
		}
	}	
    config(){
        return ({
            tagName:'article',
			style:'flex:1',			
			layout:'ds-flex fd-column ai-stretch',
			tags:[{
				tagName: 'navigationMenuBar',
				ref:'naviagationBar',
				appearance:'primary',		
				title:'인사정보(모바일)',					
				style:{	
					padding:'3px',
				},	
            },{				
				tagName:'div',				
				style:'flex:1',
				layout:'ds-flex fd-column ai-stretch gap-xs',
				tags:[{
					tagName:'div',
					ref:'mainArea',				
					innerScroll:true,
					style:'flex:1;overflow:auto;innerScroll_display:flex;innerScroll_flex-direction:column;',
					
				}]
			}]
        })
       
    }
}
Va.registerView('/view/main/Main', Main);