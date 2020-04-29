import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import * as TransactionHelper from "./helpers/transactionHelper";
import * as TransactionRepository from "../models/transactionModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Transaction, TransactionSaveRequest } from "../../typeDefinitions";
import { TransactionModel } from "../models/transactionModel";
import * as DatabaseConnection from "../models/databaseConnection";

const validateSaveRequest = (saveTransactionRequest: TransactionSaveRequest): CommandResponse<Transaction> => {
	let errorMessage: string = "";

	if (Helper.isBlankString(saveTransactionRequest.id)) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_RECORD_ID_INVALID);

	} else if (Helper.isBlankString(saveTransactionRequest.cashierId)) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_CASHIER_ID_INVALID);
	} else if ((saveTransactionRequest.total == null)
		|| isNaN(saveTransactionRequest.total)) {

		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TOTAL_INVALID);

	} else if ((saveTransactionRequest.type == null)
		|| isNaN(saveTransactionRequest.type)) {
		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TYPE_INVALID);

	} else if (Helper.isBlankString(saveTransactionRequest.referenceId)) {
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
	saveTransactionRequest: TransactionSaveRequest
): Promise<CommandResponse<Transaction>> => {

	const validationResponse: CommandResponse<Transaction> =
		validateSaveRequest(saveTransactionRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	let updateTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<TransactionModel | null> => {
			updateTransaction = createdTransaction;

			return TransactionRepository.queryById(
				<string>saveTransactionRequest.id,
				updateTransaction);
		}).then((queriedProduct: (TransactionModel | null)): Promise<TransactionModel> => {
			if (queriedProduct == null) {
				return Promise.reject(<CommandResponse<Transaction>>{
					status: 404,
					message: Resources.getString(ResourceKey.TRANSACTION_NOT_FOUND)
				});
			}

			return queriedProduct.update(
				<Object>{
					total: saveTransactionRequest.total,
					cashierId: saveTransactionRequest.cashierId
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: updateTransaction
				});
		}).then((updatedTransaction: TransactionModel): CommandResponse<Transaction> => {
			updateTransaction.commit();

			return <CommandResponse<Transaction>>{
				status: 200,
				data: TransactionHelper.mapTransactionData(updatedTransaction)
			};
		}).catch((error: any): Promise<CommandResponse<Transaction>> => {
			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<Transaction>>{
				status: (error.status || 500),
				message: (error.messsage
					|| Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_SAVE))
			});
		});
};
