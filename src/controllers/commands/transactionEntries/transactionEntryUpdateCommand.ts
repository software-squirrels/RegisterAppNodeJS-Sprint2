
import { ResourceKey } from "../../../resourceLookup";
import { CommandResponse, TransactionEntry, TransactionEntrySaveRequest } from "../../typeDefinitions";
const PG = require('pg');

export const execute = async (
	transactionEntrySaveRequest: TransactionEntrySaveRequest
): Promise<CommandResponse<TransactionEntry>> => {
	const pg = new PG.Client({connectionString: process.env.DATABASE_URL, ssl: "verify-full"});
	await pg.connect();

	const productQuery = await pg.query('select * from product where id = $1;', [transactionEntrySaveRequest.productId]);
	if (productQuery.rowCount === 0) {
		return Promise.reject(ResourceKey.PRODUCT_LOOKUP_CODE_INVALID);
	}
	const product = productQuery.rows[0];

	const transactionEntryQuery = await pg.query(
		'select * from transactionentry where transactionid = $1 and productid = $2;', 
		[transactionEntrySaveRequest.transactionId, product.id]
	);
	if (transactionEntryQuery.rowCount === 0) {
		//Create database entry
		await pg.query('insert into transactionentry(transactionid, productid, quantity, price) values($1, $2, $3, $4);',
			[
				transactionEntrySaveRequest.transactionId, 
				product.id, 
				transactionEntrySaveRequest.quantity, 
				transactionEntrySaveRequest.quantity * product.price
			]
		);
	} else {
		//Update existing entry
		const oldEntry = transactionEntryQuery.rows[0];
		oldEntry.quantity += transactionEntrySaveRequest.quantity;
		oldEntry.price = oldEntry.quantity * product.price;
		await pg.query('UPDATE transactionentry SET quantity = quantity+$1, price = price+$2 WHERE transactionid = $3;',
			[
				transactionEntrySaveRequest.quantity,
				transactionEntrySaveRequest.quantity * product.price,
				transactionEntrySaveRequest.transactionId
			]
		);
	}
	await pg.end();
	return <CommandResponse<TransactionEntry>>{ status: 200 };
};
