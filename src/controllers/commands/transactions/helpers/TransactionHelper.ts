import * as Helper from "../../helpers/helper";
import { TransactionListing } from "../../../typeDefinitions";
import { TransactionModel } from "../../models/transactionModel";

export const mapTransactionData = (queriedTransaction: TransactionModel): TransactionListing => {
	return <TransactionListing>{
		id: queriedTransaction.id,
		cashierId: queriedTransaction.cashierId,
		total: queriedTransaction.total,
		transactionType: queriedTransaction.type,
		transactionReferenceId: queriedTransaction.referenceId
	};
};
