import openai
import numpy as np
from openai import OpenAI
import dotenv
from io import BytesIO
import requests

def get_query_embedding(text):
    response = openai.embeddings.create(input=text, model="text-embedding-3-small")
    return response.data[0].embedding

# def get_query_image_embedding(text, model):
#     # device = "cuda" if torch.cuda.is_available() else "cpu"
#     # model, preprocess = clip.load("ViT-B/16", device=device)
#     # text_preprocessed = clip.tokenize([text]).to(device)
#     # with torch.no_grad():
#     #     text_features = model.encode_text(text_preprocessed)
#     # return text_features.cpu().numpy().tolist()[0]
#     return False

# Function to retrieve most relevant documents from a FAISS index
def retrieve_relevant_documents(query_embedding, index, top_k=5):
    query_embedding = np.array([query_embedding], dtype=np.float32)
    distances, indices = index.search(query_embedding, top_k)
    return indices[0]


def queryOpenAI(query_text, image_index, text_index, images, texts):
    # Load environment variables
    # load_dotenv()
    # openai_api_key = os.getenv('OPENAI_API_KEY')
    # client = OpenAI(api_key=openai_api_key)

    client = OpenAI()

    # Retrieve embeddings
    query_embedding = get_query_embedding(query_text)

    # Retrieve relevant indices
    text_indices = retrieve_relevant_documents(query_embedding, text_index, top_k = 10)
    image_indices = retrieve_relevant_documents(query_embedding, image_index, top_k = 3)

    # Retrieve relevant data
    relevant_texts_url = [texts.iloc[i, 1] for i in text_indices]
    relevant_images = [images.iloc[i, 1] for i in image_indices]
    relevant_texts = []

    for url in relevant_texts_url:
        try:
            response = requests.get(url)
            response.raise_for_status()  # Check if the request was successful
            relevant_texts.append(response.text)
        except requests.RequestException as e:
            print(f"Error downloading {url}: {e}")
            return None

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
                # {"type": "image_url", "image_url": {"url": relevant_images[0]}},
                # {"type": "image_url", "image_url": {"url": relevant_images[1]}},
                # {"type": "image_url", "image_url": {"url": relevant_images[2]}},
                {"type": "text", "text": relevant_texts[0]},
                {"type": "text", "text": relevant_texts[1]},
                {"type": "text", "text": relevant_texts[2]},
                {"type": "text", "text": relevant_texts[3]},
                {"type": "text", "text": relevant_texts[4]},
                {"type": "text", "text": relevant_texts[5]},
                {"type": "text", "text": relevant_texts[6]},
                {"type": "text", "text": relevant_texts[7]},
                {"type": "text", "text": relevant_texts[8]},
                {"type": "text", "text": relevant_texts[9]},
            ]
        }
    ]

    # Get response from OpenAI
    try:
        openai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        response = {
            "message": openai_response,
            "images": [relevant_images[0], relevant_images[1], relevant_images[2]]  # Add images to the response
        }
        print("Query successful")
        return response


    except Exception as e:
        print("Error")

    # Construct response
