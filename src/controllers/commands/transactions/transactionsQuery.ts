import { TransactionModel } from "../models/transactionModel";
import * as TransactionHelper from "./helpers/transactionHelper";
import * as TransactionRepository from "../models/transactionModel";
import { CommandResponse, TransactionListing } from "../../typeDefinitions";

export const query = async (): Promise<CommandResponse<TransactionListing[]>> => {
	return TransactionRepository.queryAll()
		.then((queriedTransaction: TransactionModel[]): CommandResponse<TransactionListing[]> => {
			return <CommandResponse<TransactionListing[]>>{
				status: 200,
				data: queriedTransaction.map<TransactionListing>((queriedTransactions: TransactionModel) => {
					return TransactionHelper.mapTransactionData(queriedTransactions);
				})
			};
		});
};
