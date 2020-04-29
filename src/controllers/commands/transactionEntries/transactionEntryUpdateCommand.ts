import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { TransactionEntryModel } from "../models/transactionEntryModel";
import * as TransactionEntryHelper from "./helpers/transactionEntryHelper";
import * as TransactionEntryRepository from "../models/transactionEntryModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import { CommandResponse, TransactionEntry, TransactionEntrySaveRequest } from "../../typeDefinitions";

const buildUpdateObject = (transactionEntrySaveRequest: TransactionEntrySaveRequest): Object => {
	const updateObject: any = {};

	if (transactionEntrySaveRequest.price != null) {
		updateObject.price = transactionEntrySaveRequest.price;
	}
	if (transactionEntrySaveRequest.quantity != null) {
		updateObject.quantity = transactionEntrySaveRequest.quantity;
	}
	if (transactionEntrySaveRequest.productId != null) {
		updateObject.productId = transactionEntrySaveRequest.productId;
	}
	if (transactionEntrySaveRequest.transactionId != null) {
		updateObject.transactionId = transactionEntrySaveRequest.transactionId;
	}

	return updateObject;
};

const validateSaveRequest = (transactionEntrySaveRequest: TransactionEntrySaveRequest): CommandResponse<TransactionEntry> => {
	let errorMessage: string = "";

	if ((transactionEntrySaveRequest.price != null)
		&& isNaN(transactionEntrySaveRequest.price)) {

		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TOTAL_INVALID);
	} else if ((transactionEntrySaveRequest.quantity != null)
		&& isNaN(transactionEntrySaveRequest.quantity)) {

		errorMessage = Resources.getString(ResourceKey.TRANSACTION_TOTAL_INVALID);
	} else if ((transactionEntrySaveRequest.productId != null)
		&& (transactionEntrySaveRequest.productId.trim() === "")) {

		errorMessage = Resources.getString(ResourceKey.TRANSACTION_REFERENCE_ID_INVALID);
	}

	return ((errorMessage === "")
		? <CommandResponse<TransactionEntry>>{ status: 200 }
		: <CommandResponse<TransactionEntry>>{
			status: 422,
			message: errorMessage
		});
};

export const execute = async (
	transactionEntrySaveRequest: TransactionEntrySaveRequest
): Promise<CommandResponse<TransactionEntry>> => {

	const validationResponse: CommandResponse<TransactionEntry> =
		validateSaveRequest(transactionEntrySaveRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	let updateTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<TransactionEntryModel | null> => {
			updateTransaction = createdTransaction;

			return TransactionEntryRepository.queryById(
				<string>transactionEntrySaveRequest.transactionId,
				updateTransaction);
		}).then((queriedTransactionEntry: (TransactionEntryModel | null)): Promise<TransactionEntryModel> => {
			if (queriedTransactionEntry == null) {
				return Promise.reject(<CommandResponse<TransactionEntry>>{
					status: 404,
					message: Resources.getString(ResourceKey.TRANSACTION_NOT_FOUND)
				});
			}

			return queriedTransactionEntry.update(
				buildUpdateObject(transactionEntrySaveRequest),
				<Sequelize.InstanceUpdateOptions>{
					transaction: updateTransaction
				});
		}).then((updatedTransactionEntry: TransactionEntryModel): CommandResponse<TransactionEntry> => {
			updateTransaction.commit();

			return <CommandResponse<TransactionEntry>>{
				status: 200,
				data: TransactionEntryHelper.mapTransactionEntryData(updatedTransactionEntry)
			};
		}).catch((error: any): Promise<CommandResponse<TransactionEntry>> => {
			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<TransactionEntry>>{
				status: (error.status || 500),
				message: (error.messsage
					|| Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_SAVE))
			});
		});
};
