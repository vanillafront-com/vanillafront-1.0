import Va from '../../../lib/va.js';
import EmployeeService from '../../service/EmployeeService.js';
export default class EmployeeList extends Va.View{
	constructor(){
		super(arguments);
	}
	mounted(){
		this.getEmployeeList();
	}
	getEmployeeList(){
		let params = {};
		this.getRef('pagination').setService(this, EmployeeService.list, params, (me, result, responseJson, message) => {
			console.log('view callback');
		});
		/*
		// 페이징이 아닐경우.
		EmployeeService.list(this, params, (me, result, responseJson, message) =>{
			if(result == true){
				me.getRef('cardList').setData(responseJson.data.list)
			} else {
				alert(message);
			}
		})
		*/
	}	
	config(){
		return (		/**vanillafront_editor_start**/{
			tagName:"article" ,
			style:"flex:1;max-width:1400px;min-width:600px;" ,
			layout:"ds-flex fd-column ai-stretch gap-m pad-m" ,
			tags:[{
				tagName:"h3" ,
				innerHTML:"직원목록" ,
				style:"margin:0px" 
			},{
				tagName:"divider" ,
				direction:"horizontal" ,
				style:"min-width:100px;width:100%;" ,
				expandSize:200 ,
				expanded:true 
			},{
				tagName:"section" ,
				style:"border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeFieldBorderRadiusM)" ,
				layout:"ds-flex fd-row ai-stretch gap-s pad-m" ,
				tags:[{
					tagName:"div" ,
					style:"flex:1" ,
					layout:"ds-flex fd-column ai-stretch gap-s" ,
					tags:[{
						tagName:"div" ,
						layout:"ds-flex fd-row ai-center gap-s" ,
						tags:[{
							tagName:"inputField" ,
							label:"직원번호" ,
							ref:"input01" 
						},{
							tagName:"inputField" ,
							label:"직원명" ,
							ref:"input02" 
						},{
							tagName:"div" ,
							style:"flex:1" 
						}]
					}]
				},{
					tagName:"div" ,
					layout:"ds-flex fd-row ai-center" ,
					tags:[{
						tagName:"button" ,
						appearance:"primary" ,
						icon:"ico_search" ,
						text:"조회" 
					}]
				}]
			},{
				tagName:"cardList" ,
				ref:"cardList" ,
				layout:"ds-grid gtc-1fr-1fr-1fr-1fr-1fr-1fr-1fr gtr-auto" ,
				template:{
					tagName:"listItem" ,
					layout:"ds-flex fd-column ai-stretch gap-xxs pad-m" ,
					tags:[{
						tagName:"image" ,
						shape:"rounded" ,
						src:"{img}" ,
						style:"width:100%;height:100%;" 
					},{
						tagName:"div" ,
						innerHTML:"{name}" 
					}] ,
					style:"aspectRatio:0.8;border:var(--sizeBorderXXS) solid var(--colorNeutralBorder);box-shadow:var(--shadowXXS)" 
				} ,
				style:"flex:1;border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeFieldBorderRadiusM)" 
			},{
				ref:"pagination" ,
				tagName:"pagination" ,
				refGrid:"cardList" ,
				page:1 ,
				limit:10 ,
				buttonCount:3 ,
				dataKey:"list" ,
				totalKey:"totalSize" 
			}]
		}/**vanillafront_editor_end**/
		)
	}
}
Va.registerView('/view/employee/EmployeeList', EmployeeList);