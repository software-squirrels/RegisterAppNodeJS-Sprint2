document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("updateQuantityButton")
        .addEventListener("click", updateTotalCost);
});

function updateTotalCost(event) {
	const transactionIdIsDefined = transactionId != null && transactionId.trim() !== '';
		const updateCartActionUrl = ('/api/transaction/' + (transactionIdIsDefined ? transactionId : ''));
		const updateTransactionRequest = {
			productId: item,
			productPrice: 5,
			productQuantity: value,
			transactionId
		};
    ajaxPatch(updateCartActionUrl, updateTransactionRequest, (callbackResponse) => {
        if (isSuccessResponse(callbackResponse)) {
            displayProductAddedAlertModal();
        }
    });
}

function displayProductAddedAlertModal() {
	if (hideProductAddedAlertTimer)
		clearTimeout(hideProductAddedAlertTimer);

	const productAddedAlertModalElement = getProductAddedAlertModalElement();
	// productAddedAlertModalElement.style.display = 'none';
	productAddedAlertModalElement.style.display = 'block';

	hideProductAddedAlertTimer = setTimeout(hideProductAddedAlertModal, 1200);
}

function hideProductAddedAlertModal() {
	if (hideProductAddedAlertTimer)
		clearTimeout(hideProductAddedAlertTimer);

	getProductAddedAlertModalElement().style.display = 'none';
}

// Getters and setters
function getProductAddedAlertModalElement() {
	return document.getElementById('productAddedAlertModal');
}

function getProductIdElement() {
	return document.getElementById('productId');
}

function getProductPriceElement() {
	return document.getElementById('productPrice');
}

function getProductQuantityElement() {
	return document.getElementById('productQuantity');
}

function getTransactionIdElement() {
	return document.getElementById('transactionId');
}

function getProductId() {
	return getProductIdElement().value;
}

function getProductPrice() {
	return getProductPriceElement().value;
}

function getProductQuantity() {
	return getProductQuantityElement().value;
}

function getTransactionID() {
	return getTransactionIDElement().value;
}


