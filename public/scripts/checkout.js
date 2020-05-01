document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("updateButton")
        .addEventListener("click", updateItems);
	
	//document.getElementById("search").addEventListener("keypress", productSearch);
	const urlParams = new URLSearchParams(window.location.search);
	window.transactionId = urlParams.get('transactionId')
	
	// TODO: Back and Finalize button clicks
	getBackActionElement().addEventListener(
		"click",
		() => { window.location.assign("/transaction"); });

	getFinalizeActionElement().addEventListener(
		"click",
		() => { window.location.assign("/mainmenu"); });

});

async function updateItems() {
	const listItems = Array.from(document.getElementById('TransactionListing').children);
	const toUpdate = [];
	listItems.forEach(elem => {
		const amountElem = elem.querySelector("input[name='amount']");
		const oldAmount = String(amountElem.placeholder);
		const newAmount = String(amountElem.value);
		if (newAmount && newAmount !== oldAmount) {
			toUpdate.push({
				transactionId: window.transactionId,
				quantity: newAmount,
				productId: elem.querySelector("input[name='productId']").value
			})
		}
	})
	const updated = await (await fetch('/checkout', {
		method: 'PATCH',
		body: JSON.stringify(toUpdate),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})).json()

	let addedPrice = 0;
	let addedItems = 0;
	listItems.forEach(elem => {
		const amountElem = elem.querySelector("input[name='amount']");
		const oldAmount = Number(amountElem.placeholder);
		const newAmount = Number(amountElem.value);
		const oldPrice = Number(elem.querySelector("span[name='price']").textContent.substring(8));
		if (newAmount && newAmount !== oldAmount) {
			const updatedValues = updated.shift()
			elem.querySelector("span[name='price']").textContent = 'Price: $' + updatedValues.price;
			amountElem.placeholder = updatedValues.quantity;
			amountElem.value = "";
			addedPrice += updatedValues.price - oldPrice;
			addedItems += newAmount - oldAmount;
		}
	})

	const priceElem = document.getElementById('totalPrice');
	const quantityElem = document.getElementById('totalQuantity');
	const newTotalAmount = Number(quantityElem.textContent.substring(16)) + addedItems;
	const newTotalPrice = Number(priceElem.textContent.substring(22)) + addedPrice;
	priceElem.textContent = `Total Checkout Price: ${newTotalPrice}`;
	quantityElem.textContent = `Total Quantity: ${newTotalAmount}`;
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
