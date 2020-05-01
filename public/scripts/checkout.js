document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("updateButton")
        .addEventListener("click", updateTotalCost);
	
	//document.getElementById("search").addEventListener("keypress", productSearch);
	
	const deleteButtonElement = document.getElementById("deletebutton");
	if (deleteButtonElement != null) {
		const deleteButtonElements = deleteButtonElement.children;

		for (let i = 0; i < deleteButtonElements.length; i++) {
			console.log("111111");
			deleteButtonElements[i].addEventListener("click", deleteActionClick);
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

function deleteActionClick(event) {
	const transactionIdValue = document.getElementById("transactionId").value;
	const deleteActionUrl = "/checkout=" + transactionIdValue;
	ajaxDelete(deleteActionUrl, (callbackResponse) => {
		if(isSuccessResponse(callbackResponse)) {
			completeDeleteAction(callbackResponse);
		} else {
			displayError(callbackResponse.errorMessage);
		}
	});
};

function completeDeleteAction(callbackResponse) {
	if (callbackResponse.data == null) {
		return;
	}

	if (callbackResponse.data.redirectUrl != null
		&& callbackResponse.data.redirectUrl !== "") {

		window.location.replace(callbackResponse.data.redirectUrl);
		return;
	}
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
