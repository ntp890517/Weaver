function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Action(start, end, color) {
	this.start = start;
	this.end = end;
	this.color = color;
}

function Tool() {
	this.INIT_COLOR = "#DCDCDC";
	this.USED_COLOR_SIZE = 5;
	this.ACTIONS_MAX_SIZE = 10;
	
	this.currentColor = this.INIT_COLOR;
	this.usedColor = [];
	this.actions = [];
	this.canvas = null;
	
	this.setUsedColor = function(color) {
		if (this.usedColor.indexOf(color) != -1)
			return;
			
		if (this.usedColor.length >= this.USED_COLOR_SIZE) {
			this.usedColor.shift();
		}
		this.usedColor.push(color);
	}
	
	this.getCurrentColor = function() {
		return this.currentColor;
	}
	
	this.getUsedColor = function() {
		return this.usedColor;
	}

	this.chooseColor = function(color) {
		this.currentColor = color;
		
		this.setUsedColor(color);
	}
	
	this.chooseErase = function() {
		this.currentColor = this.INIT_COLOR;
	}
	
	this.createCanvas = function(obj, nRows, nCols) {
		this.canvas = new Canvas(obj, nRows, nCols);
	}
}

function Canvas(obj, nRows, nCols) {
	this.MIN_BTN_SIZE = 15;
	this.MAX_BTN_SIZE = 40;

	this.obj = obj;
	this.grid = [];
	
	for (i = 0 ; i < nRows ; i++) {
		var btnGroup = document.createElement('div');
		
		var attRole = document.createAttribute('role');
		attRole.value = "group";
		btnGroup.setAttributeNode(attRole);
		
		var attStyle = document.createAttribute('style');
		attStyle.value = "vertical-align: middle;";
		btnGroup.setAttributeNode(attStyle);
		
		this.obj.appendChild(btnGroup);
		this.grid.push(new Array());
		for(j = 0 ; j < nCols ; j++) {
			var btn = document.createElement('button');
			var attClass = document.createAttribute('class');
			attClass.value = "btn btn-canvas";
			var attType = document.createAttribute('type');
			attType.value = "button";
			var attStyle = document.createAttribute('style');
			attStyle.value = "height:" + btnSizeDefault.toString() + "px;\
			                  width:" + btnSizeDefault.toString() + "px;\
							  margin:0px;padding:0px;border: solid #ffffff 1px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;";
			var attType = document.createAttribute('type');
			btn.setAttributeNode(attType);
			btn.setAttributeNode(attClass);
			btn.setAttributeNode(attStyle);
			btn.addEventListener("click", function() {assignColor(this); });
			btnGroup.appendChild(btn);
			
			this.grid[i].push(btn);
		}
	}
}