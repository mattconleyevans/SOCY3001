from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from traits.trait_types import false
from application.query import queryOpenAI
import os
import faiss
import logging
import clip
import torch
from application.clip_model import get_clip_model

print(clip.available_models())

model, preprocess = get_clip_model()

app = Flask(__name__, static_folder='frontend/build')
CORS(app, resources={r"/api/*": {"origins": "*"}})
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
#

text_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/textArchive.index'))
image_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/imageArchive.index'))

with open(os.path.join(os.path.dirname(__file__), 'application/data/texts.txt'), 'r') as text_file:
    text_documents = [line.strip() for line in text_file]

with open(os.path.join(os.path.dirname(__file__), 'application/data/images.txt'), 'r') as image_file:
    image_documents = [line.strip() for line in image_file]

# Route to handle the API call from the React app
@app.route('/api/query', methods=['POST'])
def query():

    data = request.json
    query_text = data.get('query_text')

    try:
        # Run the queryOpenAI function
        response = queryOpenAI(query_text, image_index, text_index, image_documents, text_documents)
        # Check if the response contains errors
        if "message" not in response or "images" not in response:
            raise ValueError("Response is missing expected keys.")

        return jsonify({
            "message": response["message"].choices[0].message.content,
            "images": response["images"]
        })

    except Exception as e:
        # Log the error to the console
        app.logger.error(f"Error in queryOpenAI: {e}")
        return jsonify({"error": str(e)}), 500

# Serve the React app
# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))
    app.run(port = 5001, debug = True)

