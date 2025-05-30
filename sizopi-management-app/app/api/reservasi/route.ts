import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    console.log('Fetching reservasi for username:', username);
    
    if (!username) {
      console.log('Username is missing');
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get reservations for specific user
    console.log('Executing query for username:', username);
    const res = await query(`
      SELECT 
        r.username_p AS "username",
        r.nama_fasilitas AS "namaFasilitas",
        r.tanggal_kunjungan AS "tanggalKunjungan",
        r.jumlah_tiket AS "jumlahTiket",
        r.status
      FROM RESERVASI r
      WHERE r.username_p = $1
      ORDER BY r.tanggal_kunjungan DESC
    `, [username]);
    
    console.log('Query result:', res.rows.length, 'rows found');
    console.log('Raw query result:', JSON.stringify(res.rows, null, 2));
    
    // Ensure we always return an array
    const reservasiData = res.rows || [];
    console.log('Returning data:', reservasiData);
    
    return NextResponse.json(reservasiData);
  } catch (error) {
    console.error('Error fetching reservasi:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch reservasi data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, namaFasilitas, tanggalKunjungan, jumlahTiket } = body;
    
    await query(
      'INSERT INTO RESERVASI (username_p, nama_fasilitas, tanggal_kunjungan, jumlah_tiket, status) VALUES ($1, $2, $3, $4, $5)',
      [username, namaFasilitas, tanggalKunjungan, jumlahTiket, 'Aktif']
    );
    
    return NextResponse.json({ message: 'Reservasi created successfully' });
  } catch (error) {
    console.error('Error creating reservasi:', error);
    return NextResponse.json(
      { error: 'Failed to create reservasi' },
      { status: 500 }
    );
  }
}
