import Va from '../lib/va.js';
export default class CustService extends Va.Service{
	static list(view, params, callback){
		let options ={
			method:'GET',
			headers:{
				"Content-Type": "application/json"
			},
		};
		let me = this;
		Va.Http.request(view, './assets/json/cust_list.json', params, options, function(view, responseOk, resObj ){
			if(responseOk == true){
				if(resObj.result == true){
					callback(view, resObj.result, resObj, null);
				} else {
					callback(view, resObj.result, resObj, resObj.error.message);
				}
			} else {
				callback(view, false, resObj, error.message);
			}
		});
	}
	static info(view, params, callback){
		let options ={
			method:'GET',
			headers:{
				"Content-Type": "application/json"
			},
		};
		let me = this;
		Va.Http.request(view, './assets/json/cust_info.json', params, options, function(view, responseOk, resObj ){
			if(responseOk == true){
				if(resObj.result == true){
					callback(view, resObj.result, resObj, null);
				} else {
					callback(view, resObj.result, resObj, resObj.error.message);
				}
			} else {
				callback(view, false, resObj, error.message);
			}
		});
	}
	static add(view, params, callback){
		let options ={
			method:'GET',		// POST (your choice)
			headers:{
				"Content-Type": "application/json"
			},
		};
		let me = this;
		Va.Http.request(view, './assets/json/cust_add.json', params, options, function(view, responseOk, resObj ){
			if(responseOk == true){
				if(resObj.result == true){
					callback(view, resObj.result, resObj, null);
				} else {
					callback(view, resObj.result, resObj, resObj.error.message);
				}
			} else {
				callback(view, false, resObj, error.message);
			}
		});
	}
	static modify(view, params, callback){
		let options ={
			method:'GET',		// POST (your choice)
			headers:{
				"Content-Type": "application/json"
			},
		};
		let me = this;
		Va.Http.request(view, './assets/json/cust_modify.json', params, options, function(view, responseOk, resObj ){
			if(responseOk == true){
				if(resObj.result == true){
					callback(view, resObj.result, resObj, null);
				} else {
					callback(view, resObj.result, resObj, resObj.error.message);
				}
			} else {
				callback(view, false, resObj, error.message);
			}
		});
	}
}