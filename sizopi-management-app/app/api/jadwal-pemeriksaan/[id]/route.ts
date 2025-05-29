import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await query(
      `SELECT id, id_hewan AS "idHewan", tanggal_pemeriksaan AS "tanggalPemeriksaan", 
              waktu_pemeriksaan AS "waktuPemeriksaan", jenis_pemeriksaan AS "jenisPemeriksaan", 
              nama_dokter AS "namaDokter", status_jadwal AS "statusJadwal"
       FROM JADWAL_PEMERIKSAAN WHERE id = $1`, 
      [params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Jadwal pemeriksaan not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    await query(
      `UPDATE JADWAL_PEMERIKSAAN SET tanggal_pemeriksaan=$1, waktu_pemeriksaan=$2, jenis_pemeriksaan=$3, nama_dokter=$4, status_jadwal=$5 WHERE id=$6`,
      [
        body.tanggalPemeriksaan,
        body.waktuPemeriksaan,
        body.jenisPemeriksaan,
        body.namaDokter,
        body.statusJadwal,
        params.id,
      ]
    );
    
    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM JADWAL_PEMERIKSAAN WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
