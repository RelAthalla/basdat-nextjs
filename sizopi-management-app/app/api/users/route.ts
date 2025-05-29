import {NextResponse} from "next/server";
import { query } from "@/lib/db";

export async function GET() {
	try {
		const result = await query("SELECT * FROM pengguna LIMIT 10");
		return NextResponse.json(result.rows);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({error: error.message}, {status: 500});
		}
		return NextResponse.json({error: "Unknown error"}, {status: 500});
	}
      
}
