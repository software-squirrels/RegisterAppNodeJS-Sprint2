import { TransactionModel } from "../models/transactionModel";
import * as TransactionHelper from "./helpers/transactionHelper";
import * as TransactionRepository from "../models/transactionModel";
import { CommandResponse, Transaction } from "../../typeDefinitions";

export const query = async (): Promise<CommandResponse<Transaction[]>> => {
	return TransactionRepository.queryAll()
		.then((queriedTransaction: TransactionModel[]): CommandResponse<Transaction[]> => {
			return <CommandResponse<Transaction[]>>{
				status: 200,
				data: queriedTransaction.map(transaction => TransactionHelper.mapTransactionData(transaction))
			};
	});
};
