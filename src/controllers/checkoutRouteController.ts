import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import { CheckoutPageResponse, CommandResponse, ActiveUser, Transaction, TransactionEntry, TransactionSaveRequest, TransactionSaveResponse } from "./typeDefinitions";
import * as Helper from "./helpers/routeControllerHelper";
import * as TransactionEntriesQuery from "./commands/transactionEntries/transactionEntriesQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup, RouteLookup, QueryParameterLookup, ParameterLookup } from "./lookups/routingLookup";
import * as TransactionUpdateCommand from "./commands/transactions/transactionUpdateCommand";
import * as EmployeeSignIn from "./commands/employees/employeeSignInCommand";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";
import * as ProductsQuery from "./commands/products/productsQuery";

const processStartTransactionError = (error: any, res: Response): void => {
	if (Helper.processStartError(error, res)) {
		return;
	}

	res.setHeader(
		"Cache-Control",
		"no-cache, max-age=0, must-revalidate, no-store");

		// Change the ViewNameLookUp to Transaction and make sure that the products are working currently

	return res.status((error.status || 500))
		.render(
			ViewNameLookup.Checkout,
			<CheckoutPageResponse>{
				transactionEntries: [],
				products: [],
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_QUERY))
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	await ValidateActiveUser.execute((<Express.Session>req.session).id);
	const transactionCommandResponse = (await TransactionEntriesQuery.query(req.query[QueryParameterLookup.TransactionId])).data;
	const products = (await ProductsQuery.query()).data;
	const productMap: any = {};
	products?.forEach(product => productMap[product.id] = product.lookupCode);
	const items = transactionCommandResponse?.map((item: any) => {
		item.lookupCode = productMap[item.productId];
		return item;
	});
	console.log(items);
	res.render(ViewNameLookup.Checkout, <CheckoutPageResponse>{
		transactionEntries: items,
		products: products
	});
};

export const confirmation = async (req: Request, res: Response): Promise<void> => {
	return EmployeeSignIn.execute(req.body, req.session)	// Change to Transaction and also fix up function
		.then((): void => {
			return res.redirect(RouteLookup.MainMenu);
		}).catch((error: any): void => {
			console.error(
				"An error occurred when attempting to confirm checkout. "
				+ error.message);

			return res.redirect(RouteLookup.Checkout
				+ "?" + QueryParameterLookup.ErrorCode
				+ "=" + ResourceKey.TRANSACTION_UNABLE_TO_SAVE);
		});
};

// UPDATE
const saveTransaction = async (
	req: Request,
	res: Response,
	performSave: (transactionSaveRequest: TransactionSaveRequest) => Promise<CommandResponse<Transaction>>
): Promise<void> => {

	if (Helper.handleInvalidApiSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<Transaction>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<Transaction>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			return performSave(req.body);
		}).then((createTransactionCommandResponse: CommandResponse<Transaction>): void => {
			res.status(createTransactionCommandResponse.status)
				.send(<TransactionSaveResponse>{
					transaction: <Transaction>createTransactionCommandResponse.data
				});
		}).catch((error: any): void => {
			return Helper.processApiError(
				error,
				res,
				<Helper.ApiErrorHints>{
					redirectBaseLocation: RouteLookup.Transaction,
					defaultErrorMessage: Resources.getString(
						ResourceKey.TRANSACTION_UNABLE_TO_SAVE)
				});
		});
};

export const update = async (req: Request, res: Response): Promise<void> => {
	// Update Function
	return saveTransaction(req, res, TransactionUpdateCommand.execute);
};
