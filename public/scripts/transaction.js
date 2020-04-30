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

function onCartItemClicked(event) {
	if ((event.target.tagName.toLowerCase() === "input")
		&& (event.target.name === "productQuantity")) {

		return;
	}
	const listItem = findClickedListItemElement(event.target);

	listItem.parentElement.removeChild(listItem);
}

function addToCart(event) {
	const listItem = event.target.parentElement;
	const clickedProductId = listItem.querySelector("input[name='productId']").value;
	const clickedProductAmount = listItem.querySelector("input[name='quantity']");
	const clickedProductLookupCode = listItem.querySelector('span[name="productLookupCode"]').innerHTML;
	const amount = clickedProductAmount.value;
	clickedProductAmount.value = "";
	console.log(clickedProductId, amount, clickedProductLookupCode);
	return;

	const listItemElement = document.createElement("li");
	listItemElement.addEventListener("click", onCartItemClicked);
	transactionEntryListElement.appendChild(listItemElement);

	const productIdElement = document.createElement("input");
	productIdElement.type = "hidden";
	productIdElement.name = "productId";
	productIdElement.value = listItem.querySelector("input[name='productId']").value;
	listItemElement.appendChild(productIdElement);

	const productLookupcodeElement = document.createElement("span");
	productLookupcodeElement.classList.add("productLookupCodeDisplay");
	productLookupcodeElement.innerHTML = listItem.querySelector("span.productLookupCodeDisplay").innerHTML;
	listItemElement.appendChild(productLookupcodeElement);

	listItemElement.appendChild(document.createElement("br"));
	listItemElement.appendChild(document.createTextNode("\u00A0\u00A0"));

	const quantityElement = document.createElement("input");
	quantityElement.type = "number";
	quantityElement.name = "productQuantity";
	quantityElement.value = "1";
	quantityElement.classList.add("quantityUpdate");
    listItemElement.appendChild(quantityElement);
}

function productAdd(event) {
	let listItem = findClickedListItemElement(event.target);
	// Ajax post/patch
	let productId = listItem.querySelector("input[name='productId'][type='hidden']").value;
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
