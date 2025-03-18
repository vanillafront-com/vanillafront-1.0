import Va from "./lib/va.js";
const routerPath = {
	login: {path: '/view/login/Login', areas:['root']},
	main: {path: '/view/main/Main', areas:['root']},
	list: {path: '/view/cust/CustList', areas:['main']},
	add: {path: '/view/cust/CustAdd', areas:['main']},
	modify: {path: '/view/cust/CustModify', areas:['main']},
}
Va.setRouterPath(routerPath);
