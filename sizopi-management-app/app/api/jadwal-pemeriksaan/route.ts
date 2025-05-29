import {NextResponse} from "next/server";
import {query} from "@/lib/db";

export async function GET() {
	try {
		const res = await query(`
			SELECT id, id_hewan AS "idHewan", tanggal_pemeriksaan AS "tanggalPemeriksaan", 
				   waktu_pemeriksaan AS "waktuPemeriksaan", jenis_pemeriksaan AS "jenisPemeriksaan", 
				   nama_dokter AS "namaDokter", status_jadwal AS "statusJadwal"
			FROM JADWAL_PEMERIKSAAN
			ORDER BY tanggal_pemeriksaan ASC, waktu_pemeriksaan ASC
		`);
		return NextResponse.json(res.rows);
	} catch (error) {
		console.error("GET Error:", error);
		return NextResponse.json({error: "Failed to fetch jadwal pemeriksaan"}, {status: 500});
	}
}

export async function POST(request: Request) {
	try {
		const {idHewan, tanggalPemeriksaan, waktuPemeriksaan, jenisPemeriksaan, namaDokter, statusJadwal} = await request.json();

		await query(
			`INSERT INTO JADWAL_PEMERIKSAAN (id_hewan, tanggal_pemeriksaan, waktu_pemeriksaan, jenis_pemeriksaan, nama_dokter, status_jadwal)
			 VALUES ($1, $2, $3, $4, $5, $6)`,
			[idHewan, tanggalPemeriksaan, waktuPemeriksaan, jenisPemeriksaan, namaDokter, statusJadwal]
		);

		return NextResponse.json({message: "Created"}, {status: 201});
	} catch (error) {
		console.error("POST Error:", error);
		return NextResponse.json({error: "Failed to add jadwal pemeriksaan"}, {status: 500});
	}
}

export async function PUT(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id) return NextResponse.json({error: "Missing id"}, {status: 400});

		const {idHewan, tanggalPemeriksaan, waktuPemeriksaan, jenisPemeriksaan, namaDokter, statusJadwal} = await request.json();

		const result = await query(
			`UPDATE JADWAL_PEMERIKSAAN
			 SET id_hewan=$1, tanggal_pemeriksaan=$2, waktu_pemeriksaan=$3, jenis_pemeriksaan=$4, nama_dokter=$5, status_jadwal=$6
			 WHERE id=$7`,
			[idHewan, tanggalPemeriksaan, waktuPemeriksaan, jenisPemeriksaan, namaDokter, statusJadwal, id]
		);

		if (result.rowCount === 0) {
			return NextResponse.json({error: "Record not found"}, {status: 404});
		}

		return NextResponse.json({message: "Updated"}, {status: 200});
	} catch (error) {
		console.error("PUT Error:", error);
		return NextResponse.json({error: "Failed to update jadwal pemeriksaan"}, {status: 500});
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id) return NextResponse.json({error: "Missing id"}, {status: 400});

		const result = await query(`DELETE FROM JADWAL_PEMERIKSAAN WHERE id=$1`, [id]);

		if (result.rowCount === 0) {
			return NextResponse.json({error: "Record not found"}, {status: 404});
		}

		return NextResponse.json({message: "Deleted"}, {status: 200});
	} catch (error) {
		console.error("DELETE Error:", error);
		return NextResponse.json({error: "Failed to delete jadwal pemeriksaan"}, {status: 500});
	}
}
