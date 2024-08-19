from flask import Flask, request, jsonify, send_from_directory, render_template
from application.query import queryOpenAI
import os

app = Flask(__name__, static_folder='frontend/build')

@app.route('/', methods=['GET', 'POST'])
def query():
    if request.method == 'POST':
        query_text = request.form.get('query_text')

        # Access the indices and documents from the app context
        text_index = current_app.text_index
        image_index = current_app.image_index
        text_documents = current_app.text_documents
        image_documents = current_app.image_documents

        # Run the queryOpenAI function
        response = queryOpenAI(query_text, image_index, text_index, text_documents, image_documents)

        return jsonify({"response": response.choices[0].message.content})

    # Render the HTML form on GET request
    return render_template('application/templates/index.html')

if __name__ == '__main__':
    app.run(debug=True)