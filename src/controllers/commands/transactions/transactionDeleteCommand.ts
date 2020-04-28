import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { TransactionModel } from "../models/transactionModel";
import { CommandResponse } from "../../typeDefinitions";
import { ProductModel } from "../models/productModel";
import * as TransactionRepository from "../models/transactionModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as DatabaseConnection from "../models/databaseConnection";

export const execute = async (transactionId?: string): Promise<CommandResponse<void>> => {
	if (Helper.isBlankString(transactionId)) {
		return <CommandResponse<void>>{ status: 204 };
	}

	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<TransactionModel | null> => {
			deleteTransaction = createdTransaction;

			return TransactionRepository.queryById(
				<string>transactionId,
				deleteTransaction);
		}).then((queriedTransaction: (TransactionModel | null)): Promise<void> => {
			if (queriedTransaction == null) {
				return Promise.resolve();
			}

			return queriedTransaction.destroy(
				<Sequelize.InstanceDestroyOptions>{
					transaction: deleteTransaction
				});
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
