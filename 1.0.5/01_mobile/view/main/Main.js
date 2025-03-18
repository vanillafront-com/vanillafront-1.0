
import Va from '../../lib/va.js';
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
	}
	onShowCustList(){
		Va.setRouterUrl('main', 'list');
	}
	onShowCustAdd(){
		Va.setRouterUrl('main', 'add');
	}
    config(){
        return ({
            tagName:'article',
			style:'flex:1',			
			layout:'ds-flex fd-column ai-stretch',
			tags:[{
				tagName: 'toolbar',
				ref:'topMenu',
				appearance:'primary',							
				layout:'ds-flex fd-row ai-center gap-s',				
				style:{	
					padding:'3px',
				},	
				tags:[{
					tagName:'button',
					appearance:'primary',
					size:'medium',
					text:'목록',
					onClick: 'onShowCustList'
				},{
					tagName:'button',
					appearance:'primary',
					size:'medium',
					text:'추가',
					onClick:'onShowCustAdd'
				},{
					tagName:'div',
					style:{
						flex:1
					}
				}]
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