from flask import Flask, g
import faiss
import os

def create_app():
    app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), 'templates'))

    return app