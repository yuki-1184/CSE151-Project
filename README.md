# CSE151-Project


<!DOCTYPE html>
<html>
<head>
    <title>Minimum Spanning Tree Emulator</title>
</head>
<body>
    <h1>Minimum Spanning Tree Emulator</h1>
  <h2>Running the Code</h2>
<p>We made a Python system that can emulate the Minimum Spanning Tree. Follow the steps below to run our application.</p>

<h3>Steps:</h3>
<ol>
    <li>Install Python: In order to run our app, you need to have "Python" and "Flask" installed on your PC. To install Python, visit the official Python website (<a href="https://www.python.org/">https://www.python.org/</a>) and download the latest version of Python suitable for your operating system.</li>
    <li>Install Flask: Install Flask by typing the following command: <code>pip install flask</code></li>
    <li>Once Python and Flask are installed, go to <code>CSE151-Project/</code> directory where <code>app.py</code> is located at. Run the following command: <code>python3 app.py</code></li>
    <li>Flask will start the server on the default address <code>http://127.0.0.1:5000/</code></li>
    <li>Test the Flask app: Open a web browser and visit <code>http://127.0.0.1:5000/</code> (or <code>http://localhost:5000/</code>)</li>
</ol>

<h2>Getting Started</h2>
<p>The Canvas can be modified by adding dots or lines. Dots on the canvas can be dragged and dropped around the Canvas to the user's preference. The weight of the lines can be changed by double clicking on the lines and inputting new weights.</p>

<p>The right side of the screen will indicate which algorithm (Kruskal or Prim) the MST will run. The option of generating premade Graph1 and Graph2 can be selected. The information of dots, lines, and the weight of each line will be listed below. Using the "Run the Algorithm" button will process the MST algorithm on the presented graph on the canvas.</p>

<p>After running the algorithm, the shortest path will turn green, and the total weight of the chosen lines will be presented as Minimum Cost. Watch the included video for more information.</p>

<h2>Controls</h2>
<ul>
    <li><strong>Create Dot:</strong> The Create Dot button will generate a Dot on the Canvas in a random location.</li>
    <li><strong>Create Line:</strong> Creates a Line between two clicked dots with a randomly generated weight. This mode can be exited by pressing the button again.</li>
    <li><strong>Clear Canvas:</strong> When pressing this button, it will clear the Canvas.</li>
</ul>

<p><strong>Disclaimer:</strong> The MST will not run when the dots are not a connected acyclic graph.</p>
 </body>
</html>
