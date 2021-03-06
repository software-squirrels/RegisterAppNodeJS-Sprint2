export enum ParameterLookup {
	ProductId = "productId",
	EmployeeId = "employeeId"
}

export enum QueryParameterLookup {
	ErrorCode = "errorCode",
	EmployeeId = "employeeId",
	TransactionId = "transactionId"
}

export enum ViewNameLookup {
	SignIn = "signIn",
	MainMenu = "mainMenu",
	ProductDetail = "productDetail",
	EmployeeDetail = "employeeDetail",
	ProductListing = "productListing",
	Transaction = "transaction",
	Checkout = "checkout"
}

export enum RouteLookup {
	// Page routing
	SignIn = "/",
	SignOut = "/signOut",
	MainMenu = "/mainMenu",
	ProductDetail = "/productDetail",
	EmployeeDetail = "/employeeDetail",
	ProductListing = "/productListing",
	Transaction = "/transaction",
	Checkout = "/checkout",

	// Page routing - parameters
	ProductIdParameter = "/:productId",
	EmployeeIdParameter = "/:employeeId",
	// End page routing - parameters
	// End page routing

	// API routing
	API = "/api",
	// End API routing
}
