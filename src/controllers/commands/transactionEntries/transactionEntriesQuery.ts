import { TransactionEntryModel } from "../models/transactionEntryModel";
import * as TransactionEntryHelper from "./helpers/transactionEntryHelper";
import * as TransactionEntryRepository from "../models/transactionEntryModel";
import { CommandResponse, TransactionEntry } from "../../typeDefinitions";

export const query = async (transactionId: string): Promise<CommandResponse<TransactionEntry[]>> => {
	return TransactionEntryRepository.queryByTransactionId(transactionId)
		.then((queriedTransactionEntries: TransactionEntryModel[]): CommandResponse<TransactionEntry[]> => {
			return <CommandResponse<TransactionEntry[]>>{
				status: 200,
				data: queriedTransactionEntries.map<TransactionEntry>((queriedTransactionEntries: TransactionEntryModel) => {
					return TransactionEntryHelper.mapTransactionEntryData(queriedTransactionEntries);
				})
			};
		});
};
