import Va from '../../lib/va.js';
import "../main/Main.js";

export default class Login extends Va.View{
    constructor(){
		super(arguments);
    }
	mounted(){
	}
	onClickLogin(target, evt){
		Va.setRouterUrl( 'root', 'main');
	}
    config(){
        return ({ 
            tagName:'article',       
			style:'flex:1',
			layout:'ds-flex fd-column ai-stretch gap-m', 
			tags:[{
				tagName:'div',
				style:'flex:1',
				layout:'ds-flex fd-column ai-center jc-center gap-s',
				tags:[{
					tagName:'image',
					src:'./assets/img/logo.png',
					style:'width:60%;max-width:200px;margin-bottom:40px'
				},{
					tagName:'button',
					appearance:'primary',
					ref:'btnLogin',
					text:'Login',
					onClick:'onClickLogin',
				}]
			}]
        })
    }
}
Va.registerView('/view/login/Login', Login);