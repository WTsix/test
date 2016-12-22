var t = (function(){
	
	var methods = {
		on : function(element,evName,evFn){
			return element.addEventListener(evName,evFn,false);
		},
		off : function(element,evName,evFn){
			return element.removeEventListener(evName,evFn,false);
		},
		view : function(){
			return {
				w:document.documentElement.clientWidth,
				h:document.documentElement.clientHeight
			}
		},
		hasClass : function(element,classname){
			var classArr = element.className.split(' ');
			for(var i=0;i<classArr.length;i++){
				if(classArr[i] == classname){
					return true;
				}
			}
			return false;
		},
		addClass : function(element,classname){
			if(!methods.hasClass(element,classname)){
				element.className += " " + classname;
			}
		},
		removeClass : function(element,classname){
			if(methods.hasClass(element,classname)){
				var classArr = element.className.split(' ');
				for(var i=0;i<classArr.length;i++){
					if(classname == classArr[i]){
						classArr.splice(i,1);
						i--;
					}
				}
				element.className = classArr.join(' ');
			}
		},
		parent : function(element,attr){
			var firstChar = attr.charAt(0);
			if(firstChar === '.'){
				while(element.nodeType != 9 && !methods.hasClass(element,attr.substr(1))){
					element = element.parentNode;
				}
			}else if(firstChar === '#'){
				while(element.nodeType != 9 && element.id!=attr.substr(1)){
					element = element.parentNode;
				}
			}else{
				while(element.nodeType != 9 && element.nodeName!=attr.toUpperCase()){
					element = element.parentNode;
				}
			}
			return element.nodeType == 9 ? null : element;
		}
	}
	return methods;
})();
