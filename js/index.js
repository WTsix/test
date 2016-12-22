(function(){
	//--------------------------自定义高---------------------------------
	var head = document.getElementById("head");
	var section = document.getElementById("section");
	function resize(){
		var clientH = t.view().h;
		section.style.height = clientH - head.offsetHeight + 'px';
	}
	window.onresize = resize;
	resize();
	
	//-------------------------渲染各个区域-------------------------------
	var datas = data.files;
	var fileList = document.getElementsByClassName('folders')[0];
	var fileItems = fileList.getElementsByClassName('file-item');
	var breadNav = document.getElementsByClassName('bread-nav')[0];
	var treeMenu = document.getElementsByClassName('tree-menu')[0];
	var empty = document.getElementsByClassName('f-empty')[0];
	var checkBox = fileList.getElementsByTagName('i');
	var checkAll = document.getElementsByClassName('checkall')[0];
	var currentId = 0;
	
	function treeFn(id){//重新渲染页面之后也要确保文件的状态
		treeMenu.innerHTML = createTreeHtml(datas,-1);
	
		var treeTitle = treeMenu.getElementsByClassName('tree-title');
		
		var ad = handle.getParentsById(datas,id);
		var cParent = [];
		for(var i=0;i<treeTitle.length;i++){
			for(var j=0;j<ad.length;j++){
				if(treeTitle[i].dataset.id==ad[j].id){
					cParent.push(treeTitle[i]);
				}
			}
		}
		for(var i=0;i<cParent.length;i++){
			t.addClass(cParent[i],'open');
			if(cParent[i].nextElementSibling){
				var uls = cParent[i].nextElementSibling.getElementsByTagName('ul');
				for(var j=0;j<uls.length;j++){
					uls[j].style.display = 'none';
					t.removeClass(uls[j].previousElementSibling,'open');
				}
				cParent[i].nextElementSibling.style.display = 'block';
			}
		}
	}
	treeFn(currentId);
	//通过id找到该id下其他的同级元素
	function findEle(id){
		var arr = [];
		var self = handle.getSelfById(datas,id);
		
		var children = handle.getChildrenById(datas,self.pid);
		
		for(var i=0;i<children.length;i++){
			if(children[i]!=self){
				arr.push(children[i].id);
			}
		}
		return arr;
	}
	function treeFn2(fileId){
		
		var tjEles = [];
		
		for(var i=0;i<findEle(fileId).length;i++){
			tjEles.push(getTreeTitleById(findEle(fileId)[i]));
		}
		
		for(var i=0;i<tjEles.length;i++){
			if(tjEles[i].nextElementSibling){
				tjEles[i].nextElementSibling.style.display = 'none';
			}
			t.removeClass(t.parent(tjEles[i],'.tree-title'),'open');
		}
		
		var tar = getTreeTitleById(fileId);
		
		if(tar.nextElementSibling){
			var uls = tar.nextElementSibling.getElementsByTagName('ul');
			for(var i=0;i<uls.length;i++){
				uls[i].style.display = 'none';
				t.removeClass(uls[i].previousElementSibling,'open');
			}
			tar.nextElementSibling.style.display = 'block';
		}
		t.addClass(t.parent(tar,'.tree-title'),'open');
	}
	
	breadNav.innerHTML = createNavHtml(datas,0);
	
	fileList.innerHTML = createFileHtml(datas,0);
	
	//----------------------------各个区域的交互----------------------------
	//getTreeTitleById
	function getTreeTitleById(id){
		var treeDiv = treeMenu.getElementsByClassName('tree-title');
		for(var i=0;i<treeDiv.length;i++){
			if(treeDiv[i].dataset.id==id){
				return treeDiv[i];
			}
		}
	}
	t.addClass(getTreeTitleById(0),'active');
	//各个区域都用到的函数
	function common(fileId){
		var children = handle.getChildrenById(datas,fileId);
		
		t.removeClass(getTreeTitleById(currentId),'active')
		t.addClass(getTreeTitleById(fileId),'active');
		
		breadNav.innerHTML = createNavHtml(datas,fileId);
		if(children.length){
			empty.style.display = 'none';
		}else{
			empty.style.display = 'block';
		}
		fileList.innerHTML = createFileHtml(datas,fileId);
		currentId = fileId;
	}
	//树形菜单区域
	t.on(treeMenu,'click',function(e){
		var target = e.target;
		if(target = t.parent(target,'.tree-title')){
			var fileId = target.dataset.id;
			treeFn2(fileId);
			t.removeClass(checkAll,'checked');
			common(fileId);
		}
		
	});
	//面包屑导航区域
	t.on(breadNav,'click',function(e){
		var target = e.target;
		if(target = t.parent(target,'a')){
			var fileId = target.dataset.id;
			t.removeClass(checkAll,'checked');
			
			common(fileId);
			treeFn2(fileId);
		}
	});
	//--------------鼠标移入移出-------------------
	t.on(fileList,'mouseover',function(e){
		var target = e.target;
		if(target = t.parent(target,'.file-item')){
			t.addClass(target,'hov');
		}
		
	});
	t.on(fileList,'mouseout',function(e){
		var target = e.target;
		if(target = t.parent(target,'.file-item')){
			t.removeClass(target,'hov');
		}
		
	});
	//文件区域
	//单选
	function isCheckedAll(){
		for(var i=0;i<checkBox.length;i++){
			if(!t.hasClass(checkBox[i],'checked')){
				t.removeClass(checkAll,'checked');
				return;
			}
		}
		t.addClass(checkAll,'checked');
	}
	t.on(fileList,'click',function(e){
		var target = e.target;
		if(target.nodeName==='I'){
			if(!t.hasClass(target,'checked')){
				t.addClass(target,'checked');
				t.addClass(t.parent(target,'.file-item'),'active');
			}else{
				t.removeClass(target,'checked');
				t.removeClass(t.parent(target,'.file-item'),'active');
			}
			isCheckedAll();
		}
	});
	//进入下一级
	t.on(fileList,'click',function(e){
		var target = e.target;
		if(target.nodeName==='I' ||target.nodeName==='INPUT'){
			return;
		}
		if(target = t.parent(target,'.file-item')){
			var fileId = target.dataset.id;
			t.removeClass(checkAll,'checked');
			common(fileId);
			treeFn2(fileId);
		}
	});
	//全选
	t.on(checkAll,'click',function(e){
		var target = e.target;
		if(target = t.parent(target,'i')){
			if(!handle.getChildrenById(datas,currentId).length){
				return;
			}
			if(t.hasClass(checkAll,'checked')){
				t.removeClass(checkAll,'checked');
				for(var i=0;i<checkBox.length;i++){
					t.removeClass(checkBox[i],'checked');
					t.removeClass(t.parent(checkBox[i],'.file-item'),'active');
				}
			}else{
				t.addClass(checkAll,'checked');
				for(var i=0;i<checkBox.length;i++){
					t.addClass(checkBox[i],'checked');
					t.addClass(t.parent(checkBox[i],'.file-item'),'active');
				}
			}
		}
	});
	//提醒
	var fullTipBox = document.getElementsByClassName('full-tip-box')[0];
	var tipText = fullTipBox.getElementsByClassName('tip-text')[0];
	function fullTip(classname,otext){
		fullTipBox.className = 'full-tip-box';
		fullTipBox.style.top = '-32px';
		fullTipBox.style.transition = 'none';
		
		setTimeout(function(){
			t.addClass(fullTipBox,classname);
			fullTipBox.style.top = '0px';
			fullTipBox.style.transition = '.3s';
		},0);
		
		tipText.innerHTML = otext;
		clearTimeout(fullTipBox.timer);
		
		fullTipBox.timer = setTimeout(function(){
			fullTipBox.style.top = '-32px';
		},1000);
	}
	//--------------------------新建文件夹-------------------------------------------
	var creatNew = document.getElementById('create');
	creatNew.isCreate = false;
	t.on(creatNew,'mouseup',function(){
		if(!creatNew.isCreate){
			var firstElement = fileList.firstElementChild;
			var newfile = createFileElement();
			if(!firstElement){
				empty.style.display = 'none';
			}
			fileList.insertBefore(newfile,fileList.firstElementChild);
			
			var editor = newfile.getElementsByTagName('input')[0];
			var fileName = newfile.getElementsByTagName('span')[0];
			editor.style.display = 'block';
			fileName.style.display = 'none';
			editor.focus();
			editor.onmousedown = function(e){
				e.cancelBubble = true;
			}
			creatNew.isCreate = true;
		}
	});
	t.on(creatNew,'mousedown',function(e){
		e.stopPropagation();
	})
	t.on(document,'mousedown',creatNewFile);
	t.on(document,'keyup',function(e){
		if(e.keyCode==13){
			creatNewFile();
		}
	});
	function creatNewFile(){
		if(!creatNew.isCreate){
			return;
		}
		var children = handle.getChildrenById(datas,currentId);
		var firstElement = fileList.firstElementChild;
		var editor = firstElement.getElementsByTagName('input')[0];
		var fileName = firstElement.getElementsByTagName('span')[0];
		var val = editor.value.trim();
		if(val==''){
			fileList.removeChild(firstElement);
			if(!children.length){
				empty.style.display = 'block';
			}
			fullTip('err','文件名不能为空，新建失败');
		}else{
			var isExist = handle.isTitleExist(datas,val,currentId);
			if(isExist){
				fileList.removeChild(firstElement);
				if(!children.length){
					empty.style.display = 'block';
				}
				fullTip('err','文件名重复，新建失败');
			}else{
				var divId = Math.random();
				firstElement.setAttribute('data-id',divId);
				datas.unshift({
					id:divId,
					pid:currentId,
					title:val,
					type:'file'
				});
				editor.style.display = 'none';
				fileName.innerHTML = val;
				fileName.style.display = 'block';
				fullTip('ok','新建文件成功');
				t.removeClass(checkAll,'checked');
				treeFn(currentId);
				treeFn2(currentId);
			}
		}
		creatNew.isCreate = false;
	}
	//-----------------------删除-----------------------------------
	function whoSelected(){
		return Array.from(fileItems).filter(function(value){
			return t.hasClass(value,'active');
		})
	}
	var del = document.getElementById("del");
	t.on(del,'click',function(){
		var selectArr = whoSelected();
		var idArr = [];
		if(selectArr.length){
			for(var i=0;i<selectArr.length;i++){
				idArr.push(selectArr[i].dataset.id);
			}
			dialog(
				{
					title:'删除文件',
					content:'确认删除文件吗？',
					okFn(){
						
						handle.delChildrenByIdArr(datas,idArr);
						for(var i=selectArr.length-1;i>=0;i--){
							fileList.removeChild(selectArr[i]);
						}
						fullTip('ok','删除文件成功');
						t.removeClass(checkAll,'checked');
						treeFn(currentId);
						treeFn2(currentId);
						var children = handle.getChildrenById(datas,currentId);
						if(!children.length){
							empty.style.display = 'block';
						}
					}
				}
			);
		}else{
			fullTip('warn','请选择要删除的文件')
		}
	});
	//-----------------------移动到----------------------------------
	var oMove = document.getElementById("move");
	function moveFn(){
		var selectArr = whoSelected();
		var moveStatus = true;
		var fileId = null;
		if(selectArr.length){
			var con = createTreeHtml(datas,-1);
			dialog(
				{
					title:'移动到',
					content:'<div class="tree-menu tree-move">'+con+'</div>',
					okFn : function(){
						if(moveStatus){
							return true;
						}else{
							var onOff = false;
							for(var i=0;i<selectId.length;i++){
								var self = handle.getSelfById(datas,selectId[i]);
								var isExist = handle.isTitleExist(datas,self.title,fileId);
								if(!isExist){
									self.pid = fileId;
									fileList.removeChild(selectArr[i]);
								}else{
									onOff = true;
								}
							}
							if(onOff){
								if(selectId.length==1){
									fullTip('warn','文件重名，移动失败');
								}else{
									fullTip('warn','文件重名，部分文件移动失败');
								}
							}else{
								if(!handle.getChildrenById(datas,currentId).length){
									empty.style.display = 'block';
								};
								t.removeClass(checkAll,'checked');
								fullTip('ok','文件移动成功');
							}
							treeFn(currentId);
							treeFn2(currentId);
							return false;
						}
					}
				}
			);
			
			var selectId = [];
			
			for(var i=0;i<selectArr.length;i++){
				selectId.push(selectArr[i].dataset.id);
			}
			
			var selectData = handle.getChildrenAllByIdArr(datas,selectId);
			
			var treeMove = document.getElementsByClassName('tree-move')[0];
			var tip = document.querySelector('.conf-btn em');
			var weiyun = treeMove.getElementsByClassName('tree-title')[0];
			t.addClass(weiyun,'active');
			
			var currentElement = weiyun;
			
			t.on(treeMove,'click',function(e){
				var target = e.target;
				if(target = t.parent(target,'.tree-title')){
					
					t.removeClass(currentElement,'active');
					t.addClass(target,'active');
					currentElement = target;
					
					fileId = target.dataset.id;
					
					var oneData = handle.getSelfById(datas,fileId);
					var selfData = handle.getSelfById(datas,selectId[0]);
					if(fileId == selfData.pid){
						tip.innerHTML = '文件已在该目录下';
						moveStatus = true;
						return;
					}
					var onOff = false;
					for(var i=0;i<selectData.length;i++){
						if(oneData == selectData[i]){
							onOff = true;
							break;
						}
					}
					if(onOff){
						tip.innerHTML = '不能移到自身或其子文件夹下';
						moveStatus = true;
					}else{
						tip.innerHTML = '';
						moveStatus = false;
					}
				}
			});
				
		}else{
			fullTip('warn','请选择要移动的文件');
		}
		
	}
	t.on(oMove,'click',moveFn);
	//-----------------------弹框--------------------------------
	function dialog(options){
		options = options || {};
		var defaults = {};
		for(var attr in options){
			defaults[attr] = options[attr];
		}
		var tanbox = document.createElement("div");
		tanbox.className = 'tanbox';
		var str = '<div class="conf">'+
					'<i class="close-ico">X</i>'+
					'<h3 class="conf-title">'+defaults.title+'</h3>'+
					'<div class="conf-content">'+defaults.content+'</div><div class="conf-btn"><em class="tip"></em><a href="javascript:;">确定</a><a href="javascript:;">取消</a></div></div>';
		
		tanbox.innerHTML = str;
		document.body.appendChild(tanbox);
		var conf = tanbox.getElementsByTagName('a')[0];
		var cancel = tanbox.getElementsByTagName('a')[1]; 
		var close =  tanbox.getElementsByTagName('i')[0];
		var con = tanbox.getElementsByClassName('conf')[0];
		function resize(){
			con.style.left = (document.documentElement.clientWidth - con.offsetWidth)/2+'px';
			con.style.top = (document.documentElement.clientHeight - con.offsetHeight)/2+'px';
		}
		resize();
		window.onresize = resize;
		t.on(conf,'click',function(){
			var bl = defaults.okFn();
			if(bl){
				return;
			}
			document.body.removeChild(tanbox);
		});
		t.on(cancel,'click',function(){
			document.body.removeChild(tanbox);
		})
		t.on(close,'click',function(){
			document.body.removeChild(tanbox);
		})
	}
	//--------------------------框选---------------------------------
	var div = null,
		divLeft = null,
		divTop = null;
	t.on(fileList,'mousedown',function(e){
		e.preventDefault();
		var target = e.target;
		if( e.which!=1 || target != fileList){
			return;
		}
		
		divLeft = e.clientX;
		divTop = e.clientY;
		
		document.onmousemove = function(e){
			if( Math.abs(e.clientY-divTop) >20 || Math.abs(e.clientX-divLeft) >20){
				if(!div){
					div = document.createElement("div");
					div.className = 'kuang';
					document.body.appendChild(div);
				}
			}
			if(!div){
				return;
			}
			div.style.left = Math.min(e.clientX-2,divLeft+2)+'px';
			div.style.width = Math.abs(e.clientX-divLeft)+'px';
			div.style.top = Math.min(e.clientY-2,divTop+2)+'px';
			div.style.height = Math.abs(e.clientY-divTop)+'px';
			for(var i=0;i<checkBox.length;i++){
				if(peng(t.parent(checkBox[i],'.file-item'),div)){
					t.addClass(checkBox[i],'checked');
					t.addClass(t.parent(checkBox[i],'.file-item'),'active');
				}else{
					t.removeClass(checkBox[i],'checked');
					t.removeClass(t.parent(checkBox[i],'.file-item'),'active');
				}
			}
			isCheckedAll();
		}
		document.onmouseup = function(e){
			document.onmousemove = null;
			document.onmouseup = null;
			if(div){
				document.body.removeChild(div);
				div = null;
			}
		}
	});
	function peng(obj1,obj2){
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();
		return pos1.right > pos2.left && pos1.left < pos2.right && pos1.bottom > pos2.top && pos1.top < pos2.bottom;
	}
	//---------------------拖拽移动------------------------------
	var sketchDiv = null,
		opaDiv = null,
		pengFile = null;
	t.on(fileList,'mousedown',function(e){
		e.preventDefault();
		
		var target = e.target;
		
		if( e.which!=1 || target == fileList){
			return;
		}
		
		var isFileChecked;
		
		if(t.hasClass(t.parent(target,'.file-item').getElementsByTagName('i')[0],'checked')){
			isFileChecked = true;
		}else{
			isFileChecked = false;
		}
		if(!isFileChecked){
			return;
		}
		var selectArr = whoSelected();
		
		divLeft = e.clientX;
		divTop = e.clientY;
		
		document.onmousemove = function(e){
			if( Math.abs(e.clientY-divTop) <10 || Math.abs(e.clientX-divLeft) <10){
				return;
			}
			if(!sketchDiv){
				sketchDiv = document.createElement("div");
				opaDiv = document.createElement("div");
				sketchDiv.className = 'skecth';
				opaDiv.className = 'opa';
				sketchDiv.innerHTML = selectArr.length;
				document.body.appendChild(sketchDiv);
				document.body.appendChild(opaDiv);
			}
			pengFile = null;
			opaDiv.style.left = e.clientX-5+'px';
			opaDiv.style.top = e.clientY-5+'px';
			sketchDiv.style.left = e.clientX+10+'px';
			sketchDiv.style.top = e.clientY+10+'px';
			a:for(var i=0;i<fileItems.length;i++){
				for(var j=0;j<selectArr.length;j++){
					if(fileItems[i] == selectArr[j]){
						continue a;
					}
				}
				if(peng(fileItems[i],opaDiv)){
					t.addClass(fileItems[i],'hov');
					pengFile = fileItems[i];
				}else{
					t.removeClass(fileItems[i],'hov');
				}
			}
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			
			if(pengFile){
				t.removeClass(pengFile,'hov');
				var fileId = pengFile.dataset.id;
				var selectArr = whoSelected();
				var onOff = false;
				var selectId = [];
				for(var i=0;i<selectArr.length;i++){
					selectId.push(selectArr[i].dataset.id);
				}
				for(var i=0;i<selectId.length;i++){
					var self = handle.getSelfById(datas,selectId[i]);
					var isExist = handle.isTitleExist(datas,self.title,fileId);
					if(!isExist){
						self.pid = fileId;
						fileList.removeChild(selectArr[i]);
					}else{
						onOff = true;
					}
				}
				if(onOff){
					if(selectId.length==1){
						fullTip('warn','文件重名，移动失败');
					}else{
						fullTip('warn','文件重名，部分文件移动失败');
					}
				}else{
					if(!handle.getChildrenById(datas,currentId).length){
						empty.style.display = 'block';
					};
					t.removeClass(checkAll,'checked');
					fullTip('ok','文件移动成功');
				}
				
				treeFn(currentId);
				treeFn2(currentId);
				
			}
			if(sketchDiv){
				document.body.removeChild(sketchDiv);
				document.body.removeChild(opaDiv);
				sketchDiv = null;
				opaDiv = null;
				pengFile = null;
			}
		}
	});
	//-----------------重命名-------------------------------
	var rename = document.getElementById("rename");
	rename.isRename = false;
	function reName(){
		if(!rename.isRename){
			return;
		}
		var selectArr = whoSelected();
		var oFile = selectArr[0];
		var editor = oFile.getElementsByTagName('input')[0];
		var fileName = oFile.getElementsByTagName('span')[0];
		var val = editor.value.trim();
		if(val==''){
			fullTip('warn','文件名不能为空，命名失败');
			editor.style.display = 'none';
			fileName.style.display = 'block';
		}else if(val == fileName.innerHTML){
			editor.style.display = 'none';
			fileName.style.display = 'block';
		}else{
			var isExist = handle.isTitleExist(datas,val,currentId);
			if(!isExist){
				var obj = handle.getSelfById(datas,oFile.dataset.id);
				obj.title = val;
				treeFn(currentId);
				treeFn2(currentId);
				editor.style.display = 'none';
				fileName.style.display = 'block';
				fileName.innerHTML = val;
				fullTip('ok','重命名成功');
				t.removeClass(oFile,'active');
				t.removeClass(oFile.getElementsByTagName('i')[0],'checked');
			}else{
				editor.style.display = 'none';
				fileName.style.display = 'block';
				fullTip('warn','文件名重复，命名失败');
			}
		}
		rename.isRename = false;
	}
	t.on(rename,'click',function(){
		var selectArr = whoSelected();
		if(!selectArr.length){
			fullTip('warn','请选择要重命名的文件');
		}else if(selectArr.length==1){
			var oFile = selectArr[0];
			var editor = oFile.getElementsByTagName('input')[0];
			var fileName = oFile.getElementsByTagName('span')[0];
			editor.style.display = 'block';
			fileName.style.display = 'none';
			editor.value = fileName.innerHTML;
			editor.select();
			editor.onmousedown = function(e){
				e.cancelBubble = true;
			}
			rename.isRename = true;
		}else{
			fullTip('warn','不能命名多个文件');
		}
	});
	t.on(document,'mousedown',reName);
	t.on(document,'keyup',function(e){
		if(e.keyCode==13){
			reName();
		}
	});
	//-------------------------右键点击--------------------------------
	var yjList = document.getElementById("yj-list");
	t.on(fileList,'contextmenu',function(e){
		e.preventDefault();
		var target = e.target;
		if(target == fileList || target.nodeName == 'I'|| target.nodeName == 'INPUT' ){
			return;
		}
		if(target = t.parent(target,'.file-item')){
			yjList.style.display = 'block';
			yjList.style.left = e.clientX +'px';
			yjList.style.top = e.clientY+'px';
			for(var i=0;i<fileItems.length;i++){
				t.removeClass(fileItems[i],'active');
				t.removeClass(fileItems[i].getElementsByTagName('i')[0],'checked');
			}
			t.addClass(target,'active');
			t.addClass(target.getElementsByTagName('i')[0],'checked');
		}
		
	});
	t.on(document,'mousedown',function(e){
		yjList.style.display = 'none';
	});
	
	t.on(yjList,'mousedown',function(e){
		e.stopPropagation();
		
	});
	//右键事件
	t.on(yjList,'click',function(e){
		yjList.style.display = 'none';
		var target = e.target;
		//删除
		if(t.parent(target,'.de')){
			target = t.parent(target,'.de');
			var selectArr = whoSelected();
			var idArr = [];
			if(selectArr.length){
				for(var i=0;i<selectArr.length;i++){
					idArr.push(selectArr[i].dataset.id);
				}
				dialog(
					{
						title:'删除文件',
						content:'确认删除文件吗？',
						okFn(){
							
							handle.delChildrenByIdArr(datas,idArr);
							for(var i=selectArr.length-1;i>=0;i--){
								fileList.removeChild(selectArr[i]);
							}
							fullTip('ok','删除文件成功');
							t.removeClass(checkAll,'checked');
							treeFn(currentId);
							treeFn2(currentId);
							var children = handle.getChildrenById(datas,currentId);
							if(!children.length){
								empty.style.display = 'block';
							}
						}
					}
				);
			}
		}
		//重命名
		if(t.parent(target,'.rn')){
			target = t.parent(target,'.rn');
			var selectArr = whoSelected();
			var oFile = selectArr[0];
			var editor = oFile.getElementsByTagName('input')[0];
			var fileName = oFile.getElementsByTagName('span')[0];
			editor.style.display = 'block';
			fileName.style.display = 'none';
			editor.value = fileName.innerHTML;
			editor.select();
			editor.onmousedown = function(e){
				e.cancelBubble = true;
			}
			rename.isRename = true;
		}
		//移动到
		if(t.parent(target,'.mv')){
			target = t.parent(target,'.mv');
			moveFn();
		}
	})
})();
