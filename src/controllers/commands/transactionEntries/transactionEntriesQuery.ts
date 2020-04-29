import { TransactionEntryModel } from "../models/TransactionEntryModel";
import * as TransactionEntryHelper from "./helpers/TransactionEntryHelper";
import * as TransactionEntryRepository from "../models/TransactionEntryModel";
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
