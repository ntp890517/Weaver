function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Tool() {
	this.INIT_COLOR = "#DCDCDC";
	this.USED_COLOR_SIZE = 5;
	
	this.currentColor = INIT_COLOR;
	this.usedColor = [];
	
	this.setUsedColor = function(color) {
		if (this.usedColor.indexOf(color) != -1)
			return;
			
		if (this.usedColor.length >= this.USED_COLOR_SIZE) {
			this.usedColor.shift();
		}
		this.usedColor.push(color);
	}
	
	this.prototype.chooseColor = function(color) {
		this.currentColor = color;
		
		this.setUsedColor(color);
	}
	
	this.prototype.chooseErase = function() {
		this.currentColor = this.INIT_COLOR;
	}
}

function Canvas(obj) {
	this.MIN_BTN_SIZE = 15;
	this.MAX_BTN_SIZE = 40;

	this.obj = obj;
}