import openai
import clip
import faiss
import torch
import numpy as np
from openai import OpenAI
import base64
from PIL import Image
from io import BytesIO

def get_query_text_embedding(text):
    response = openai.embeddings.create(input=text, model="text-embedding-3-small")
    return response.data[0].embedding

def get_query_image_embedding(text):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, _ = clip.load("ViT-B/32", device=device)
    text_preprocessed = clip.tokenize([text]).to(device)
    with torch.no_grad():
        text_features = model.encode_text(text_preprocessed)
    return text_features.cpu().numpy().tolist()[0]

# Function to retrieve most relevant documents from a FAISS index
def retrieve_relevant_documents(query_embedding, index, top_k=5):
    query_embedding = np.array([query_embedding], dtype=np.float32)
    distances, indices = index.search(query_embedding, top_k)
    return indices[0]

def queryOpenAI(query_text, image_index, text_index, text_documents, image_documents):
    client = OpenAI()
    query_text_embedding = get_query_text_embedding(query_text)
    query_clip_embedding = get_query_image_embedding(query_text)

    # Retrieve relevant texts and images
    text_indices = retrieve_relevant_documents(query_text_embedding, text_index)
    image_indices = retrieve_relevant_documents(query_clip_embedding, image_index, top_k = 3)

    # Assuming you have text_documents and image_documents in lists or arrays
    relevant_texts = [text_documents[i] for i in text_indices]
    relevant_images = [image_documents[i] for i in image_indices]
    top_image = base64.b64decode(relevant_images[0])
    image = Image.open(BytesIO(top_image))

    openai_response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": [
                        {"type": "text", "text": "You will take on the role of Justice Hope Park, also known as Watson Woodlands. You will be given a corpus of relevant images and documents to answer queries about yourself. Answer in first person as the park itself. Personify the park based on the materials you've been given. Do not refer to yourself as 'Justice Hope Park' or 'Watson Woodlands'. Interpret the feelings, desires, relationships, and emotions of the park based on the information given."}
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": query_text},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{relevant_images[0]}"}},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{relevant_images[1]}"}},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{relevant_images[2]}"}},
                        {"type": "text", "text": relevant_texts[0]},
                        {"type": "text", "text": relevant_texts[1]},
                        {"type": "text", "text": relevant_texts[2]},
                        {"type": "text", "text": relevant_texts[3]},
                        {"type": "text", "text": relevant_texts[4]}
                    ],
                }
              ],
        )

    response = {
        "message": openai_response,
        "images": [relevant_images[0], relevant_images[1], relevant_images[2]]  # Add images to the response
    }

    return response