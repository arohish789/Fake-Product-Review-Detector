// Listener that waits for messages from other extension components (e.g., popup.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Check if the received message is for a review prediction
    if (request.action === "predictReview") {
        const reviewText = request.review;

        // Call the Flask API to predict the review's authenticity
        fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ review: reviewText })
        })
        .then(response => response.json())
        .then(data => {
            // Send the prediction result back to the popup.js
            sendResponse({ prediction: data.prediction });
        })
        .catch(error => {
            console.error("Error fetching prediction:", error);
            sendResponse({ prediction: "Error" });
        });

        // Return true to indicate we will send a response asynchronously
        return true;
    }
});
