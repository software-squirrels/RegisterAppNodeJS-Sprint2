document.addEventListener("DOMContentLoaded", () => {
	const productListingElement = document.getElementById("productsListing");
	if (productListingElement != null) {
		const productListElements = productListingElement.children;
		for (let i = 0; i < productListElements.length; i++) {
			productListElements[i].querySelector('span.add').addEventListener("click", addToCart);
		}
	}
	document.getElementById("search").addEventListener("keypress", productSearch);
	document.getElementById("cancelCartAction").addEventListener("click", cancelCart);
 	document.getElementById("completeCartAction").addEventListener("click", completeCart);
 });

 function findClickedListItemElement(clickedTarget) {
 	if (clickedTarget.tagName.toLowerCase() === "li") {
 		return clickedTarget;
 	} else {
 		let ancestorIsListItem = false;
 		let ancestorElement = clickedTarget.parentElement;

 		while (!ancestorIsListItem && (ancestorElement != null)) {
 			ancestorIsListItem = (ancestorElement.tagName.toLowerCase() === "li");

 			if (!ancestorIsListItem) {
 				ancestorElement = ancestorElement.parentElement;
 			}
 		}

 		return (ancestorIsListItem ? ancestorElement : null);
 	}
 }

 function completeDeleteAction(callbackResponse) {
 	if (callbackResponse.data == null) {
 		return;
 	}
 	if ((callbackResponse.data.redirectUrl != null)
 		&& (callbackResponse.data.redirectUrl !== "")) {
 		window.location.replace(callbackResponse.data.redirectUrl);
 		return;
 	}
 }
 function cancelCart() {
 	const transactionIdValue = document.getElementById("transactionId").value;
 	const deleteActionUrl = "/transaction?transactionId=" + transactionIdValue;
 	ajaxDelete(deleteActionUrl, (callbackResponse) => {
 		if(isSuccessResponse(callbackResponse)) {
 			completeDeleteAction(callbackResponse);
 		}
 		else {
 			displayError(callbackResponse.errorMessage);
 		}
 	});
 }
 function completeCart() {
 	const transactionIdValue = document.getElementById("transactionId").value;
 	const completeActionUrl = "/checkout?transactionId=" + transactionIdValue;
	window.location.replace(completeActionUrl);
 	return;
 }



 async function addToCart(event) {
  	const listItem = event.target.parentElement;
  	const clickedProductId = listItem.querySelector("input[name='productId']").value;
  	const clickedProductAmount = listItem.querySelector("input[name='quantity']");
  	const clickedProductLookupCode = listItem.querySelector('span[name="productLookupCode"]').innerHTML;
  	const amount = clickedProductAmount.value;
  	const transactionId = document.querySelector("input[name='transactionId']").value;
  	clickedProductAmount.value = "";
  	console.log(clickedProductId, amount, clickedProductLookupCode);
  	console.log(await fetch('/transaction', {
  		method: 'PATCH',
  		body: JSON.stringify({
  			quantity: amount,
  			productId: clickedProductId,
  			transactionId: transactionId
  		}),
  		headers: {
  			"Content-type": "application/json; charset=UTF-8"
  		}
  	}));
  	return;
		}


		function productSearch(event) {
		const productListElements = document.getElementById("transactionEntries").children;

		for (let i = 0; i < productListElements.length; i++) {
			if (event.target.value === "") {
				productListElements[i].style.display = "block";
			}
			else if (!productListElements[i].querySelector('span[name="productLookupCode"]').innerHTML.toLowerCase().includes(event.target.value.toLowerCase())) {
				productListElements[i].style.display = "none";
			}
			else {
				productListElements[i].style.display = "block";
			}

		}
	}
