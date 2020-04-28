import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import { CheckoutPageResponse, CommandResponse, ActiveUser, TransactionListing, TransactionSaveRequest, TransactionSaveResponse} from "./typeDefinitions";
import * as Helper from "./helpers/routeControllerHelper";
import * as transactionsQuery from "./commands/transactions/transactionsQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup, RouteLookup, QueryParameterLookup, ParameterLookup } from "./lookups/routingLookup";
import * as TransactionUpdateCommand from "./commands/transactions/transactionUpdateCommand";
import * as EmployeeSignIn from "./commands/employees/employeeSignInCommand";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";

const processStartTransactionError = (error: any, res: Response): void => {
	if (Helper.processStartError(error, res)) {
		return;
	}

	res.setHeader(
		"Cache-Control",
		"no-cache, max-age=0, must-revalidate, no-store");
		
		//Change the ViewNameLookUp to Transaction and make sure that the products are working currently

	return res.status((error.status || 500))
		.render(
			ViewNameLookup.Checkout,
			<CheckoutPageResponse>{
				transactions: [],
				isElevatedUser: false,
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_QUERY))	//Change to TRANSCATIONS_UNABLE_TO_QUERY
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
	.then((): Promise<CommandResponse<TransactionListing[]>> => {
		return transactionsQuery.query();
	}).then((transactionCommandResponse: CommandResponse<TransactionListing[]>): void => {
		return res.render(ViewNameLookup.Checkout,
		<CheckoutPageResponse>{
			transactions: transactionCommandResponse.data	//Change to Transactions
		});
	}).catch((error: any): void => {
		return processStartTransactionError(error, res);
	});
};

export const confirmation = async (req: Request, res: Response): Promise<void> => {
	return EmployeeSignIn.execute(req.body, req.session)	//Change to Transaction and also fix up function
		.then((): void => {
			return res.redirect(RouteLookup.MainMenu);
		}).catch((error: any): void => {
			console.error(
				"An error occurred when attempting to confirm checkout. "
				+ error.message);

			return res.redirect(RouteLookup.Checkout
				+ "?" + QueryParameterLookup.ErrorCode
				+ "=" + ResourceKey.TRANSACTION_UNABLE_TO_CHECKOUT);
		});
};

//UPDATE
const saveTransaction = async (
	req: Request,
	res: Response,
	performSave: (transactionSaveRequest: TransactionSaveRequest) => Promise<CommandResponse<TransactionListing>>
): Promise<void> => {

	if (Helper.handleInvalidApiSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<TransactionListing>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<TransactionListing>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			return performSave(req.body);
		}).then((createTransactionCommandResponse: CommandResponse<TransactionListing>): void => {
			res.status(createTransactionCommandResponse.status)
				.send(<TransactionSaveResponse>{
					transaction: <TransactionListing>createTransactionCommandResponse.data
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
	//Update Function
	return saveTransaction(req, res, TransactionUpdateCommand.execute);
};