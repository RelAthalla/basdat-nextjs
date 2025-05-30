import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    console.log('Fetching catatan medis for username:', username);
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get medical records for specific doctor with animal names
    console.log('Executing query for username:', username);
    const res = await query(`
      SELECT 
        cm.id_hewan,
        h.nama AS "nama_hewan",
        cm.tanggal_pemeriksaan AS "tanggal_pemeriksaan",
        cm.diagnosis,
        cm.pengobatan,
        cm.status_kesehatan AS "status_kesehatan",
        cm.catatan_tindak_lanjut AS "catatan_tindak_lanjut"
      FROM CATATAN_MEDIS cm
      LEFT JOIN HEWAN h ON cm.id_hewan = h.id
      WHERE cm.username_dh = $1
      ORDER BY cm.tanggal_pemeriksaan DESC
    `, [username]);
    
    console.log('Query result:', res.rows.length, 'rows found');
    console.log('Raw query result:', JSON.stringify(res.rows, null, 2));
    
    const catatanMedisData = res.rows || [];
    console.log('Returning data:', catatanMedisData);
    
    return NextResponse.json(catatanMedisData);
  } catch (error) {
    console.error('Error fetching catatan medis:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch catatan medis data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
