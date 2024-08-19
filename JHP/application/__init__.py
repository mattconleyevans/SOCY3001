from flask import Flask
import faiss

def create_app():
    app = Flask(__name__)

    # # Load configurations
    # app.config.from_object('config.DevelopmentConfig')  # Example
    #
    # with open("data/texts.txt", "r") as text_file:
    #     loaded_texts = text_file.readlines()
    #
    # # Load base64-encoded images
    # with open("data/images.txt", "r") as images_file:
    #     loaded_images_b64 = images_file.readlines()
    #
    # app.text_documents = [text.strip() for text in loaded_texts]
    # app.image_documents = [image.strip() for image in loaded_images_b64]
    #
    # app.text_index = faiss.read_index("textArchive.index")
    # app.image_index = faiss.read_index("imageArchive.index")

    # Import and register blueprints
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app