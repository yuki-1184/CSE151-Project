from flask import Flask, render_template, jsonify, request
from kruskalMST import KruskalGraph
from primMST import PrimGraph

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/kruskal', methods=['POST'])
def kruskal_algorithm():
    data = request.get_json()

    g = KruskalGraph(len(data['nodes']))
    for edge in data['edges']:
        g.addEdge(edge['dot1']['num'], edge['dot2']
                  ['num'], edge['idx'], edge['weight'])

    output = []
    cost, output = g.KruskalMST()
    print(cost, output)

    return jsonify({'minCost': cost, 'lines': output})


@app.route('/prim', methods=["POST"])
def prim_algorithm():
    data = request.get_json()

    num_nodes = len(data['nodes'])
    g = PrimGraph(len(data['nodes']))
    grid = [[0 for x in range(num_nodes)] for y in range(num_nodes)]
    lst_lines = []
    for edge in data['edges']:
        grid[edge['dot1']['num']][edge['dot2']['num']] = edge['weight']
        grid[edge['dot2']['num']][edge['dot1']['num']] = edge['weight']
        lst_lines.append(
            {edge['dot1']['num'], edge['dot2']['num'], edge['weight']})
    g.graph = grid

    output = []
    lines = []
    cost, output = g.primMST()
    for out in output:
        lines.append(lst_lines.index(out))

    return jsonify({'minCost': cost, 'lines': lines})


if __name__ == '__main__':
    app.run(debug=True)
