from flask import Blueprint, current_app, jsonify

main = Blueprint('main', __name__)

# @main.route('/query', methods=['POST'])
# def query():
#     # Access the FAISS indexes and text data
#     text_index = current_app.text_index
#     image_index = current_app.image_index
#     text_documents = current_app.text_documents
#     image_documents = current_app.image_documents
#
#     # Implement your querying logic here
#     # Example: Return a summary of the loaded data
#     data_summary = {
#         "text_index_size": text_index.ntotal,
#         "image_index_size": image_index.ntotal,
#         "number_of_texts": len(text_documents),
#         "number_of_images": len(image_documents)
#     }
#
#     return jsonify(data_summary)

@main.route('/')
def index():
    return "Hello, World!"