import Va from './lib/va.js';
import Login from './view/login/Login.js';
export default class App extends Va.View{
	constructor(){
        super(arguments);
		this.tagName = 'App';
    }
	mounted(){
		Va.setAreaAsName(this.getRef('rootArea'), 'root');
		Va.setAreaUrl('root', '/view/login/Login');
    } 
    config(){ 
        return ({
            tagName:'div',
			layout:'ds-flex gap-s',
            style:{
                display:'flex',
                flexDirection:'column',
                alignItems:'stretch',
                height:'100%',
                width:'100%',
            },
            tags:[{
                tagName:'div',
                ref:'rootArea',
				addClass:'app',
				style:{
					display:'flex',
					height:'100%',
					overflow:'auto'
				}
            }]
        })
    }
}
Va.registerView('App', App);