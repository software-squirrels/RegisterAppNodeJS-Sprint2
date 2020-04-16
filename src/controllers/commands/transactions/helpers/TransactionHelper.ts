import * as Helper from "../../helpers/helper";
import { TransactionListing } from "../../../typeDefinitions";
import { TransactionModel } from "../../models/transactionModel";

export const mapTransactionData = (queriedTransaction: TransactionModel): TransactionListing => {
	return <TransactionListing>{
		id: queriedTransaction.id,
		count: queriedTransaction.count,
		price: queriedTransaction.price,
		lookupCode: queriedTransaction.lookupCode,
		createdOn: Helper.formatDate(queriedTransaction.createdOn)
	};
};
