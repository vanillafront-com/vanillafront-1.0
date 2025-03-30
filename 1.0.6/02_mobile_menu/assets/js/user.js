import Va from '../../lib/va.js';
Va.Monaco = class extends Va.Div {
	constructor(option){
		super(option)
		this.language = 'javascript';
		if(this.option.language  != undefined){
			this.language = this.option.language;
		}
		let div = document.createElement('div');
		div.setAttribute('style', 'width:100%;height:100%; display:block');
		this.element.append(div);
		if(this.option.language != undefined){
			this.language  = this.option.language;
		} else {
			this.language = 'javascript';
		}
		this.option.theme = 'vs-light';
		if(this.option.theme != undefined){
			this.theme = this.option.theme;
		}
		
		if(this.option.value == undefined){
			//import('../assets/monaco/min/vs/editor/editor.main.js').then( c =>{
			require(['vs/editor/editor.main'], () => {
				this.viewEditor = monaco.editor.create(div, {
					value:'',
					language: this.language ,
					inherit: false,
					lineNumbers: 'on',
					roundedSelection: true,
					scrollBeyondLastLine: false,
					fontSize: 17,
					readOnly: false,
					theme: this.theme, //'vs-light',
					renderIndentGuides: false,
					//theme: 'vs-dark',
					automaticLayout: true
				});
			});
		} else {
			//import('../assets/monaco/min/vs/editor/editor.main.js').then( c =>{
			require(['vs/editor/editor.main'], () => {
				
				this.viewEditor = monaco.editor.create(div, {
					language: this.language ,
					lineNumbers: 'on',
					inherit: false,
					roundedSelection: true,
					scrollBeyondLastLine: false,
					readOnly: false,
					fontSize: 17,
					theme: this.theme, //'vs-light',
					renderIndentGuides: false,
					//theme: 'vs-dark',
					value:this.option.value,
					automaticLayout: true
				});
			});
		}
		
		setTimeout(()=>{
			this.mounted();
		}, 1000);		
	}
	__mounted(){
		console.log('mounted.............................')
	}
	mounted(){
		console.log('mounted');
		if(this.option.value != undefined){
			this.setValue(this.option.value);
		}
		console.log('readUrl-->' ,this.option.url);
		if(this.option.url != undefined && this.option.url != null && this.option.url.trim() != ''){
		    //console.log('readUrl' ,this.option.url);
		    this.readUrl(this.option.url);
		}
		this.setStylesToElements(this.option.style, this.elements);
	}
    readUrl(url){
        console.log('여기는///')
        let options ={
            method:'GET',
        };
        let me = this;
        Va.Http.requestRaw(this, url, {}, options, (response) => {
            console.log('설정부')
            this.setValue(response);
        });
    }
	setValue(val){
		this.viewEditor.getModel().setValue(val);
		this.viewEditor.updateOptions({
			renderIndentGuides: false,
			automaticLayout: true
		});
	}
	getValue(val){
		return this.viewEditor.getModel().getValue();
	}

}
Va.registerComponent('monaco', Va.Monaco);