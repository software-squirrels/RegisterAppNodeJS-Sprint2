document.addEventListener("DOMContentLoaded", () => {
	const productListElements = document.getElementById("productsListing").children;
	const search = document.getElementsByName("search")[0];

	for (let i = 0; i < productListElements.length; i++) {
		productListElements[i].querySelector('span[class="add"]').addEventListener("click", productAdd);
	}

	search.addEventListener("input", productSearch);
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

function productAdd(event) {
	let listItem = findClickedListItemElement(event.target);
	// Ajax post/patch
	let productId = listItem.querySelector("input[name='productId'][type='hidden']").value;
}

function productSearch(event) {
	const productListElements = document.getElementById("productsListing").children;

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
