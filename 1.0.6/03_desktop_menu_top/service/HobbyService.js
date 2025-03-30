import Va from '../lib/va.js';
export default class HobbyService extends Va.Service{
	static async list(view, params, callback){
		let options ={
			method:'GET',
			headers:{
				"Content-Type": "application/json"
			},
		};
		let response = await Va.HttpSync.request(view, './assets/json/hobby_list.json', params, options);
		console.log('resposne', response);
		return {
			opener: view,
			result: response.result,
			data: response.data,
			message: response.error.message
		}
	}
}