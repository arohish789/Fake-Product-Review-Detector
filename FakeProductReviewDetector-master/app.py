from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Load the model and vectorizer (ensure these are in the same directory or provide the correct paths)
model = joblib.load('fake_review_model.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Expect JSON body with 'review' key
    review_text = data.get('review')
    
    if not review_text:
        return jsonify({'error': 'No review text provided'}), 400
    
    # Vectorize the review text using the loaded TF-IDF vectorizer
    review_vectorized = tfidf_vectorizer.transform([review_text])
    
    # Add a dummy rating (as explained earlier)
    import pandas as pd
    review_vectorized_df = pd.DataFrame(review_vectorized.toarray())
    review_vectorized_df['rating'] = 5  # Add a dummy rating column
    review_vectorized_df.columns = review_vectorized_df.columns.astype(str)
    
    # Predict using the model
    prediction = model.predict(review_vectorized_df)[0]
    
    # Return the prediction as a JSON response
    result = 'Fake' if prediction == 1 else 'Genuine'
    return jsonify({'review': review_text, 'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
