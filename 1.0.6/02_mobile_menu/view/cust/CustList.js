import Va from '../../../lib/va.js';
import CustService from '../../service/CustService.js';
export default class CustList extends Va.View{
	constructor(){
		super(arguments);
	}
	mounted(){
		let params = {};
		this.getCustList(params);
	}
	getCustList(params){		
		CustService.list(this, params, (me, result, responseJson, message) =>{
			if(result == true){
				me.getRef('list').setData(responseJson.data.list)
			} else {
				alert(message);
			}
		})
	}
	onSelect(list, element, listItem, data, evt){
		let params = {
			custId: data.custId
		}
		Va.setRouterUrl('main', 'custmodify', params);
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
					innerHTML:"고객목록" ,
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
				layout:"ds-flex fd-column ai-stretch gap-m pad-m" ,
				tags:[{
					tagName:"inputField" ,
					label:"고객명" 
				},{
					tagName:"div" ,
					layout:"ds-flex fd-row ai-center" ,
					tags:[{
						tagName:"div" ,
						style:"flex:1" 
					},{
						tagName:"button" ,
						icon:"ico_search" ,
						appearance:"primary" ,
						text:"조회" 
					},{
						tagName:"div" ,
						style:"flex:1" 
					}]
				}]
			},{
				tagName:"list" ,
				ref:"list" ,
				multiSelect:false ,
				size:"small" ,
				template:{
					tagName:"listItem" ,
					layout:"ds-flex fd-row ai-center" ,
					tags:[{
						tagName:"div" ,
						style:"width:50px" ,
						innerHTML:"{custId}" 
					},{
						tagName:"div" ,
						style:"flex:1" ,
						innerHTML:"{name}" 
					},{
						tagName:"div" ,
						style:"flex:1" ,
						innerHTML:"{hobbyName}" 
					}] 
				} ,
				onSelect:"onSelect" ,
				style:"flex:1;border-radius:var(--sizeFieldBorderRadiusM);border:var(--sizeBorderM) solid var(--colorNeutralStroke)" 
			}]
		})
	}
}
Va.registerView('/view/cust/CustList', CustList);