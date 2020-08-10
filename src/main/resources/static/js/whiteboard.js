(function() {
	/* get a regular interval for drawing to the screen */
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimaitonFrame || function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	/* set up the canvas */
	var canvas = document.getElementById("whiteboard-canvas");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#000";
	ctx.lineWith = 2;

	var clearBtn = document.getElementById("white-board-eraser");
	clearBtn.addEventListener("click", function(e) {
		clearCanvas();
	}, false);

	/* set up mouse events for drawing */
	var drawing = false;
	var mousePos = {
		x : 0,
		y : 0
	};
	var lastPos = mousePos;
	canvas.width = 700;
	canvas.height = 400;
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.addEventListener("mousedown", function(e) {
		drawing = true;
		lastPos = getMousePos(canvas, e);
	}, false);
	canvas.addEventListener("mouseup", function(e) {
		drawing = false;
	}, false);
	canvas.addEventListener("mousemove", function(e) {
		mousePos = getMousePos(canvas, e);
	}, false);

	/* set up touch events */
	canvas.addEventListener("touchstart", function(e) {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX : touch.clientX,
			clientY : touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function(e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchmove", function(e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX : touch.clientX,
			clientY : touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	/* to prevent scrolling when touching the canvas */
	document.body.addEventListener("touchstart", function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchend", function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchmove", function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);

	/* get the position of the mouse relative to the canvas */
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x : mouseEvent.clientX - rect.left,
			y : mouseEvent.clientY - rect.top
		};
	}

	/* get the position of a touch relative to the canvas */
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x : touchEvent.touches[0].clientX - rect.left,
			y : touchEvent.touches[0].clientY - rect.top
		};
	}

	/* to draw to the canvas */
	function renderCanvas() {
		if (drawing) {
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	/* clear canvas */
	function clearCanvas() {
		canvas.width = canvas.width;
	}

	/* to allow for animation */
	(function drawLoop() {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

})();