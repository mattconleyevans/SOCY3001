from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from application.query import queryOpenAI
import os
import faiss
import pandas as pd
import json
from datetime import datetime
import boto3

app = Flask(__name__, static_folder='frontend/build')
CORS(app, resources={r"/api/*": {"origins": "*"}})

text_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/textArchive.index'))
image_index = faiss.read_index(os.path.join(os.path.dirname(__file__), 'application/data/imageArchive.index'))
images = pd.read_csv(os.path.join(os.path.dirname(__file__),'application/data/images.csv'))
texts = pd.read_csv(os.path.join(os.path.dirname(__file__),'application/data/texts.csv'))

s3 = boto3.client('s3')
bucket_name = 'jhp-ai-socy3001'
log_file_key = 'query_logs.txt'

def log_query(query_data):
    # Fetch the existing log file from S3 (optional: if you want to append logs)
    try:
        response = s3.get_object(Bucket=bucket_name, Key=log_file_key)
        existing_logs = response['Body'].read().decode('utf-8')
    except s3.exceptions.NoSuchKey:
        existing_logs = ""

    # Append the new log entry
    new_log_entry = f"{datetime.utcnow().isoformat()} - {query_data['query_text']} - {query_data['response']}\n"
    updated_logs = existing_logs + new_log_entry

    # Upload the updated log file back to S3
    s3.put_object(Bucket=bucket_name, Key=log_file_key, Body=updated_logs)

# Route to handle the API call from the React app
@app.route('/api/query', methods=['POST'])
def query():

    data = request.json
    query_text = data.get('query_text')

    try:
        # Run the queryOpenAI function
        response = queryOpenAI(query_text, image_index, text_index, images, texts)
        # Check if the response contains errors
        if "message" not in response or "images" not in response:
            raise ValueError("Response is missing expected keys.")

        # Log the query
        query_data = {
            "query_text": query_text,
            "timestamp": datetime.utcnow().isoformat(),
            "response": response["message"].choices[0].message.content
        }
        log_query(query_data)

        return jsonify({
            "message": response["message"].choices[0].message.content,
            "images": response["images"]
        })

    except Exception as e:
        # Log the error to the console
        app.logger.error(f"Error in queryOpenAI: {e}")
        return jsonify({"error": str(e)}), 500

# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))
    # app.run(port = 5001, debug = True)

