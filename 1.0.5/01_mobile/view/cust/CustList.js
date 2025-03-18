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
				me.getRef('grid').setData(responseJson.data.list)
			} else {
				alert(message);
			}
		})
	}
	
	onRowClick(component, key, value, data, column, rowIndex, colIndex, row, col, cell, evt){
		let params = {
			custId: data.custId
		}
		Va.setRouterUrl('main', 'modify', params);
	}
	config(){
		return ({
			tagName:"article" ,
			style:"flex:1" ,
			layout:"ds-flex fd-column ai-stretch gap-xs pad-m" ,
			tags:[{
				tagName:"div" ,
				layout:"ds-flex fd-row ai-center gap-m pad-m" ,
				tags:[{
					tagName:"div" ,
					innerHTML:"고객목록조회" ,
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
				style:"border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeBorderRadiusM)" ,
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
				tagName:"grid" ,
				ref:"grid" ,
				style:"flex:1;border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeFieldBorderRadiusM)" ,
				columns:[{
					key:"name" ,
					title:"이름" ,
					width:150 
				},{
					key:"age" ,
					title:"나이" ,
					width:100 ,
					align:"right" ,
					type:"number" 
				},{
					key:"hobbyName" ,
					title:"취미" ,
					width:200 
				}] ,
				onRowClick:"onRowClick" 
			}]
		})
	}
}
Va.registerView('/view/cust/CustList', CustList);