import Va from "./lib/va.js";
const routerPath = {
	login: {path: '/view/login/Login', areas:['root']},
	main: {path: '/view/main/Main', areas:['root']},
	custlist: {path: '/view/cust/CustList', areas:['main']},
	custadd: {path: '/view/cust/CustAdd', areas:['main']},
	custmodify: {path: '/view/cust/CustModify', areas:['main']},
	itemlist: {path: '/view/item/ItemList', areas:['main']},
}
Va.setRouterPath(routerPath);
