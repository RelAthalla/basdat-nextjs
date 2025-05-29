import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        p.id_hewan       AS "idHewan",
        p.jadwal,
        p.jenis          AS "jenisPakan", 
        p.jumlah         AS "jumlahPakan",
        p.status,
        h.nama           AS "namaHewan",
        h.spesies
      FROM PAKAN p
      JOIN HEWAN h ON p.id_hewan = h.id
      ORDER BY p.jadwal DESC
    `);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch pakan data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { idHewan, jadwal, jenisPakan, jumlahPakan } = await request.json();

    // Parse jadwal menjadi JS Date
    const ts = new Date(jadwal);
    if (isNaN(ts.getTime())) {
      return NextResponse.json({ error: "Invalid jadwal format" }, { status: 400 });
    }

    await query(
      `INSERT INTO PAKAN (id_hewan, jadwal, jenis, jumlah, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [idHewan, ts, jenisPakan, jumlahPakan, 'Menunggu Pemberian']
    );

    return NextResponse.json({ message: "Pakan data created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to add pakan data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const idHewan = url.searchParams.get("idHewan");
    const rawJadwal = url.searchParams.get("jadwal");

    
    if (!idHewan || !rawJadwal) {
      return NextResponse.json({ error: "Missing idHewan or jadwal" }, { status: 400 });
    }

    const { jenisPakan, jumlahPakan, status } = await request.json();
    const ts =  rawJadwal.replace("T", " ") + ":00";
    
    const result = await query(
      `UPDATE PAKAN
         SET jenis  = $1,
             jumlah = $2,
             status = $3
       WHERE id_hewan = $4
         AND jadwal    = $5`,
      [jenisPakan, jumlahPakan, status || 'Menunggu Pemberian', idHewan, ts]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pakan data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update pakan data" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const idHewan = url.searchParams.get("idHewan");
    const rawJadwal = url.searchParams.get("jadwal");
    if (!idHewan || !rawJadwal) {
      return NextResponse.json({ error: "Missing idHewan or jadwal" }, { status: 400 });
    }

    const ts = new Date(rawJadwal);
    if (isNaN(ts.getTime())) {
      return NextResponse.json({ error: "Invalid jadwal format" }, { status: 400 });
    }

    const result = await query(
      `DELETE FROM PAKAN
       WHERE id_hewan = $1
         AND jadwal    = $2`,
      [idHewan, ts]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pakan data deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete pakan data" }, { status: 500 });
  }
}
