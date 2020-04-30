document.addEventListener("DOMContentLoaded", () => {
	const productListingElement = document.getElementById("productsListing");
	if (productListingElement != null) {
		const productListElements = productListingElement.children;

		for (let i = 0; i < productListElements.length; i++) {
			productListElements[i].querySelector('span.add').addEventListener("click", addToCart);
		}
	}

	document.getElementById("search").addEventListener("keypress", productSearch);

	// TODO: Cancel and complete button clicks
});

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
	if (event.which !== 13) { // ENTER/RETURN key
		return;
	}

	const productListingElement = document.getElementById("productsListing");
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
