var INIT_COLOR = "#DCDCDC";
var USED_COLOR_SIZE = 5;
var MIN_BTN_SIZE = 15;
var MAX_BTN_SIZE = 40;
var ACTIONS_SIZE = 5;
var currentColor = "#DCDCDC";
var usedColor = [];
var zoneMode = false;
var actions = [];
var selectedGrid = [];
var canvasRows = 0;
var canvasCols = 0;

var Point = function(row, col) {
	this.row = parseInt(row);
	this.col = parseInt(col);
}

var Action = function(start, end, color) {
	this.start = start;
	this.end = end;
	this.color = color;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function collectPixels() {
    var result = "";
    for(i = 0 ; i < canvasRows ; i++) {
		for(j = 0 ; j < canvasCols ; j++) {
            var btnName = '#btnCanvas_' + i.toString() + '_' + j.toString();
            var color = $(btnName).css('background-color');
            result = result + rgb2hex(color);
            if (i != canvasRows-1 || j != canvasCols-1) {
                result = result + ',';
            }
		}
	}
    return result;
}

function saveDesign() {
    if (canvasRows == 0 || canvasCols == 0) {
        alert('尚未有設計圖');
    } else {
        $.ajax({
            type : "POST",
            url : "/save",
            data : {
                x : canvasCols,
                y : canvasRows,
                pixelArray : collectPixels(),
                csrfmiddlewaretoken : getCookie('csrftoken')
            },
            dataType: 'json',
            }).done(function(data){
                window.open(data['url']);
            });
    }
	//var greys = bmp_rgb(5, 1, ['000000','333333', '666666', '999999', '000000']);
}

function toggleZoneMode() {
	if (zoneMode) {
		zoneMode = false;
	} else {
		zoneMode = true;
	}
}

function selectGrid(obj) {
	var id = obj.id;
	var row = id.split('_')[1];
	var col = id.split('_')[2];
	var point = new Point(row, col);
	var action = null;

	if (!zoneMode) {
		action = new Action(point, point, currentColor);
	} else {
		if (selectedGrid.length == 1) {
			action = new Action(selectedGrid[0], point, currentColor);
			selectedGrid = [];
		} else {
			selectedGrid.push(point);
		}
	}
	
	if (action) {
		assignColor(action);
	}
}

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

function assignColor(action) {
	var p1 = action.start;
	var p2 = action.end;

	if (p1.row > p2.row) {
		var maxRow = p1.row;
		var minRow = p2.row;
	} else {
		var maxRow = p2.row;
		var minRow = p1.row;
	}
	
	if (p1.col > p2.col) {
		var maxCol = p1.col;
		var minCol = p2.col;
	} else {
		var maxCol = p2.col;
		var minCol = p1.col;
	}
	
	for (var i = minRow ; i <= maxRow ; i++) {
		for (var j = minCol ; j <= maxCol ; j++) {
			$('#btnCanvas_'+i+'_'+j).css('background-color', action.color);
		}
	}
	
	if (actions.length >= ACTIONS_SIZE) {
		actions.shift();
		actions.push(action);
	} else {
		actions.push(action);
	}
}

function createCanvas() {
	var nRows = parseInt($('#numRow').val());
	var nCols = parseInt($('#numCol').val());
	var canvas = document.getElementById('canvas');
	
	canvasRows = nRows;
	canvasCols = nCols;
	
	var btnSizeDefault = 26;
	var canvasSize = $('#canvas').innerWidth();
	
	if ((btnSizeDefault + 1) * nCols > canvasSize) {
		btnSizeDefault = Math.floor(canvasSize / nCols);
	}
	
	if (nRows.length == 0 && nCols.length == 0) {
		alert("Please specify rows and columns.");
		return;
	}
	
	if (nCols > 46) {
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
			var attId = document.createAttribute('id');
			attId.value = "btnCanvas_" + i.toString() + "_" + j.toString() ;
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
			btn.setAttributeNode(attId);
			btn.addEventListener("click", function() {selectGrid(this); });
			btnGroup.appendChild(btn);
		}
	}
}