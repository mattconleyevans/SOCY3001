from flask import Flask, request, jsonify, send_from_directory
from getData import queryOpenAI
import os

app = Flask(__name__, static_folder='frontend/build')

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query_text = data.get('query_text')
    response = queryOpenAI(query_text, image_index, text_index)
    return jsonify({"response": response.choices[0].message.content})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)