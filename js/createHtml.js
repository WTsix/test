//----------------------------树形菜单区域------------------------------
function createTreeHtml(datas,id){
	var children = handle.getChildrenById(datas,id);
	if(!children.length){
		return '';
	}
	var str = '<ul>';
	children.forEach(function(value){
		var level = handle.getParentsById(datas,value.pid).length;
		var classname = handle.getChildrenById(datas,value.id).length ? 'tree-ico' : 'tree-ico-none';
		str+='<li>'+
				'<div style="padding-left:'+level*20+'px;" class="tree-title '+classname+'" data-id="'+value.id+'">'+
					'<i></i><span>'+value.title+'</span>'+
				'</div>';
		str+=createTreeHtml(datas,value.id);
		str+='</li>'
	})
	str+='</ul>';
	return str;
}
//---------------------------面包屑导航区域----------------------------------
function createNavHtml(datas,id){
	var parents = handle.getParentsById(datas,id).reverse();
	var len = parents.length;
	var str = '';
	for(var i=0;i<len-1;i++){
		str +='<a href="javascript:;" data-id="'+parents[i].id+'">'+parents[i].title+'</a>';
	}
	str += '<span>'+parents[len-1].title+'</span>';
	
	return str;
}
//-----------------------------文件区域------------------------------------
function createFileHtml(datas,id){
	var children = handle.getChildrenById(datas,id);
	var str = '';
	children.forEach(function(value){
		str+='<div class="file-item" data-id="'+value.id+'"><img src="img/folder-b.png" alt="" /><span class="folder-name">'+value.title+'</span><input type="text" class="editor"/><i></i></div>';
	});
	return str;
}
//------------------------------新建文件------------------------------------
function fileHtmlFn(value){
	var str = '<img src="img/folder-b.png" alt="" /><span class="folder-name">'+value.title+'</span><input type="text" class="editor"/><i></i>';
	return str;
}
function createFileElement(){
	var div = document.createElement("div");
	div.className = 'file-item';
	div.innerHTML = fileHtmlFn({});
	return div;
}
