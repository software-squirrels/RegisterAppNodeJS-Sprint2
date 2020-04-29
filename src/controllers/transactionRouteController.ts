import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import { TransactionPageResponse, CommandResponse, ActiveUser, TransactionListing } from "./typeDefinitions";
import * as Helper from "./helpers/routeControllerHelper";
import * as TransactionsQuery from "./commands/transactions/transactionsQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup } from "./lookups/routingLookup";

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
				transactions: [],
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.PRODUCTS_UNABLE_TO_QUERY))
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	let activeUserResponse: CommandResponse<ActiveUser>;
	return ValidateActiveUser.execute((<Express.Session>req.session).id)
	.then((): Promise<CommandResponse<TransactionListing[]>> => {
		return TransactionsQuery.query();
	}).then((transactionsCommandResponse: CommandResponse<TransactionListing[]>): void => {
		return res.render(ViewNameLookup.Transaction,
		<TransactionPageResponse>{
			transactions: transactionsCommandResponse.data
		});
	}).catch((error: any): void => {
		return processStartTransactionError(error, res);
	});
};

// TODO: Professor Phillips. I commented this out because it isn't being used anywhere at the moment.
// export const checkTransactionEntry = async (req: Request, res: Response): Promise<void> => {
// 	return QueryTransactionEntry.execute((<Express.Session>req.session).id)
// 	.then((): void => {
// 		res.sendStatus(200);
// 	}).catch((): void => {
// 		res.sendStatus(404);
// 	});
// };

export const createTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	return;
	// return CreateTransactionEntry.execute(req.body)
}

export const updateTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	return;
	// return saveTransactionEntry(req, res, TransactionEntryUpdateCommand.execute);
}
