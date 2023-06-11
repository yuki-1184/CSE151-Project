import { Graphs } from "./sampleTrees.js";

// canvas setup
var canvas = document.getElementById("canvas");
var graphOption = document.getElementById("graphs");
var numNodes = document.getElementById("numNodes");
var runAlgorithmButton = document.getElementById("runAlgorithm");
var ctx = canvas.getContext("2d");
var dots = [];
var lines = [];
var dotCount = 1;
var deleteMode = false;
var createLineMode = false;
var resetAlgorithmMode = false;
var selectedDot1 = null;
var selectedDot2 = null;
var offsetX1 = 0;
var offsetY1 = 0;
var offsetX2 = 0;
var offsetY2 = 0;
var selectedLine = null;
var offsetXLine = 0;
var offsetYLine = 0;

if (graphOption.value == "Graph1") {
  createTemplateGraph(graphOption.value);
}

graphOption.addEventListener("change", function () {
  // If random is selected clear the graph
  let option = graphOption.value;
  runAlgorithmButton.innerHTML = "Run the Algorithm";
  if (option == "Random") {
    clearCanvas();
  } else {
    createTemplateGraph(option);
  }
});

function createTemplateGraph(graph) {
  clearCanvas();
  const nodes = Graphs[graph].nodes;
  const edges = Graphs[graph].edges;

  let size = 15;

  for (let i = 0; i < nodes.length; i++) {
    var dot = new Dot(nodes[i][0], nodes[i][1], size, i);
    dots.push(dot);
  }

  for (let i = 0; i < edges.length; i++) {
    var line = new Line(dots[edges[i][0]], dots[edges[i][1]], edges[i][2], i);
    lines.push(line);
  }

  dot.draw();
  redrawCanvas();
}

function Dot(x, y, size, num) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.num = num;
  this.highlighted = false;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.highlighted ? "#ff0000" : "#000"; // Change color if highlighted
    ctx.fill();

    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.num, this.x, this.y);
  };

  this.isInside = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) <= this.size;
  };
}

function Line(dot1, dot2, weight, idx) {
  this.dot1 = dot1;
  this.dot2 = dot2;
  this.weight = weight;
  this.idx = idx;
  this.highlighted = false;

  this.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.dot1.x, this.dot1.y);
    ctx.lineTo(this.dot2.x, this.dot2.y);
    ctx.strokeStyle = this.highlighted ? "#43d13a" : "#000";
    ctx.stroke();

    var middleX = (this.dot1.x + this.dot2.x) / 2;
    var middleY = (this.dot1.y + this.dot2.y) / 2;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(this.weight, middleX - 5, middleY + 5);
  };

  this.isInside = function (x, y) {
    var length = Math.sqrt(
      (this.dot1.x - this.dot2.x) ** 2 + (this.dot1.y - this.dot2.y) ** 2
    );
    var dotProduct =
      ((x - this.dot1.x) * (this.dot2.x - this.dot1.x) +
        (y - this.dot1.y) * (this.dot2.y - this.dot1.y)) /
      length;
    var distance = Math.sqrt(
      (x - this.dot1.x - (dotProduct * (this.dot2.x - this.dot1.x)) / length) **
        2 +
        (y -
          this.dot1.y -
          (dotProduct * (this.dot2.y - this.dot1.y)) / length) **
          2
    );
    return distance <= 5;
  };
}

function createDot() {
  var size = 15;
  var num = getNextNumber();

  // Generate random coordinates within the canvas
  var centerX = Math.random() * (canvas.width - 2 * size) + size;
  var centerY = Math.random() * (canvas.height - 2 * size) + size;

  var dot = new Dot(centerX, centerY, size, num);
  dots.push(dot);
  dot.draw();
  redrawCanvas();
}

function getNextNumber() {
  var numbers = dots.map(function (dot) {
    return dot.num;
  });

  var nextNumber = 0;
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
    // Code for deleting a dot or line
    for (var i = dots.length - 1; i >= 0; i--) {
      dots[i].highlighted = dots[i].isInside(x, y);
    }

    for (var i = lines.length - 1; i >= 0; i--) {
      lines[i].highlighted = lines[i].isInside(x, y);
    }

    for (var i = lines.length - 1; i >= 0; i--) {
      if (lines[i].isInside(x, y)) {
        lines.splice(i, 1); // Remove the selected line
        redrawCanvas();
        return;
      }
    }

    dots = dots.filter(function (dot) {
      return !dot.highlighted;
    });

    lines = lines.filter(function (line) {
      return !line.highlighted;
    });

    redrawCanvas();
  } else if (createLineMode) {
    // Code for creating a line
    if (!selectedDot1) {
      // Select the first dot
      for (var i = dots.length - 1; i >= 0; i--) {
        if (dots[i].isInside(x, y)) {
          selectedDot1 = dots[i];
          offsetX1 = x - selectedDot1.x;
          offsetY1 = y - selectedDot1.y;
          break;
        }
      }
    } else if (!selectedDot2) {
      // Select the second dot
      for (var i = dots.length - 1; i >= 0; i--) {
        if (dots[i].isInside(x, y) && dots[i] !== selectedDot1) {
          selectedDot2 = dots[i];
          offsetX2 = x - selectedDot2.x;
          offsetY2 = y - selectedDot2.y;
          var weight = Math.floor(Math.random() * 99) + 1; // Random weight between 1 and 99
          var line = new Line(selectedDot1, selectedDot2, weight, lines.length);
          lines.push(line);
          // reset the selectedDot
          selectedDot1 = null;
          selectedDot2 = null;
          redrawCanvas();
          break;
        }
      }
    }
  } else {
    // Code for selecting a dot
    for (var i = dots.length - 1; i >= 0; i--) {
      if (dots[i].isInside(x, y)) {
        selectedDot1 = dots[i];
        offsetX1 = x - selectedDot1.x;
        offsetY1 = y - selectedDot1.y;
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        break;
      }
    }

    // Code for modifying line weight through double-clicking
    if (event.detail === 2) {
      // Double-click event
      for (var i = lines.length - 1; i >= 0; i--) {
        if (lines[i].isInside(x, y)) {
          var newWeight = prompt(
            "Enter new weight for the line:",
            lines[i].weight
          );
          if (newWeight !== null && !isNaN(newWeight)) {
            lines[i].weight = parseInt(newWeight);
            redrawCanvas();
          }
          break;
        }
      }
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
    selectedLine.dot2.x =
      x - offsetXLine + selectedLine.dot2.x - selectedLine.dot1.x;
    selectedLine.dot2.y =
      y - offsetYLine + selectedLine.dot2.y - selectedLine.dot1.y;
    redrawCanvas();
  }
}

function handleMouseUp() {
  selectedDot1 = null;
  offsetX1 = 0;
  offsetY1 = 0;
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);
}

function handleMouseUpLine() {
  selectedLine = null;
  offsetXLine = 0;
  offsetYLine = 0;
  canvas.removeEventListener("mousemove", handleMouseMoveLine);
  canvas.removeEventListener("mouseup", handleMouseUpLine);
}

function deleteDotAndConnectedLines(dot) {
  dots = dots.filter(function (d) {
    return d !== dot;
  });

  lines = lines.filter(function (line) {
    return line.dot1 !== dot && line.dot2 !== dot;
  });

  // Delete connections
  for (var i = lines.length - 1; i >= 0; i--) {
    if (lines[i].dot1 === dot || lines[i].dot2 === dot) {
      lines.splice(i, 1);
    }
  }

  redrawCanvas();
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  numNodes.innerHTML = "Number of Nodes : " + dots.length;

  for (var i = 0; i < lines.length; i++) {
    lines[i].draw();
  }

  for (var i = 0; i < dots.length; i++) {
    dots[i].draw();
  }
}

function runAlgorithm() {
  resetAlgorithmMode = !resetAlgorithmMode;

  if (resetAlgorithmMode) {
    runAlgorithmButton.innerHTML = "Run the Algorithm";
    lines.forEach((line) => {
      line.highlighted = false;
    });
    redrawCanvas();
  } else {
    const data = {
      nodes: dots,
      edges: lines,
    };
    fetch("/kruskal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const usedLines = data.lines;
        usedLines.forEach((line) => {
          lines[line]["highlighted"] = true;
        });
        runAlgorithmButton.innerHTML = "Reset the Algorithm";
        redrawCanvas();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function toggleDeleteMode() {
  deleteMode = !deleteMode;
  if (deleteMode) {
    document.getElementById("deleteDots").classList.add("active");
  } else {
    document.getElementById("deleteDots").classList.remove("active");
  }
}

function toggleCreateLineMode() {
  createLineMode = !createLineMode;
  if (createLineMode) {
    document.getElementById("createLine").classList.add("active");
  } else {
    document.getElementById("createLine").classList.remove("active");
    selectedDot1 = null;
    selectedDot2 = null;
  }
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    if (createLineMode) {
      exitCreateLineMode();
    }
    if (deleteMode) {
      toggleDeleteMode();
    }
  }
}

function clearCanvas() {
  dots = [];
  lines = [];
  redrawCanvas();
}

document.getElementById("runAlgorithm").addEventListener("click", runAlgorithm);
document.getElementById("clear").addEventListener("click", clearCanvas);
document.getElementById("createDot").addEventListener("click", createDot);
document
  .getElementById("deleteDots")
  .addEventListener("click", toggleDeleteMode);
document
  .getElementById("createLine")
  .addEventListener("click", toggleCreateLineMode);
canvas.addEventListener("mousedown", handleMouseDown);
document.addEventListener("keydown", handleKeyDown);
