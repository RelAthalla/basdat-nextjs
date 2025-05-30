import {NextResponse} from "next/server";
import {query} from "@/lib/db";

function toPgTs(raw: string) {
  const d = new Date(raw);
  if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export async function GET(request: Request) {
  try {
    console.log('Fetching all rekam medis...');
    
    const res = await query(`
      SELECT 
        cm.id_hewan AS "idHewan",
        h.nama AS "namaHewan",
        cm.username_dh AS "usernameDh",
        cm.tanggal_pemeriksaan AS "tanggalPemeriksaan",
        cm.diagnosis,
        cm.pengobatan,
        cm.status_kesehatan AS "statusKesehatan",
        cm.catatan_tindak_lanjut AS "catatanTindakLanjut"
      FROM CATATAN_MEDIS cm
      LEFT JOIN HEWAN h ON cm.id_hewan = h.id
      ORDER BY cm.tanggal_pemeriksaan DESC
    `);
    
    console.log('Rekam medis query result:', res.rows.length, 'records found');
    
    const rekamMedisData = res.rows || [];
    
    return NextResponse.json(rekamMedisData);
  } catch (error) {
    console.error('Error fetching rekam medis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch rekam medis data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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
		const rawTanggal = url.searchParams.get("tanggalPemeriksaan");
		
		console.log("PUT Params received:", {idHewan, rawTanggal});
		
		if (!idHewan || !rawTanggal) {
			return NextResponse.json({error: "Missing idHewan or tanggalPemeriksaan"}, {status: 400});
		}

		// normalize the timestamp
		let normalizedDate: string;
		try { 
			normalizedDate = toPgTs(rawTanggal); 
		} catch {
			return NextResponse.json({error: "Invalid date format"}, {status: 400});
		}

		const {diagnosis, pengobatan, catatanTindakLanjut} = await request.json();
		
		console.log("PUT Data:", {diagnosis, pengobatan, catatanTindakLanjut});

		const result = await query(
			`UPDATE CATATAN_MEDIS
			 SET diagnosis=$1, pengobatan=$2, catatan_tindak_lanjut=$3
			 WHERE id_hewan = $4 AND tanggal_pemeriksaan = $5`,
			[diagnosis, pengobatan, catatanTindakLanjut, idHewan, normalizedDate]
		);
		
		console.log("UPDATE Result:", result);

		if (result.rowCount === 0) {
			return NextResponse.json({error: "Record not found"}, {status: 404});
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
		const rawTanggal = url.searchParams.get("tanggalPemeriksaan");
		
		console.log("DELETE Params received:", {idHewan, rawTanggal});
		
		if (!idHewan || !rawTanggal) {
			return NextResponse.json({error: "Missing idHewan or tanggalPemeriksaan"}, {status: 400});
		}

		// normalize the timestamp
		let normalizedDate: string;
		try { 
			normalizedDate = toPgTs(rawTanggal); 
		} catch {
			return NextResponse.json({error: "Invalid date format"}, {status: 400});
		}

		const result = await query(
			`DELETE FROM CATATAN_MEDIS WHERE id_hewan = $1 AND tanggal_pemeriksaan = $2`, 
			[idHewan, normalizedDate]
		);
		
		console.log("DELETE Result:", result);

		if (result.rowCount === 0) {
			return NextResponse.json({error: "Record not found"}, {status: 404});
		}

		return NextResponse.json({message: "Deleted", rowCount: result.rowCount}, {status: 200});
	} catch (error) {
		console.error("DELETE Error:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return NextResponse.json({error: "Failed to delete catatan medis", details: errorMessage}, {status: 500});
	}
}
