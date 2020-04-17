const PG = require('pg');
const pg = new PG.Client({connectionString: process.env.DATABASE_URL + '?ssl=true'});

async function queryByID(id: String) {
	await pg.connect();
	const q = await pg.query(`select * from transactionentry where id = $1`, [id]).catch(console.error)
	if (!q || !q.rowCount) {
		await pg.end();
		return null;
	}
	await pg.end();
	return q.rows[0];
}

async function queryByProductID(id: String) {
	await pg.connect();
	const q = await pg.query(`select * from transactionentry where productid = $1`, [id]).catch(console.error)
	if (!q || !q.rowCount) {
		await pg.end();
		return null;
	}
	await pg.end();
	return q.rows;
}

async function queryByTransactionID(id: String) {
	await pg.connect();
	const q = await pg.query(`select * from transactionentry where transactionid = $1`, [id]).catch(console.error)
	if (!q || !q.rowCount) {
		await pg.end();
		return null;
	}
	await pg.end();
	return q.rows;
}

async function queryByTransactionIDandProductID(transactionID: String, productID: String) {
	await pg.connect();
	const q = await pg.query(`select * from transactionentry where transactionid = $1 and productid = $2`, [transactionID, productID]).catch(console.error)
	if (!q || !q.rowCount) {
		await pg.end();
		return null;
	}
	await pg.end();
	return q.rows[0];
}

