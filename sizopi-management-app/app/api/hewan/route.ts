import {NextResponse} from "next/server";
import db from "@/lib/db";

export async function GET() {
	try {
		const result = await db.query("SELECT * FROM hewan LIMIT 20");
		return NextResponse.json(result.rows);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({error: error.message}, {status: 500});
		}
		return NextResponse.json({error: "Unknown error"}, {status: 500});
	}
}
