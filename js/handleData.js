//操作数据的JS文件
var handle = {
	
		getSelfById:function(data,id){
			return data.find(function(value){
				return value.id == id;
			})
		},
		getChildrenById : function(data,id){
			return data.filter(function(value){
				return value.pid == id;
			})
		},
		getParentsById : function(data,id){
			var arr = [];
			var self = handle.getSelfById(data,id);
			if(self){
				arr.push(self);
				arr = arr.concat(handle.getParentsById(data,self.pid));
			}
			return arr;
		},
		isTitleExist : function(data,value,id){
			var children = handle.getChildrenById(data,id);
			return children.findIndex(function(item){
				return item.title == value;
			})!=-1;
		},
		getChildrenAll : function(data,id){
			var arr = [];
			var self = handle.getSelfById(data,id);
			arr.push(self);
			var children = handle.getChildrenById(data,self.id);
			
			children.forEach(function(item){
				arr = arr.concat(handle.getChildrenAll(data,item.id));
			});
			return arr;
		},
		getChildrenAllByIdArr : function(data,idArr){
			var arr = [];
			idArr.forEach(function(value){
				arr = arr.concat(handle.getChildrenAll(data,value))
			})
			return arr;
		},
		delChildrenByIdArr : function(data,idArr){
			var childrenAll = handle.getChildrenAllByIdArr(data,idArr);
			for(var i=0;i<data.length;i++){
				for(var j=0;j<childrenAll.length;j++){
					if(data[i]==childrenAll[j]){
						data.splice(i,1);
						i--;
						break;
					}
				}
			}
		}
		
}


