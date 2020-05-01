import { CommandResponse } from "../../typeDefinitions";
const PG = require("pg");

export const execute = async (transactionId?: string): Promise<CommandResponse<void>> => {
	const pg = new PG.Client({connectionString: process.env.DATABASE_URL, ssl: "verify-full"});
	await pg.connect();
	await pg.query("delete from transactionentry where transactionid = $1;", [transactionId]);
	await pg.end();
	return <CommandResponse<void>>{ status: 200 };
};

export const deleteProductInCart = async (transactionId: string, productId: string): Promise<CommandResponse<void>> => {
	const pg = new PG.Client({connectionString: process.env.DATABASE_URL, ssl: "verify-full"});
	await pg.connect();
	await pg.query("delete from transactionentry where transactionid=$1 and productid=$2;", [transactionId, productId]);
	await pg.end();
	return <CommandResponse<void>>{ status: 200 };
};
