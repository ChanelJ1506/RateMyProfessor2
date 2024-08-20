from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from pinecone import Index
import openai
from nltk.sentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import json

app = Flask(__name__)
# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create a Pinecone index
pc.create_index(
    name="rag",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

# Load the review data
data = json.load(open("reviews.json"))

processed_data = []
client = OpenAI()

# Create embeddings for each review
for review in data["reviews"]:
    response = client.embeddings.create(
        input=review['review'], model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    processed_data.append(
        {
            "values": embedding,
            "id": review["professor"],
            "metadata":{
                "review": review["review"],
                "subject": review["subject"],
                "stars": review["stars"],
            }
        }
    )

# Insert the embeddings into the Pinecone index
index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=processed_data,
    namespace="ns1",
)
print(f"Upserted count: {upsert_response['upserted_count']}")

# Print index statistics
print(index.describe_index_stats())

@app.route('/search', methods=['POST'])
def search():
    query = request.get_json()['query']
    results = search_professors(query)
    return jsonify(results)

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = request.get_json()['user_id']
    recommendations = recommend_professors(user_id)
    return jsonify(recommendations)

@app.route('/get_professor_data', methods=['POST'])
def get_professor_data():
    url = request.get_json()['url']
    professor_data = scrape_professor_data(url)
    processed_data = preprocess_data(professor_data)
    index.upsert(vectors=[processed_data['reviews_embeddings']], ids=['professor123'], 
                metadata=processed_data)
    return jsonify(professor_data)

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment_route():
    reviews = request.get_json()['reviews']
    sentiments = analyze_sentiment(reviews)
    return jsonify(sentiments)

if __name__ == '__main__':
    app.run(debug=True)