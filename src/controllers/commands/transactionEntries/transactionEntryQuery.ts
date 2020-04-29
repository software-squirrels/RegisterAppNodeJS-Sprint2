import * as Helper from "../helpers/helper";
import { TransactionEntryModel } from "../models/transactionEntryModel";
import * as TransactionEntryHelper from "./helpers/transactionEntryHelper";
import * as TransactionEntryRepository from "../models/transactionEntryModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, TransactionEntry } from "../../typeDefinitions";

export const queryById = async (transactionId?: string): Promise<CommandResponse<TransactionEntry>> => {
	if (Helper.isBlankString(transactionId)) {
		return Promise.reject(<CommandResponse<TransactionEntry>>{
			status: 422,
			message: Resources.getString(ResourceKey.TRANSACTION_RECORD_ID_INVALID)
		});
	}

	return TransactionEntryRepository.queryById(<string>transactionId)
		.then((queriedTransactionEntry: (TransactionEntryModel | null)): Promise<CommandResponse<TransactionEntry>> => {
			if (!queriedTransactionEntry) {
				return Promise.reject(<CommandResponse<TransactionEntry>>{
					status: 404,
					message: Resources.getString(ResourceKey.TRANSACTION_NOT_FOUND)
				});
			}

			return Promise.resolve(<CommandResponse<TransactionEntry>>{
				status: 200,
				data: TransactionEntryHelper.mapTransactionEntryData(queriedTransactionEntry)
			});
		});
};
