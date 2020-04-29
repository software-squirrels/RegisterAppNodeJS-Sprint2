import { Transaction } from "../../../typeDefinitions";
import { TransactionModel } from "../../models/transactionModel";

export const mapTransactionData = (queriedTransaction: TransactionModel): Transaction => {
	return <Transaction>{
		id: queriedTransaction.id,
		cashierId: queriedTransaction.cashierId,
		total: queriedTransaction.total,
		type: queriedTransaction.type,
		referenceId: queriedTransaction.referenceId
	};
};
