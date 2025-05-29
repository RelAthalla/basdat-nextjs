import {NextResponse} from "next/server";
import {query} from "@/lib/db";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const nama = url.searchParams.get("nama");

		if (nama) {
			// return habitat tertentu
			const result = await query("SELECT * FROM habitat WHERE nama = $1", [nama]);
			return NextResponse.json(result.rows);
		} else {
			// return semua habitat
			const result = await query('SELECT nama, luas_area AS "luasArea", kapasitas, status FROM habitat ORDER BY nama ASC');
			return NextResponse.json(result.rows);
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({error: "Failed to fetch habitat"}, {status: 500});
	}
}

export async function POST(request: Request) {
	try {
		const {nama, luasArea, kapasitas, status} = await request.json();

		await query(
			`
      INSERT INTO HABITAT (nama, luas_area, kapasitas, status)
      VALUES ($1, $2, $3, $4)
    `,
			[nama, luasArea, kapasitas, status]
		);

		return new Response("Created", {status: 201});
	} catch (error) {
		console.error(error);
		return new Response("Failed to add habitat", {status: 500});
	}
}

export async function PUT(request: Request) {
	try {
		const url = new URL(request.url);
		const nama = url.searchParams.get("nama");
		if (!nama) return new Response("Missing nama", {status: 400});

		const {luasArea, kapasitas, status} = await request.json();

		await query(
			`
      UPDATE HABITAT
      SET luas_area=$1, kapasitas=$2, status=$3
      WHERE nama=$4
    `,
			[luasArea, kapasitas, status, nama]
		);

		return new Response("Updated", {status: 200});
	} catch (error) {
		console.error(error);
		return new Response("Failed to update habitat", {status: 500});
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const nama = url.searchParams.get("nama");
		if (!nama) return new Response("Missing nama", {status: 400});

		await query(`DELETE FROM habitat WHERE nama = $1`, [nama]);

		return new Response("Deleted", {status: 200});
	} catch (error) {
		console.error("Error deleting habitat:", error);
		return new Response("Failed to delete habitat", {status: 500});
	}
}
  
  
