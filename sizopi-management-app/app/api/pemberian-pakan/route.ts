import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        p.id_hewan AS "idHewan",
        p.jadwal,
        p.jenis AS "jenisPakan",
        p.jumlah AS "jumlahPakan",
        p.status,
        h.nama AS "namaHewan",
        h.spesies
      FROM PAKAN p
      LEFT JOIN HEWAN h ON p.id_hewan = h.id
      ORDER BY p.jadwal DESC
    `);
    
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching pemberian pakan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pemberian pakan data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idHewan, jadwal, jenisPakan, jumlahPakan } = body;
    
    await query(
      'INSERT INTO PAKAN (id_hewan, jadwal, jenis, jumlah, status) VALUES ($1, $2, $3, $4, $5)',
      [idHewan, jadwal, jenisPakan, jumlahPakan, 'Menunggu Pemberian']
    );
    
    return NextResponse.json({ message: 'Pemberian pakan added successfully' });
  } catch (error) {
    console.error('Error adding pemberian pakan:', error);
    return NextResponse.json(
      { error: 'Failed to add pemberian pakan' },
      { status: 500 }
    );
  }
}

function toPgTs(raw: string) {
  const d = new Date(raw);
  if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
       + ` ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idHewan   = searchParams.get('idHewan');
    const rawJadwal = searchParams.get('jadwal');  // could be full ISO

    if (!idHewan || !rawJadwal) {
      return NextResponse.json({ error: 'idHewan and jadwal are required' }, { status: 400 });
    }

    // normalize the original timestamp
    let originalTs: string;
    try { originalTs = toPgTs(rawJadwal); }
    catch {
      return NextResponse.json({ error: 'Invalid jadwal format' }, { status: 400 });
    }

    const body = await request.json();
    const { jenisPakan, jumlahPakan, status, jadwal: newJadwal } = body;

    const updateFields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (jenisPakan !== undefined) {
      updateFields.push(`jenis = $${idx++}`);
      values.push(jenisPakan);
    }
    if (jumlahPakan !== undefined) {
      updateFields.push(`jumlah = $${idx++}`);
      values.push(jumlahPakan);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (newJadwal !== undefined) {
      // normalize the new one too
      let formattedNew: string;
      try { formattedNew = toPgTs(newJadwal); }
      catch {
        return NextResponse.json({ error: 'Invalid new jadwal format' }, { status: 400 });
      }
      updateFields.push(`jadwal = $${idx++}`);
      values.push(formattedNew);
    }

    // append the WHERE params
    values.push(idHewan, originalTs);

    const sql = `
      UPDATE PAKAN
         SET ${updateFields.join(', ')}
       WHERE id_hewan = $${idx++}
         AND jadwal    = $${idx}
    `;
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Pemberian pakan updated successfully' });
  } catch (err) {
    console.error('Error updating pemberian pakan:', err);
    return NextResponse.json({ error: 'Failed to update pemberian pakan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idHewan   = searchParams.get('idHewan');
    const rawJadwal = searchParams.get('jadwal');

    if (!idHewan || !rawJadwal) {
      return NextResponse.json({ error: 'idHewan and jadwal are required' }, { status: 400 });
    }

    let ts: string;
    try { ts = toPgTs(rawJadwal); }
    catch {
      return NextResponse.json({ error: 'Invalid jadwal format' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM PAKAN WHERE id_hewan = $1 AND jadwal = $2',
      [idHewan, ts]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Pemberian pakan deleted successfully' });
  } catch (err) {
    console.error('Error deleting pemberian pakan:', err);
    return NextResponse.json({ error: 'Failed to delete pemberian pakan' }, { status: 500 });
  }
}