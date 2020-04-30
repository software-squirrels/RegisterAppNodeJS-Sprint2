import { TransactionEntry } from "../../../typeDefinitions";
import { TransactionEntryModel } from "../../models/transactionEntryModel";

export const mapTransactionEntryData = (queriedTransactionEntry: TransactionEntryModel): TransactionEntry => {
	return <TransactionEntry>{
		price: queriedTransactionEntry.price,
		quantity: queriedTransactionEntry.quantity,
		productId: queriedTransactionEntry.productId,
		transactionId: queriedTransactionEntry.transactionId,
		id: queriedTransactionEntry.id,
		createdOn: queriedTransactionEntry.createdOn
	};
};
