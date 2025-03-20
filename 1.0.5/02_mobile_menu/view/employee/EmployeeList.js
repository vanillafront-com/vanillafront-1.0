import Va from '../../../lib/va.js';
import EmployeeService from '../../service/EmployeeService.js';
export default class EmployeeList extends Va.View{
	constructor(){
		super(arguments);
		console.log('***** cust create ****');
	}
	mounted(){
		console.log('***** cust mounted ****');
		this.getEmployeeList();
	}
	getEmployeeList(){
		let params = {};
		EmployeeService.list(this, params, (me, result, responseJson, message) =>{
			if(result == true){
				me.getRef('cardList').setData(responseJson.data.list)
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
				tagName:"h3" ,
				innerHTML:"직원" ,
				style:"margin:0px" 
			},{
				tagName:"divider" ,
				direction:"horizontal" ,
				style:"min-width:100px;width:100%;" ,
				expandSize:200 ,
				expanded:true 
			},{
				label:"default" ,
				tagName:"cardList" ,
				ref:"cardList" ,
				layout:"ds-grid gtc-1fr-1fr-1fr gtr-auto" ,
				template:{
					tagName:"listItem" ,
					layout:"ds-flex fd-column ai-stretch gap-xxs pad-m" ,
					tags:[{
						tagName:"image" ,
						shape:"rounded" ,
						src:"{img}" ,
						style:"flex:1;width:100%;height:100%;" 
					},{
						tagName:"div" ,
						innerHTML:"{name}" 
					}] ,
					style:"aspectRatio:0.8;border:var(--sizeBorderXXS) solid var(--colorNeutralBorder);box-shadow:var(--shadowXXS)" 
				} ,
				style:"flex:1;border:var(--sizeBorderM) solid var(--colorNeutralStroke);border-radius:var(--sizeFieldBorderRadiusM)" 
			}]
		})
	}
}
Va.registerView('/view/employee/EmployeeList', EmployeeList);