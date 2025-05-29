import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(req.url);
    const tanggalPemeriksaan = url.searchParams.get("tanggalPemeriksaan");
    
    if (!tanggalPemeriksaan) {
      return NextResponse.json({ error: 'tanggalPemeriksaan parameter required' }, { status: 400 });
    }

    const result = await query(
      `SELECT id_hewan AS "idHewan", username_dh AS "usernameDh", 
              tanggal_pemeriksaan AS "tanggalPemeriksaan", diagnosis, 
              pengobatan, status_kesehatan AS "statusKesehatan", 
              catatan_tindak_lanjut AS "catatanTindakLanjut"
       FROM CATATAN_MEDIS WHERE id_hewan = $1 AND tanggal_pemeriksaan = $2`, 
      [params.id, tanggalPemeriksaan]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Catatan medis not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(req.url);
    const tanggalPemeriksaan = url.searchParams.get("tanggalPemeriksaan");
    
    if (!tanggalPemeriksaan) {
      return NextResponse.json({ error: 'tanggalPemeriksaan parameter required' }, { status: 400 });
    }

    const body = await req.json();
    
    await query(
      `UPDATE CATATAN_MEDIS SET diagnosis=$1, pengobatan=$2, catatan_tindak_lanjut=$3 WHERE id_hewan=$4 AND tanggal_pemeriksaan=$5`,
      [
        body.diagnosis,
        body.pengobatan,
        body.catatanTindakLanjut,
        params.id,
        tanggalPemeriksaan,
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
    const url = new URL(req.url);
    const tanggalPemeriksaan = url.searchParams.get("tanggalPemeriksaan");
    
    if (!tanggalPemeriksaan) {
      return NextResponse.json({ error: 'tanggalPemeriksaan parameter required' }, { status: 400 });
    }

    await query('DELETE FROM CATATAN_MEDIS WHERE id_hewan = $1 AND tanggal_pemeriksaan = $2', [params.id, tanggalPemeriksaan]);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
