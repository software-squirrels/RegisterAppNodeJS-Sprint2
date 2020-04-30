import Sequelize from "sequelize";
import { TransactionEntryModel } from "../models/transactionEntryModel";
import { CommandResponse } from "../../typeDefinitions";
import * as TransactionEntryRepository from "../models/transactionEntryModel";
import * as DatabaseConnection from "../models/databaseConnection";
import { Resources, ResourceKey } from "../../../resourceLookup";

export const execute = async (transactionId?: string): Promise<CommandResponse<void>> => {
	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<TransactionEntryModel[] | null> => {
			deleteTransaction = createdTransaction;

			return TransactionEntryRepository.queryByTransactionId(
				<string>transactionId,
				deleteTransaction);
		}).then((queriedTransactionEntry: (TransactionEntryModel[] | null)): void => {
			return queriedTransactionEntry!.forEach(entry => entry.destroy(
				<Sequelize.DestroyOptions>{
					transaction: deleteTransaction
				}));
		}).then((): CommandResponse<void> => {
			deleteTransaction.commit();

			return <CommandResponse<void>>{ status: 204 };
		}).catch((error: any): Promise<CommandResponse<void>> => {
			if (deleteTransaction != null) {
				deleteTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<void>>{
				status: (error.status || 500),
				message: (error.message
					|| Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_DELETE))
			});
		});
};