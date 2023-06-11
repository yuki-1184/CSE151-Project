from flask import Flask, render_template, jsonify, request
from kruskalMST import Graph

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/kruskal', methods=['POST'])
def kruskal_algorithm():
    data = request.get_json()
    print(data['edges'])

    g = Graph(len(data['nodes']))
    for edge in data['edges']:
        g.addEdge(edge['dot1']['num'], edge['dot2']['num'], edge['idx'], edge['weight'])

    output = []
    cost, output = g.KruskalMST()
    print(cost, output)

    return jsonify({'minCost': cost, 'lines': output})


if __name__ == '__main__':
    app.run(debug=True)


# {'nodes': [{'x': 50, 'y': 250, 'size': 15, 'num': 0, 'highlighted': False}, {'x': 150, 'y': 250, 'size': 15, 'num': 1, 'highlighted': False}, {'x': 300, 'y': 100, 'size': 15, 'num': 2, 'highlighted': False}, {'x': 300, 'y': 400, 'size': 15, 'num': 3, 'highlighted': False}, {'x': 450, 'y': 250, 'size': 15, 'num': 4, 'highlighted': False}, {'x': 550, 'y': 250, 'size': 15, 'num': 5, 'highlighted': False}], 'edges': [{'dot1': {'x': 300, 'y': 400, 'size': 15, 'num': 3, 'highlighted': False}, 'dot2': {'x': 150, 'y': 250, 'size': 15, 'num': 1, 'highlighted': False}, 'weight': 5}, {'dot1': {'x': 150, 'y': 250, 'size': 15, 'num': 1, 'highlighted': False}, 'dot2': {'x': 300, 'y': 100, 'size': 15, 'num': 2, 'highlighted': False}, 'weight': 10}, {'dot1': {'x': 450, 'y': 250, 'size': 15, 'num': 4, 'highlighted': False}, 'dot2': {'x': 300, 'y': 400, 'size': 15, 'num': 3, 'highlighted': False}, 'weight': 5}, {'dot1': {'x': 300, 'y': 100, 'size': 15, 'num': 2, 'highlighted': False}, 'dot2': {'x': 450, 'y': 250, 'size': 15, 'num': 4, 'highlighted': False}, 'weight': 7}, {'dot1': {'x': 450, 'y': 250, 'size': 15, 'num': 4, 'highlighted': False}, 'dot2': {'x': 550, 'y': 250, 'size': 15, 'num': 5, 'highlighted': False}, 'weight': 15}, {'dot1': {'x': 50, 'y': 250, 'size': 15, 'num': 0, 'highlighted': False}, 'dot2': {'x': 150, 'y': 250, 'size': 15, 'num': 1, 'highlighted': False}, 'weight': 10}]}
