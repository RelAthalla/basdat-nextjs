import {NextResponse} from "next/server";
import {query} from "@/lib/db";

export async function GET() {
	try {
		const res = await query(`
      SELECT id, nama AS "namaIndividu", spesies, asal_hewan AS "asalHewan", 
             tanggal_lahir AS "tanggalLahir", status_kesehatan AS "statusKesehatan", 
             nama_habitat AS habitat, url_foto AS "fotoUrl"
      FROM HEWAN
      ORDER BY nama ASC
    `);
		return new Response(JSON.stringify(res.rows), {status: 200});
	} catch (error) {
		console.error(error);
		return new Response("Failed to fetch hewan", {status: 500});
	}
}

export async function POST(request: Request) {
	try {
		const {namaIndividu, spesies, asalHewan, tanggalLahir, statusKesehatan, habitat, fotoUrl} = await request.json();

		await query(
			`INSERT INTO HEWAN (nama, spesies, asal_hewan, tanggal_lahir, status_kesehatan, nama_habitat, url_foto)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			[namaIndividu, spesies, asalHewan, tanggalLahir, statusKesehatan, habitat, fotoUrl]
		);

		return NextResponse.json({message: "Created"}, {status: 201});
	} catch (error) {
		console.error(error);
		return NextResponse.json({error: "Failed to add hewan"}, {status: 500});
	}
}

export async function PUT(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id) return new Response("Missing id", {status: 400});

		const {namaIndividu, spesies, asalHewan, tanggalLahir, statusKesehatan, habitat, fotoUrl} = await request.json();

		await query(
			`
      UPDATE HEWAN
      SET nama=$1, spesies=$2, asal_hewan=$3, tanggal_lahir=$4, status_kesehatan=$5, nama_habitat=$6, url_foto=$7
      WHERE id=$8
    `,
			[namaIndividu, spesies, asalHewan, tanggalLahir, statusKesehatan, habitat, fotoUrl, id]
		);

		return new Response("Updated", {status: 200});
	} catch (error) {
		console.error(error);
		return new Response("Failed to update hewan", {status: 500});
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id) return new Response("Missing id", {status: 400});

		await query(`DELETE FROM HEWAN WHERE id=$1`, [id]);

		return new Response("Deleted", {status: 200});
	} catch (error) {
		console.error(error);
		return new Response("Failed to delete hewan", {status: 500});
	}
}
