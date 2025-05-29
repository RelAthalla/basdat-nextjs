import {Pool} from "pg";

let pool;

if (!pool) {
	pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {rejectUnauthorized: false},
	});
}

export async function query(text, params) {
	const res = await pool.query(text, params);
	return res;
}
