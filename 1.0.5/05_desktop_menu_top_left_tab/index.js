import Va from './lib/va.js'; 
import './lib/va_component.js';
import App from './App.js';
import config from './config.js';
window.onload = function(){
	if(Va.validateBrowser() == false){
		console.log('not supported browser!!')
		return;
	}
	async function load(){
		await Va.Config.setConfig(config);
		await Va.addStyleSheetUrl('../assets/font/pretendard/static/pretendard-subset.css');
		await Va.addStyleSheetUrl('../assets/css/va-light.css');
		await Va.addStyleSheetUrl('../assets/css/va.css');
		await Va.addStyleSheetUrl('../assets/css/va-icons.css');
		const app = new App({
			startApp: true
		});
		app.setArea(document.getElementById('app'));
	}
	load();	
}