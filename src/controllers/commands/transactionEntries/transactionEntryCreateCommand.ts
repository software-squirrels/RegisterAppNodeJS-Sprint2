import { TransactionEntryModel } from "../models/transactionEntryModel";
import * as TransactionEntryHelper from "./helpers/transactionEntryHelper";
import { CommandResponse, TransactionEntry, TransactionEntrySaveRequest } from "../../typeDefinitions";

export const execute = async (
	transactionEntrySaveRequest: TransactionEntrySaveRequest
): Promise<CommandResponse<TransactionEntry>> => {

	const transactionEntryToCreate: TransactionEntryModel = <TransactionEntryModel>{
		price: transactionEntrySaveRequest.price,
		quantity: transactionEntrySaveRequest.quantity,
		productId: transactionEntrySaveRequest.productId,
		transactionId: transactionEntrySaveRequest.transactionId
	};

	return TransactionEntryModel.create(transactionEntryToCreate)
		.then((createdTransactionEntry: TransactionEntryModel): CommandResponse<TransactionEntry> => {
			return <CommandResponse<TransactionEntry>>{
				status: 201,
				data: TransactionEntryHelper.mapTransactionEntryData(createdTransactionEntry)
			};
		});
};
