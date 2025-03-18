import Va from '../../../lib/va.js';
import CustService from '../../service/CustService.js';
import HobbyService from '../../service/HobbyService.js';
export default class CustAdd extends Va.View{
	constructor(){
		super(arguments);
		console.log('***** cust create ****');
	}
	mounted(){
		console.log('***** cust mounted ****');
		this.getHobbyList();
	}
	async getHobbyList(){ 		
		let params = {};
		let responseJson = await HobbyService.list(this, params);
		if(responseJson.result == true){
			this.getRef('hobbyCode').setData(responseJson.data.list)
		} else {
			alert(responseJson.message);
		}
	}
	onAddCust(){		
		let params = {
			custName: this.getRef('custName').getValue(),
			age: this.getRef('age').getValue(),
			hobbyCode: this.getRef('hobbyCode').getValue()
		}
		CustService.add(this, params, (me, result, responseJson, message) =>{
			if(result == true){
				new Va.Alert({
					title:'확인',
					message:'등록했습니다.'
				}).show(this, ()=>{
					Va.setRouterUrl('main', 'list');
				});				
			} else {
				alert(message);
			}
		})
	}
	config(){
		return ({
			tagName:"article" ,
			style:"flex:1" ,
			layout:"ds-flex fd-column ai-stretch gap-m pad-m" ,
			tags:[{
				tagName:"div" ,
				layout:"ds-flex fd-row ai-center gap-m pad-m" ,
				tags:[{
					tagName:"div" ,
					innerHTML:"고객추가" ,
					style:"font-weight: var(--fontWeightSemibold)" 
				},{
					tagName:"div" ,
					style:"flex:1;min-height:10px;" 
				}]
			},{
				tagName:"divider" ,
				direction:"horizontal" ,
				style:"min-width:100px;width:100%;" ,
				expandSize:200 ,
				expanded:true 
			},{
				tagName:"div" ,
				style:"border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeFieldBorderRadiusM)" ,
				layout:"ds-flex fd-column ai-left gap-s pad-m" ,
				tags:[{
					tagName:"inputField" ,
					label:"고객명" ,
					ref:"custName" ,
					style:"width:150px" 
				},{
					tagName:"numberField" ,
					label:"나이" ,
					ref:"age" ,
					style:"width:100px" 
				},{
					tagName:"comboboxField" ,
					label:"취미" ,
					template:{
						tagName:"listItem" ,
						innerHTML:"{display}" 
					} ,
					key:"code" ,
					display:"display" ,
					ref:"hobbyCode" ,
					style:"width:200px" 
				}]
			},{
				tagName:"div" ,
				layout:"ds-flex fd-row ai-center jc-center" ,
				tags:[{
					tagName:"button" ,
					appearance:"primary" ,
					text:"저장" ,
					onClick:"onAddCust" 
				}]
			}]
		})
	}
}
Va.registerView('/view/cust/CustAdd', CustAdd);