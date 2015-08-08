var INIT_COLOR = "#DCDCDC"
var USED_COLOR_SIZE = 5;
var MIN_BTN_SIZE = 15;
var MAX_BTN_SIZE = 40;
var currentColor = "#DCDCDC";
var usedColor = [];

function chooseErase() {
	currentColor = INIT_COLOR;
	$('#btnCurrentColor').css('background-color', INIT_COLOR);
}

function setUsedColor(usedColor) {
	for (var i = 0 ; i < USED_COLOR_SIZE ; i++) {
		$('#btnUsedColor' + i.toString()).css('background-color', usedColor[i]);
	}
}

function canvasZoomOut() {
	var currentSize = $(".btn-canvas").outerWidth();
	
	if (currentSize < MIN_BTN_SIZE)
		return;
	
	var targetSize = currentSize - 1;
	
	if (targetSize < MIN_BTN_SIZE) {
		targetSize = MIN_BTN_SIZE;
	}

	$(".btn-canvas").css( "width", targetSize);
	$(".btn-canvas").css( "height", targetSize);
}

function canvasZoomIn() {
	var currentSize = $(".btn-canvas").outerWidth();
	var targetSize = currentSize + 1;	
	
	var canvasWidth = $("#canvas").innerWidth();
	var nCols = parseInt($("#numCol").val());
	
	if (targetSize > (canvasWidth - 10) / nCols) {
		targetSize = Math.floor((canvasWidth - 10) / nCols);
	}
	
	if (targetSize > MAX_BTN_SIZE) {
		targetSize = MAX_BTN_SIZE;
	}

	$(".btn-canvas").css( "width", targetSize);
	$(".btn-canvas").css( "height", targetSize);
}

function chooseColor(obj) {
	currentColor = obj.style.backgroundColor;
	$('#btnCurrentColor').css('background-color', currentColor);
	
	if (usedColor.indexOf(currentColor) != -1)
		return;
	
	if (usedColor.length >= USED_COLOR_SIZE) {
		usedColor.shift();
	}
	usedColor.push(currentColor);
	
	setUsedColor(usedColor);
}

function chooseUsedColor(obj) {
	currentColor = obj.style.backgroundColor;
	$('#btnCurrentColor').css('background-color', currentColor);
}

function assignColor(obj) {
	obj.style.backgroundColor = currentColor;
}

function createCanvas() {
	var nRows = parseInt($('#numRow').val());
	var nCols = parseInt($('#numCol').val());
	var canvas = document.getElementById('canvas');
	
	var btnSizeDefault = 26;
	var canvasSize = $('#canvas').innerWidth();
	
	if ((btnSizeDefault + 1) * nCols > canvasSize) {
		btnSizeDefault = Math.floor(canvasSize / nCols);
	}
	
	if (nRows.length == 0 && nCols.length == 0) {
		alert("Please specify rows and columns.");
		return;
	}
	
	if (nCols > 35) {
		alert("not support col > 35 now");
		return;
	}
	
	if (canvas.childElementCount != 0) {
		alert("Please reset web page");
		return;
	}
	
	for(i = 0 ; i < nRows ; i++) {
		//$('#canvas').append('<div></div>').attr('role', 'group').attr('style', 'vertical-align: middle');
		var btnGroup = document.createElement('div');
		
		var attRole = document.createAttribute('role');
		attRole.value = "group";
		btnGroup.setAttributeNode(attRole);
		
		var attStyle = document.createAttribute('style');
		attStyle.value = "vertical-align: middle;";
		btnGroup.setAttributeNode(attStyle);
		
		canvas.appendChild(btnGroup);
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
		}
	}
}