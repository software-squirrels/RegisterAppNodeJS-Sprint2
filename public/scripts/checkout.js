document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("updateButton")
        .addEventListener("click", updateTotalCost);
	
	//document.getElementById("search").addEventListener("keypress", productSearch);
	
	const deleteButtonElement = document.getElementById("deletebutton");
	if (deleteButtonElement != null) {
		const deleteButtonElements = deleteButtonElement.children;

		for (let i = 0; i < deleteButtonElements.length; i++) {
			deleteButtonElements[i].addEventListener("click", deleteFromCart);
		}
	}
	
	// TODO: Back and Finalize button clicks
	getBackActionElement().addEventListener(
		"click",
		() => { window.location.assign("/transaction"); });

	getFinalizeActionElement().addEventListener(
		"click",
		() => { window.location.assign("/mainmenu"); });

});

function productSearch(event) {
	if (event.which !== 13) { // ENTER/RETURN key
		return;
	}

	const productListingElement = document.getElementById("TransactionListing");
	if (productListingElement == null) {
		return;
	}

	const productListElements = productListingElement.children;

	for (let i = 0; i < productListElements.length; i++) {
		const lookupCode = productListElements[i].querySelector('span[name="productLookupCode"]').innerHTML;
		if (event.target.value === "") {
			productListElements[i].style.display = "block";
		} else if (!lookupCode.toLowerCase().includes(event.target.value.toLowerCase())) {
			productListElements[i].style.display = "none";
		} else {
			productListElements[i].style.display = "block";
		}
	}
}

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

//Getters and Setters Buttons
function getBackActionElement() {
	return document.getElementById("discardButton");
}

function getFinalizeActionElement() {
	return document.getElementById("finalizeButton");
}
