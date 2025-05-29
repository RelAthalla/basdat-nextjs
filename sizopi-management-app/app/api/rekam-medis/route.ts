import {NextResponse} from "next/server";
import {query} from "@/lib/db";

export async function GET() {
	try {
		const res = await query(`
			SELECT id_hewan AS "idHewan", username_dh AS "usernameDh", 
				   tanggal_pemeriksaan AS "tanggalPemeriksaan", diagnosis, 
				   pengobatan, status_kesehatan AS "statusKesehatan", 
				   catatan_tindak_lanjut AS "catatanTindakLanjut"
			FROM CATATAN_MEDIS
			ORDER BY tanggal_pemeriksaan DESC
		`);
		return NextResponse.json(res.rows);
	} catch (error) {
		console.error("GET Error:", error);
		return NextResponse.json({error: "Failed to fetch catatan medis"}, {status: 500});
	}
}

export async function POST(request: Request) {
	try {
		const {idHewan, usernameDh, tanggalPemeriksaan, diagnosis, pengobatan, statusKesehatan, catatanTindakLanjut} = await request.json();
		
		console.log("POST Data:", {idHewan, usernameDh, tanggalPemeriksaan, diagnosis, pengobatan, statusKesehatan, catatanTindakLanjut});

		await query(
			`INSERT INTO CATATAN_MEDIS (id_hewan, username_dh, tanggal_pemeriksaan, diagnosis, pengobatan, status_kesehatan, catatan_tindak_lanjut)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			[idHewan, usernameDh, tanggalPemeriksaan, diagnosis, pengobatan, statusKesehatan, catatanTindakLanjut]
		);

		return NextResponse.json({message: "Created"}, {status: 201});
	} catch (error) {
		console.error("POST Error:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return NextResponse.json({error: "Failed to add catatan medis", details: errorMessage}, {status: 500});
	}
}

export async function PUT(request: Request) {
	try {
		const url = new URL(request.url);
		const idHewan = url.searchParams.get("idHewan");
		const tanggalPemeriksaan = url.searchParams.get("tanggalPemeriksaan");
		
		console.log("PUT Params received:", {idHewan, tanggalPemeriksaan});
		console.log("Full URL:", request.url);
		
		if (!idHewan || !tanggalPemeriksaan) {
			return NextResponse.json({error: "Missing idHewan or tanggalPemeriksaan"}, {status: 400});
		}

		const {diagnosis, pengobatan, catatanTindakLanjut} = await request.json();
		
		console.log("PUT Data:", {diagnosis, pengobatan, catatanTindakLanjut});

		// Try direct string comparison first
		console.log("Searching for exact match...");
		const exactSearchResult = await query(
			`SELECT * FROM CATATAN_MEDIS WHERE id_hewan::text = $1 AND tanggal_pemeriksaan::text = $2`,
			[idHewan, tanggalPemeriksaan]
		);
		console.log("Exact search result:", exactSearchResult.rows);

		// Also try with LIKE to see partial matches
		const likeSearchResult = await query(
			`SELECT id_hewan, tanggal_pemeriksaan FROM CATATAN_MEDIS WHERE id_hewan::text LIKE $1`,
			[`%${idHewan}%`]
		);
		console.log("LIKE search result:", likeSearchResult.rows);

		// Try the update with explicit type casting
		const result = await query(
			`UPDATE CATATAN_MEDIS
			 SET diagnosis=$1, pengobatan=$2, catatan_tindak_lanjut=$3
			 WHERE id_hewan::text = $4 AND tanggal_pemeriksaan::text = $5`,
			[diagnosis, pengobatan, catatanTindakLanjut, idHewan, tanggalPemeriksaan]
		);
		
		console.log("UPDATE Result:", result);

		if (result.rowCount === 0) {
			return NextResponse.json({
				error: "Record not found or no changes made", 
				debug: {
					searchedIdHewan: idHewan,
					searchedDate: tanggalPemeriksaan,
					exactSearchResult: exactSearchResult.rows,
					likeSearchResult: likeSearchResult.rows
				}
			}, {status: 404});
		}

		return NextResponse.json({message: "Updated", rowCount: result.rowCount}, {status: 200});
	} catch (error) {
		console.error("PUT Error:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return NextResponse.json({error: "Failed to update catatan medis", details: errorMessage}, {status: 500});
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const idHewan = url.searchParams.get("idHewan");
		const tanggalPemeriksaan = url.searchParams.get("tanggalPemeriksaan");
		
		console.log("DELETE Params received:", {idHewan, tanggalPemeriksaan});
		
		if (!idHewan || !tanggalPemeriksaan) {
			return NextResponse.json({error: "Missing idHewan or tanggalPemeriksaan"}, {status: 400});
		}

		// Try delete with text casting
		const result = await query(
			`DELETE FROM CATATAN_MEDIS WHERE id_hewan::text = $1 AND tanggal_pemeriksaan::text = $2`, 
			[idHewan, tanggalPemeriksaan]
		);
		
		console.log("DELETE Result:", result);

		if (result.rowCount === 0) {
			return NextResponse.json({
				error: "Record not found"
			}, {status: 404});
		}

		return NextResponse.json({message: "Deleted", rowCount: result.rowCount}, {status: 200});
	} catch (error) {
		console.error("DELETE Error:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return NextResponse.json({error: "Failed to delete catatan medis", details: errorMessage}, {status: 500});
	}
}
