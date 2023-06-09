var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var dots = [];
var lines = [];
var dotCount = 1;
var deleteMode = false;
var createLineMode = false;
var selectedDot1 = null;
var selectedDot2 = null;
var offsetX1 = 0;
var offsetY1 = 0;
var offsetX2 = 0;
var offsetY2 = 0;
var selectedLine = null;
var offsetXLine = 0;
var offsetYLine = 0;

function Dot(x, y, size, num) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.num = num;
    this.highlighted = false;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.highlighted ? 'red' : 'green';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.font = '14px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.num, this.x - 5, this.y + 5);
    }

    this.isInside = function(x, y) {
        var dx = this.x - x;
        var dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= this.size;
    }
}

function Line(dot1, dot2, weight) {
    this.dot1 = dot1;
    this.dot2 = dot2;
    this.weight = weight;

    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.dot1.x, this.dot1.y);
        ctx.lineTo(this.dot2.x, this.dot2.y);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        var middleX = (this.dot1.x + this.dot2.x) / 2;
        var middleY = (this.dot1.y + this.dot2.y) / 2;
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(this.weight, middleX - 5, middleY + 5);
    }

    this.isInside = function(x, y) {
        var length = Math.sqrt((this.dot1.x - this.dot2.x) ** 2 + (this.dot1.y - this.dot2.y) ** 2);
        var dotProduct = ((x - this.dot1.x) * (this.dot2.x - this.dot1.x) + (y - this.dot1.y) * (this.dot2.y - this.dot1.y)) / length;
        var distance = Math.sqrt((x - this.dot1.x - dotProduct * (this.dot2.x - this.dot1.x) / length) ** 2 + (y - this.dot1.y - dotProduct * (this.dot2.y - this.dot1.y) / length) ** 2);
        return distance <= 5;
    }
}

function createDot() {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var size = 20;
    var num = getNextNumber();

    var dot = new Dot(centerX, centerY, size, num);
    dots.push(dot);
    dot.draw();
}

function getNextNumber() {
    var numbers = dots.map(function(dot) {
        return dot.num;
    });

    var nextNumber = 1;
    while (numbers.includes(nextNumber)) {
        nextNumber++;
    }

    return nextNumber;
}

function handleMouseDown(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (deleteMode) {
        for (var i = dots.length - 1; i >= 0; i--) {
            if (dots[i].isInside(x, y)) {
                deleteDotAndConnectedLines(dots[i]);
                break;
            }
        }
    } else if (createLineMode) {
        if (!selectedDot1) {
            for (var i = dots.length - 1; i >= 0; i--) {
                if (dots[i].isInside(x, y)) {
                    selectedDot1 = dots[i];
                    offsetX1 = x - selectedDot1.x;
                    offsetY1 = y - selectedDot1.y;
                    break;
                }
            }
        } else if (!selectedDot2) {
            for (var i = dots.length - 1; i >= 0; i--) {
                if (dots[i].isInside(x, y)) {
                    selectedDot2 = dots[i];
                    offsetX2 = x - selectedDot2.x;
                    offsetY2 = y - selectedDot2.y;
                    var weight = prompt('Enter the weight:');
                    if (weight) {
                        var line = new Line(selectedDot1, selectedDot2, weight);
                        lines.push(line);
                        redrawCanvas();
                    }
                    break;
                }
            }
        }
    } else {
        for (var i = dots.length - 1; i >= 0; i--) {
            if (dots[i].isInside(x, y)) {
                selectedDot1 = dots[i];
                offsetX1 = x - selectedDot1.x;
                offsetY1 = y - selectedDot1.y;
                canvas.addEventListener('mousemove', handleMouseMove);
                canvas.addEventListener('mouseup', handleMouseUp);
                break;
            }
        }
    }

    for (var i = lines.length - 1; i >= 0; i--) {
        if (lines[i].isInside(x, y)) {
            selectedLine = lines[i];
            offsetXLine = x - selectedLine.dot1.x;
            offsetYLine = y - selectedLine.dot1.y;
            canvas.addEventListener('mousemove', handleMouseMoveLine);
            canvas.addEventListener('mouseup', handleMouseUpLine);
            break;
        }
    }
}

function handleMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (selectedDot1) {
        selectedDot1.x = x - offsetX1;
        selectedDot1.y = y - offsetY1;
        redrawCanvas();
    }
}

function handleMouseMoveLine(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (selectedLine) {
        selectedLine.dot1.x = x - offsetXLine;
        selectedLine.dot1.y = y - offsetYLine;
        selectedLine.dot2.x = x - offsetXLine + selectedLine.dot2.x - selectedLine.dot1.x;
        selectedLine.dot2.y = y - offsetYLine + selectedLine.dot2.y - selectedLine.dot1.y;
        redrawCanvas();
    }
}

function handleMouseUp() {
    selectedDot1 = null;
    offsetX1 = 0;
    offsetY1 = 0;
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
}

function handleMouseUpLine() {
    selectedLine = null;
    offsetXLine = 0;
    offsetYLine = 0;
    canvas.removeEventListener('mousemove', handleMouseMoveLine);
    canvas.removeEventListener('mouseup', handleMouseUpLine);
}

function deleteDotAndConnectedLines(dot) {
    dots = dots.filter(function(d) {
        return d !== dot;
    });

    lines = lines.filter(function(line) {
        return line.dot1 !== dot && line.dot2 !== dot;
    });

    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < lines.length; i++) {
        lines[i].draw();
    }

    for (var i = 0; i < dots.length; i++) {
        dots[i].draw();
    }
}

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    if (deleteMode) {
        document.getElementById('deleteDots').classList.add('active');
    } else {
        document.getElementById('deleteDots').classList.remove('active');
    }
}

function toggleCreateLineMode() {
    createLineMode = !createLineMode;
    if (createLineMode) {
        document.getElementById('createLine').classList.add('active');
    } else {
        document.getElementById('createLine').classList.remove('active');
        selectedDot1 = null;
        selectedDot2 = null;
    }
}

document.getElementById('createDot').addEventListener('click', createDot);
document.getElementById('deleteDots').addEventListener('click', toggleDeleteMode);
document.getElementById('createLine').addEventListener('click', toggleCreateLineMode);
canvas.addEventListener('mousedown', handleMouseDown);