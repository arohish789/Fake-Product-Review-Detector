document.getElementById('checkReview').addEventListener('click', function () {
    const reviewText = document.getElementById('reviewText').value;

    if (reviewText.trim() === "") {
        alert("Please enter a review to check.");
        return;
    }

    // Send message to background script
    chrome.runtime.sendMessage(
        { action: "predictReview", review: reviewText },
        function (response) {
            const resultDiv = document.getElementById('result');
            if (response.prediction === 'Fake') {
                resultDiv.textContent = "This review is likely fake.";
                resultDiv.className = 'result fake';
            } else if (response.prediction === 'Genuine') {
                resultDiv.textContent = "This review seems genuine.";
                resultDiv.className = 'result genuine';
            } else {
                resultDiv.textContent = "Error processing request.";
                resultDiv.className = 'result';
            }
        }
    );
});
