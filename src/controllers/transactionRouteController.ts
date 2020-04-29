import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import { TransactionPageResponse, TransactionEntry, CommandResponse, ActiveUser, Product, ProductListingPageResponse } from "./typeDefinitions";
import * as ProductsQuery from "./commands/products/productsQuery";
import * as Helper from "./helpers/routeControllerHelper";
import * as TransactionEntriesQuery from "./commands/transactionEntries/transactionEntriesQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup } from "./lookups/routingLookup";
import * as TransactionEntryCreateCommand from "./commands/transactionEntries/transactionEntryCreateCommand";
import * as TransactionEntryUpdateCommand from "./commands/transactionEntries/transactionEntryUpdateCommand";
import * as TransactionEntryQuery from "./commands/transactionEntries/transactionEntryQuery";
import { v1 as uuidv1 } from "uuid";

const processStartTransactionError = (error: any, res: Response): void => {
	if (Helper.processStartError(error, res)) {
		return;
	}

	res.setHeader(
		"Cache-Control",
		"no-cache, max-age=0, must-revalidate, no-store");

	return res.status((error.status || 500))
		.render(
			ViewNameLookup.Transaction,
			<TransactionPageResponse>{
				products: [],
				transactionId: uuidv1(),
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.PRODUCTS_UNABLE_TO_QUERY))
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
	.then((): Promise<CommandResponse<Product[]>> => {
		return ProductsQuery.query();
	}).then((productsCommandResponse: CommandResponse<Product[]>): void => {
		return res.render(ViewNameLookup.Transaction,
		<TransactionPageResponse>{
			products: productsCommandResponse.data,
			transactionId: uuidv1()
		});
	}).catch((error: any): void => {
		return processStartTransactionError(error, res);
	});
};

export const checkTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	return TransactionEntryQuery.queryById(req.body.referenceId)
	.then((): void => {
		res.sendStatus(200);
	}).catch((): void => {
		res.sendStatus(404);
	});
};

export const createTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	return TransactionEntryCreateCommand.execute(req.body)
	.then((saveTransactionEntryCommandResponse: CommandResponse<TransactionEntry>): void => {
		res.status(saveTransactionEntryCommandResponse.status);
	}).catch((error: any): void => {
		return Helper.processApiError(
			error,
			res,
			<Helper.ApiErrorHints>{
				defaultErrorMessage: Resources.getString(
					ResourceKey.TRANSACTION_UNABLE_TO_SAVE)
			});
	});
};

export const updateTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	return TransactionEntryUpdateCommand.execute(req.body)
	.then((saveTransactionEntryCommandResponse: CommandResponse<TransactionEntry>): void => {
		res.status(saveTransactionEntryCommandResponse.status);
	}).catch((error: any): void => {
		return Helper.processApiError(
			error,
			res,
			<Helper.ApiErrorHints>{
				defaultErrorMessage: Resources.getString(
					ResourceKey.TRANSACTION_UNABLE_TO_SAVE)
			});
	});
};
