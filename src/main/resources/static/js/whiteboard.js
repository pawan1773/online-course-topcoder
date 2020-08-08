var clearButton = document.getElementById('white-board-eraser');
    var canvascontainer = document.getElementById('whiteboard-canvas-container');
    var canvas = document.getElementById('whiteboard-canvas');
    var context = canvas.getContext('2d');
    var radius = (document.getElementById('whiteboard-canvas-container').clientWidth + document.getElementById('whiteboard-canvas-container').clientHeight) / 150;
    var dragging = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    canvas.width = 1280;
    canvas.height = 720;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    /* CLEAR CANVAS */
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    clearButton.addEventListener('click', clearCanvas);

    function getMousePosition(e) {
        var mouseX = e.offsetX * canvas.width / canvas.clientWidth | 0;
        var mouseY = e.offsetY * canvas.height / canvas.clientHeight | 0;
        return {x: mouseX, y: mouseY};
    }

    var putPoint = function (e) {
    	e.preventDefault();
        e.stopPropagation();
        if (dragging) {
            context.lineTo(getMousePosition(e).x, getMousePosition(e).y);
            context.lineWidth = radius * 2;
            context.stroke();
            context.beginPath();
            context.arc(getMousePosition(e).x, getMousePosition(e).y, radius, 0, Math.PI * 2);
            context.fill();
            context.beginPath();
            context.moveTo(getMousePosition(e).x, getMousePosition(e).y);
        }
    };

    var engage = function (e) {
        dragging = true;
        putPoint(e);
    };
    var disengage = function () {
        dragging = false;
        context.beginPath();
    };
    
    canvas.addEventListener("touchmove", function (e) {
    	  var touch = e.touches[0];
    	  var mouseEvent = new MouseEvent("mousemove", {
    	    clientX: touch.clientX,
    	    clientY: touch.clientY
    	  });
    	  canvas.dispatchEvent(mouseEvent);
    	}, false);
    
   
    canvas.addEventListener('mousedown', engage);
    canvas.addEventListener('touchstart', engage);
    canvas.addEventListener('mousemove', putPoint);
    canvas.addEventListener('mouseup', disengage);
    canvas.addEventListener('touchend', disengage);
    document.addEventListener('mouseup', disengage);
    canvas.addEventListener('contextmenu', disengage);
