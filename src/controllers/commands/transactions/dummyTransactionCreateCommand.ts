import Sequelize from "sequelize";
import { ProductModel } from "../models/productModel";
import { CommandResponse } from "../../typeDefinitions";
import * as ProductRepository from "../models/productModel";
import { TransactionModel } from "../models/transactionModel";
import * as DatabaseConnection from "../models/databaseConnection";
import { TransactionEntryModel } from "../models/transactionEntryModel";

const saveTransactionEntriesViaAsyncAwait = async (
	transactionEntries: TransactionEntryModel[],
	createTransaction: Sequelize.Transaction
): Promise<void> => {

	for (let i: number = 0; i < transactionEntries.length; i++) {
		await TransactionEntryModel.create(
			transactionEntries[i],
			<Sequelize.CreateOptions>{
				transaction: createTransaction
			});
	}
};

const saveTransactionEntriesInRecursivePromiseChain = async (
	transactionEntries: TransactionEntryModel[],
	createTransaction: Sequelize.Transaction,
	indexToSave: number = 0
): Promise<void> => {

	if (indexToSave >= transactionEntries.length) {
		return;
	}

	return TransactionEntryModel.create(
			transactionEntries[indexToSave],
			<Sequelize.CreateOptions>{
				transaction: createTransaction
			}
		).then((): Promise<void> => {
			return saveTransactionEntriesInRecursivePromiseChain(
				transactionEntries,
				createTransaction,
				(indexToSave + 1));
		});
};

export const execute = (employeeId: string): Promise<CommandResponse<void>> => {
	let dummyTransactionTotal: number = 0;
	let createTransaction: Sequelize.Transaction;
	const dummyTransactionEntries: TransactionEntryModel[] = [];

	return ProductRepository.queryAll()
		.then((queriedProducts: ProductModel[]): Promise<Sequelize.Transaction> => {
			for (let i: number = 0; i < queriedProducts.length; i++) {
				const purchasedQuantity =
					(Math.floor(Math.random() * Math.floor(10)) + 1);

				dummyTransactionTotal +=
					(queriedProducts[i].price * purchasedQuantity);

				dummyTransactionEntries.push(<TransactionEntryModel>{
					quantity: purchasedQuantity,
					price: queriedProducts[i].price,
					productId: queriedProducts[i].id
				});
			}

			return DatabaseConnection.createTransaction();
		}).then((createdTrasaction: Sequelize.Transaction): Promise<TransactionModel> => {
			createTransaction = createdTrasaction;

			return TransactionModel.create(<TransactionModel>{
				type: 1,
				cashierId: employeeId,
				total: dummyTransactionTotal
			},
			<Sequelize.CreateOptions>{ transaction: createTransaction });
		}).then((createdDummyTransaction: TransactionModel): Promise<void> => {
			for (let i: number = 0; i < dummyTransactionEntries.length; i++) {
				dummyTransactionEntries[i].transactionId =
					createdDummyTransaction.id;
			}

			return saveTransactionEntriesInRecursivePromiseChain( // Save via promise chain
				dummyTransactionEntries,
				createTransaction);
			// return saveTransactionEntriesViaAsyncAwait( // Save via async/await
			// 	dummyTransactionEntries,
			// 	createTransaction);
		}).then((): CommandResponse<void> => {
			createTransaction.commit();

			return <CommandResponse<void>>{ status: 204 };
		}).catch((error: any): Promise<CommandResponse<void>> => {
			if (createTransaction != null) {
				createTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<void>>{
				status: 500,
				message: error.message
			});
		});
};
