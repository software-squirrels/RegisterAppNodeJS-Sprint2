import * as Helper from "../helpers/helper";
import { TransactionModel } from "../models/transactionModel";
import * as TransactionHelper from "./helpers/transactionHelper";
import * as TransactionRepository from "../models/transactionModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, TransactionListing } from "../../typeDefinitions";

export const queryById = async (transactionId?: string): Promise<CommandResponse<TransactionListing>> => {
	if (Helper.isBlankString(transactionId)) {
		return Promise.reject(<CommandResponse<TransactionListing>>{
			status: 422,
			message: Resources.getString(ResourceKey.TRANSACTION_RECORD_ID_INVALID)
		});
	}

	return TransactionRepository.queryById(<string>transactionId)
		.then((queriedTransaction: (TransactionModel | null)): Promise<CommandResponse<TransactionListing>> => {
			if (queriedTransaction == null) {
				return Promise.reject(<CommandResponse<TransactionListing>>{
					status: 404,
					message: Resources.getString(ResourceKey.TRANSACTION_NOT_FOUND)
				});
			}

			return Promise.resolve(<CommandResponse<TransactionListing>>{
				status: 200,
				data: TransactionHelper.mapTransactionData(queriedTransaction)
			});
		});
};
