import Va from '../../lib/va.js';
export default Va.Lang = class extends Va{	
	static data = {
		'번호': 'no',
		'고객명': 'cust name',
		'나이': 'age'
	}
	// 서버에서 데이터를 받아와 위 data와 같이 설정.
	static setData(data){ 
		Lang.data = data;
	}
	static get (key,p0, p1, p2, p3, p4){
		let ret = Va.Lang.data[key];
		let lang = Va.Locale.getLanguage(); // 동적으로 언어를 가져오기
		if (ret == null || ret == undefined) {
			ret = key;
			ret = Va.Lang.format(ret, p0, p1, p2, p3, p4);
		} else if (ret[lang] != undefined) {
			ret = ret[lang];
			ret = String.format(ret, p0, p1, p2, p3, p4);
		}
		return ret;
	};
	static format = function() {
		var theString = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
			theString = theString.replace(regEx, arguments[i]);
		}
		return theString;
	}
}