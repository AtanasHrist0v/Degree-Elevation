var canvas = document.getElementById("curve")
var ctx = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 500;

var pointRadius = 5;
var isMoving = false;

var controlPoints = [[canvas.width / 2 - 200, canvas.height / 2 + 120],
[canvas.width / 2, canvas.height / 2 - 200],
[canvas.width / 2 + 200, canvas.height / 2 + 120]];

function init() {
    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 1;
    for (var i = 0; i < controlPoints.length; i++) {
        ctx.lineTo(controlPoints[i][0], controlPoints[i][1]);
    }
    ctx.stroke();

    drawBezierCurveCasteljau();

    ctx.beginPath();
    for (var i = 0; i < controlPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(controlPoints[i][0], controlPoints[i][1], pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Degree: " + (controlPoints.length - 1), 10, 30);
}

function drawBezierCurveCasteljau() {
    var t = 0.0;
    var curveDegree = controlPoints.length - 1;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 2;

    for (var i = 0; i <= 100; i++) {
        var controlArr = [...controlPoints];
        for (var j = 0; j < curveDegree; j++) {
            for (var r = 0; r < curveDegree - j; r++) {
                var newX = (1 - t) * controlArr[r][0] + t * controlArr[r + 1][0];
                var newY = (1 - t) * controlArr[r][1] + t * controlArr[r + 1][1];
                controlArr[r] = [newX, newY];
            }
        }
        t += 0.01;
        ctx.lineTo(controlArr[0][0], controlArr[0][1]);
    }
    ctx.stroke();
}

var movingPoint;

canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;

    for (var p = 0; p < controlPoints.length; p++) {
        if (cursorOnControlPoint(x, y, controlPoints[p])) {
            movingPoint = p;
            isMoving = true;
            return true;
        }
    }
    return false;
})

canvas.addEventListener('mousemove', e => {
    if (isMoving == true) {
        x = e.offsetX;
        y = e.offsetY;

        controlPoints[movingPoint] = [x, y];
        clearCanvas();
        init();
    }
})

window.addEventListener('mouseup', _ => {
    isMoving = false;
})

function cursorOnControlPoint(x, y, point) {
    var epsilon = pointRadius + 1;
    return Math.abs(x - point[0]) <= epsilon && Math.abs(y - point[1]) <= epsilon;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function increaseDegree() {
    var newControlPoints = [];
    newControlPoints.push(controlPoints[0]);
    var n = controlPoints.length;

    for (var i = 1; i < n; i++) {
        newX = (i / n) * controlPoints[i - 1][0] + ((n - i) / n) * controlPoints[i][0];
        newY = (i / n) * controlPoints[i - 1][1] + ((n - i) / n) * controlPoints[i][1];
        newControlPoints.push([newX, newY]);
    }

    newControlPoints.push(controlPoints[n - 1]);
    controlPoints = newControlPoints;

    clearCanvas();
    init();
}
