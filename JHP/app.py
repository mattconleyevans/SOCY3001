from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from application.query import queryOpenAI
import os
import faiss

app = Flask(__name__, static_folder='frontend/build')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Assuming faiss supports memory mapping or similar functionality
text_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/textArchive.index'))
image_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/imageArchive.index'))

# def read_lines(file_path):
#     with open(file_path, 'r') as file:
#         for line in file:
#             yield line.strip()
#
# text_documents = read_lines(os.path.join(os.path.dirname(__file__), 'application/data/texts.txt'))
# # image_documents = read_lines(os.path.join(os.path.dirname(__file__), 'application/data/images.txt'))
# with open(os.path.join(os.path.dirname(__file__), 'application/data/images.txt'), 'r') as file:
#     image_documents = [line.strip() for i, line in enumerate(file) if 500 <= i < 1000]

# Route to handle the API call from the React app
@app.route('/api/query', methods=['POST'])
def query():
    data = request.json  # Read JSON data from the request
    query_text = data.get('query_text')

    # Run the queryOpenAI function
    response = queryOpenAI(query_text, image_index, text_index)

    return jsonify({"message": response["message"].choices[0].message.content,
                    "images": response["images"]})

# Serve the React app
@app.route('/')
def home():
    return "Home"

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))

#