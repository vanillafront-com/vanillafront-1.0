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
		this.getRef('pagination').setService(this, CustService.list, params, (me, result, responseJson, message) => {
			console.log('view callback');
		});
	}
	onRowClick(grid, value, data){
		let params = {
			custId: data['custId']
		}
		Va.setRouterUrl('main', 'custmodify', params);
	}
	config(){
		return ({
			title:'고객목록',
			restoreDisplay:'flex',
			tagName:"article" ,
			style:"flex:1;max-width:1400px;min-width:600px" ,
			layout:"ds-flex fd-column ai-stretch gap-s pad-l" ,
			tags:[{
				tagName:"div" ,
				layout:"ds-flex fd-row ai-center gap-m pad-m" ,
				tags:[{
					tagName:"h3" ,
					innerHTML:"고객정보" ,
					style:"margin:0px" 
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
					tagName:"div" ,
					layout:"ds-flex fd-row ai-stretch gap-s" ,
					tags:[{
						tagName:"inputField" ,
						label:"고객명" 
					},{
						tagName:"div" ,
						style:"flex:1;min-width:20px;min-height:20px;" 
					},{
						tagName:"div" ,
						style:"min-width:20px;min-height:20px" ,
						layout:"pos-static ds-flex fd-row" ,
						tags:[{
							tagName:"div" ,
							layout:"ds-flex fd-row ai-center" ,
							tags:[{
								tagName:"button" ,
								icon:"ico_search" ,
								appearance:"primary" ,
								text:"조회" 
							}]
						}]
					}]
				}]
			},{
				tagName:"div" ,
				layout:"ds-flex fd-row ai-center gap-m pad-s" ,
				tags:[{
					tagName:"h3" ,
					innerHTML:"목록" ,
					style:"margin:0px" 
				},{
					tagName:"div" ,
					style:"flex:1;min-height:10px;min-width:10px" 
				},{
					tagName:"button" ,
					text:"button" 
				},{
					tagName:"button" ,
					text:"button" 
				}]
			},{
				tagName:"div" ,
				layout:"ds-flex fd-column gap-s" ,
				style:"flex:1" ,
				tags:[{
					tagName:"grid" ,
					ref:"refGrid" ,
					style:{
						height:"200px" ,
						width:"100%" ,
						flex:"1" ,
						border:"var(--sizeBorderM) solid var(--colorNeutralStroke)" ,
						borderRadius:"var(--sizeFieldBorderRadiusM)" 
					} ,
					columns:[{
						key:"custId" ,
						title:"고객번호" ,
						width:100 
					},{
						key:"name" ,
						title:"고객명" ,
						width:200 
					},{
						key:"age" ,
						title:"나이" ,
						type:"number" ,
						align:"right" ,
						width:100 
					},{
						key:"hobbyName" ,
						title:"취미" ,
						type:"string" ,
						align:"center" ,
						width:150 
					}] ,
					onRowClick:"onRowClick" 
				},{
					tagName:"pagination" ,
					ref:"pagination" ,
					refGrid:"refGrid" ,
					page:1 ,
					limit:10 ,
					buttonCount:3 ,
					dataKey:"list" ,
					totalKey:"totalSize" 
				}]
			}]
		})
	}
}
Va.registerView('/view/cust/CustList', CustList);