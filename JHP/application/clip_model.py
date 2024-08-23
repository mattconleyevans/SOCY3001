# clip_model.py
import clip
import torch

# Global variable to hold the CLIP model and preprocess function
model = None
preprocess = None

def initialize_clip_model():
    global model, preprocess
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)

def get_clip_model():
    # Initialize the model if it's not already done
    if model is None or preprocess is None:
        initialize_clip_model()
    return model, preprocess