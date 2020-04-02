document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("updateQuantityButton")
        .addEventListener("click", updateTotalCost);
});

function updateTotalCost(event) {
    const saveActionUrl = ("/api/employeeDetail/"
		+ (employeeIdIsDefined ? employeeId : ""));
	const saveEmployeeRequest = {
		id: employeeId,
		managerId: getEmployeeManagerId(),
		lastName: getEmployeeLastNameEditElement().value,
		password: getEmployeePasswordEditElement().value,
		firstName: getEmployeeFirstNameEditElement().value,
		classification: getEmployeeTypeSelectElement().value
	};
    ajaxPatch(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {

        if (isSuccessResponse(callbackResponse)) {
            completeSaveAction(callbackResponse);
        }
    });
}