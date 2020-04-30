import { TransactionModel } from "../models/transactionModel";
import * as TransactionHelper from "./helpers/transactionHelper";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Transaction, TransactionSaveRequest } from "../../typeDefinitions";

const validateSaveRequest = (
	transactionSaveRequest: TransactionSaveRequest
): CommandResponse<Transaction> => {

	let errorMessage: string = "";

	if (isNaN(transactionSaveRequest.total) || (transactionSaveRequest.total < 0)) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TOTAL_INVALID);
	} else if (isNaN(transactionSaveRequest.type)) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TYPE_INVALID);
	} else if (transactionSaveRequest.cashierId == null) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_CASHIER_ID_INVALID);
	} else if (transactionSaveRequest.referenceId == null) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_REFERENCE_ID_INVALID);
	}

	return ((errorMessage === "")
		? <CommandResponse<Transaction>>{ status: 200 }
		: <CommandResponse<Transaction>>{
			status: 422,
			message: errorMessage
		});
};

export const execute = async (
	transactionSaveRequest: TransactionSaveRequest
): Promise<CommandResponse<Transaction>> => {

	const validationResponse: CommandResponse<Transaction> =
		validateSaveRequest(transactionSaveRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	const transactionToCreate: TransactionModel = <TransactionModel>{
		type: transactionSaveRequest.type,
		total: transactionSaveRequest.total,
		cashierId: transactionSaveRequest.cashierId,
		referenceId: transactionSaveRequest.referenceId
	};

	return TransactionModel.create(transactionToCreate)
		.then((createdTransaction: TransactionModel): CommandResponse<Transaction> => {
			return <CommandResponse<Transaction>>{
				status: 201,
				data: TransactionHelper.mapTransactionData(createdTransaction)
			};
		});
};
