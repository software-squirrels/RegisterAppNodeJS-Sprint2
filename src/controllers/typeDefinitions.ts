// Request object definitions
export interface SignInRequest {
	password: string;
	employeeId: string;
}

export interface ProductSaveRequest {
	id?: string;
	count: number;
	lookupCode: string;
	price: number;
}

export interface TransactionSaveRequest {
	id?: string;
	type: number;
	total: number;
	cashierId: string;
	referenceId: string;
}

export interface TransactionEntrySaveRequest {
	id?: string;
	transactionId: string;
	productId: string;
	quantity: number;
	price: number;
}

export interface EmployeeSaveRequest {
	id?: string;
	active: boolean;
	lastName: string;
	password: string;
	firstName: string;
	managerId?: string;
	classification: number;
	isInitialEmployee?: boolean;
}
// End request object definitions

// Response object definitions
// Response data object definitions
export interface Product {
	id: string;
	count: number;
	price: number;
	createdOn: string;
	lookupCode: string;
}

export interface Employee {
	id: string;
	active: boolean;
	lastName: string;
	createdOn: Date;
	firstName: string;
	managerId: string;
	employeeId: string;
	classification: number;
}

export interface ActiveUser {
	id: string;
	name: string;
	employeeId: string;
	classification: number;
}

export interface EmployeeType {
	value: number;
	label: string;
}

export interface Transaction {
	type: number;
	total: number;
	cashierId: string;
	referenceId: string;
	id: string;
	createdOn: Date;
}

export interface TransactionEntry {
	price: number;
	quantity: number;
	productId: string;
	transactionId: string;
	id: string;
	createdOn: Date;
}
// End response data object definitions

// Page response data
export interface PageResponse {
	errorMessage?: string;
}

export interface SignInPageResponse extends PageResponse {
	employeeId: string;
}

export interface MainMenuPageResponse extends PageResponse {
	isElevatedUser: boolean;
}

export interface ProductDetailPageResponse extends PageResponse {
	product: Product;
	isElevatedUser: boolean;
}

export interface EmployeeDetailPageResponse extends PageResponse {
	employee: Employee;
	isInitialEmployee: boolean;
	employeeTypes: EmployeeType[];
}

export interface ProductListingPageResponse extends PageResponse {
	products: Product[];
	isElevatedUser: boolean;
}

export interface TransactionPageResponse extends PageResponse {
	products: Product[];
	transactionId: string;
}

export interface CheckoutPageResponse extends PageResponse {
	transactionEntries: TransactionEntry[];
	// transactionId: string;
}
// End page response data

// API response data
export interface ApiResponse {
	redirectUrl?: string;
	errorMessage?: string;
}

export interface ProductSaveResponse extends ApiResponse {
	product: Product;
}

export interface TransactionSaveResponse extends ApiResponse {
	transaction: Transaction;
}

export interface TransactionEntrySaveResponse extends ApiResponse {
	transactionEntry: TransactionEntry;
}

export interface EmployeeSaveResponse extends ApiResponse {
	employee: Employee;
}
// End API response data
// End response object definitions

export interface CommandResponse<T> {
	data?: T;
	status: number;
	message?: string;
}
