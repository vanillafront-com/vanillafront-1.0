export async function importWithOption(url, option, callback){
	//console.log('url',url, option);
	return await import(url, option);
}