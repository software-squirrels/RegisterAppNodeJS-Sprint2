(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
	compareTwoStrings,
	findBestMatch
};

function compareTwoStrings(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (!first.length && !second.length) return 1;                   // if both are empty strings
	if (!first.length || !second.length) return 0;                   // if only one is empty string
	if (first === second) return 1;       							 // identical
	if (first.length === 1 && second.length === 1) return 0;         // both are 1-letter strings
	if (first.length < 2 || second.length < 2) return 0;			 // if either is a 1-letter string

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function findBestMatch(mainString, targetStrings) {
	if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');

	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compareTwoStrings(mainString, currentTargetString)
		ratings.push({target: currentTargetString, rating: currentRating})
		if (currentRating > ratings[bestMatchIndex].rating) {
			bestMatchIndex = i
		}
	}


	const bestMatch = ratings[bestMatchIndex]

	return { ratings, bestMatch, bestMatchIndex };
}

function areArgsValid(mainString, targetStrings) {
	if (typeof mainString !== 'string') return false;
	if (!Array.isArray(targetStrings)) return false;
	if (!targetStrings.length) return false;
	if (targetStrings.find(s => typeof s !== 'string')) return false;
	return true;
}

},{}],2:[function(require,module,exports){
var stringSimilarity = require('string-similarity');


document.addEventListener("DOMContentLoaded", () => {
	const productListingElement = document.getElementById("productsListing");
	if (productListingElement != null) {
		const productListElements = productListingElement.children;

		for (let i = 0; i < productListElements.length; i++) {
			productListElements[i].addEventListener("click", addToCart);
		}
	}

	document.getElementById("search").addEventListener("keypress", productSearch);
	document.getElementById("cancelCartAction").addEventListener("click", cancelCart);
	document.getElementById("completeCartAction").addEventListener("click", completeCart);
});

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

},{"string-similarity":1}]},{},[2]);
