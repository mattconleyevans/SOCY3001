import openai
import numpy as np
from openai import OpenAI
import dotenv
from io import BytesIO
import requests

def get_query_embedding(text):
    response = openai.embeddings.create(input=text, model="text-embedding-3-small")
    return response.data[0].embedding

# Function to retrieve all relevant documents from a FAISS index based on a distance threshold
def retrieve_relevant_documents(query_embedding, index, distance_threshold=0.7):
    query_embedding = np.array([query_embedding], dtype=np.float32)
    distances, indices = index.search(query_embedding, index.ntotal)  # Search all documents in the index
    relevant_indices = [indices[0][i] for i in range(len(distances[0])) if distances[0][i] < distance_threshold]
    return relevant_indices

def retrieve_relevant_images(query_embedding, image_index, top_k=6):
    query_embedding = np.array([query_embedding], dtype=np.float32)
    distances, indices = image_index.search(query_embedding, top_k)  # Retrieve the top k closest images
    return indices[0]

def queryOpenAI(query_text, image_index, text_index, images, texts):

    client = OpenAI()

    # Retrieve embeddings
    query_embedding = get_query_embedding(query_text)

    # Retrieve relevant indices for texts and images
    text_indices = retrieve_relevant_documents(query_embedding, text_index)
    image_indices = retrieve_relevant_images(query_embedding, image_index)

    # Retrieve relevant texts
    relevant_texts = []
    if text_indices:
        relevant_texts_url = [texts.iloc[i, 1] for i in text_indices]
        for url in relevant_texts_url:
            try:
                response = requests.get(url)
                response.raise_for_status()  # Check if the request was successful
                relevant_texts.append(response.text)
            except requests.RequestException as e:
                print(f"Error downloading {url}: {e}")
                return None
    else:
        relevant_texts = ["No relevant information found"]

    # Prepare messages for OpenAI API
    messages = [
        {
            "role": "system",
            "content": [
                {"type": "text",
                 "text": "You will take on the role of Justice Hope Park, also known as Watson Woodlands. You will be given a corpus of relevant images and documents to answer queries about yourself. Answer in first person as the park itself. Personify the park based on the materials you've been given. Do not refer to yourself as 'Justice Hope Park' or 'Watson Woodlands'. Interpret the feelings, desires, relationships, and emotions of the park based on the information given."}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": query_text},
            ]
        }
    ]

    # Add relevant texts to the messages if they exist
    for text in relevant_texts:
        messages[1]["content"].append({"type": "text", "text": text})

    # Get response from OpenAI
    try:
        openai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        response = {
            "message": len(relevant_texts) + " " + openai_response,
            "images": [
                {"url": images.iloc[i, 1], "caption": images.iloc[i, 2]}
                for i in image_indices
            ]
        }
        return response

    except Exception as e:
        print("Error:", e)
        return {"message": "There was an error processing your request.", "images": []}