import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await query('SELECT * FROM hewan WHERE id = $1', [params.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
      `UPDATE hewan SET nama=$1, spesies=$2, asal_hewan=$3, tanggal_lahir=$4, status_kesehatan=$5, nama_habitat=$6, url_foto=$7 WHERE id=$8`,
      [
        body.namaIndividu,
        body.spesies,
        body.asalHewan,
        body.tanggalLahir,
        body.statusKesehatan,
        body.habitat,
        body.fotoUrl,
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
    await query('DELETE FROM hewan WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
