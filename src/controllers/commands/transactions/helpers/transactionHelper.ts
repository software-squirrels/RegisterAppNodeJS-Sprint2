import * as Helper from "../../helpers/helper";
import { TransactionListing } from "../../../typeDefinitions";
import { TransactionModel } from "../../models/transactionModel";

export const mapTransactionData = (queriedTransaction: TransactionModel): TransactionListing => {
	return <TransactionListing>{
		id: queriedTransaction.id,
		total: queriedTransaction.total,
		cashierId: queriedTransaction.cashierId,
		createdOn: Helper.formatDate(queriedTransaction.createdOn),
		transactionType: queriedTransaction.type,
		transactionReferenceId: queriedTransaction.referenceId
	};
};
