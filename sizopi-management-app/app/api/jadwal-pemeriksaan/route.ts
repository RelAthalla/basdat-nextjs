import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT
        j.id_hewan                       AS "idHewan",
        to_char(j.tgl_pemeriksaan_selanjutnya,'YYYY-MM-DD')
          AS "tglSelanjutnya",
        j.freq_pemeriksaan_rutin        AS "freqRutin",
        h.nama                          AS "namaHewan"
      FROM jadwal_pemeriksaan_kesehatan j
      JOIN hewan h   ON j.id_hewan = h.id
      ORDER BY h.nama, j.tgl_pemeriksaan_selanjutnya
    `, []);
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const { idHewan, tglSelanjutnya, freqRutin } = await request.json();
    await query(
      `INSERT INTO jadwal_pemeriksaan_kesehatan
         (id_hewan, tgl_pemeriksaan_selanjutnya, freq_pemeriksaan_rutin)
       VALUES ($1, $2, $3)`,
      [idHewan, tglSelanjutnya, freqRutin]
    );
    return NextResponse.json({ message: 'Created' }, { status: 201 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 1) pull everything from the JSON body
    const {
      idHewan,
      origTanggal,      // original date key
      tglSelanjutnya,   // new date
      freqRutin
    } = await request.json();

    if (!idHewan || !origTanggal) {
      return NextResponse.json(
        { error: 'Missing idHewan or origTanggal in body' },
        { status: 400 }
      );
    }
	console.log(tglSelanjutnya, freqRutin, idHewan, origTanggal);		
    // 2) do the update
    const res = await query(
      `UPDATE jadwal_pemeriksaan_kesehatan
         SET tgl_pemeriksaan_selanjutnya = $1,
             freq_pemeriksaan_rutin      = $2
       WHERE id_hewan = $3
         AND tgl_pemeriksaan_selanjutnya = $4`,
      [ tglSelanjutnya, freqRutin, idHewan, origTanggal ]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Updated' });
  } catch (err) {
    console.error('PUT Error:', err);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // also take keys from the body
    const { idHewan, origTanggal } = await request.json();
    if (!idHewan || !origTanggal) {
      return NextResponse.json(
        { error: 'Missing idHewan or origTanggal in body' },
        { status: 400 }
      );
    }

    const res = await query(
      `DELETE FROM jadwal_pemeriksaan_kesehatan
       WHERE id_hewan = $1
         AND tgl_pemeriksaan_selanjutnya = $2`,
      [ idHewan, origTanggal ]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
