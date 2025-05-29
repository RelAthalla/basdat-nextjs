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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idHewan = searchParams.get('idHewan');
    const jadwal = searchParams.get('jadwal');
    
    if (!idHewan || !jadwal) {
      return NextResponse.json(
        { error: 'idHewan and jadwal are required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { jenisPakan, jumlahPakan, status, jadwal: newJadwal } = body;
    
    // Simple approach like hewan API - direct update using the URL parameters
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    if (jenisPakan !== undefined) {
      updateFields.push(`jenis = $${paramCount++}`);
      values.push(jenisPakan);
    }
    if (jumlahPakan !== undefined) {
      updateFields.push(`jumlah = $${paramCount++}`);
      values.push(jumlahPakan);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (newJadwal !== undefined) {
      updateFields.push(`jadwal = $${paramCount++}`);
      values.push(newJadwal);
    }
    
    values.push(idHewan, jadwal);
    
    const result = await query(
      `UPDATE PAKAN SET ${updateFields.join(', ')} WHERE id_hewan = $${paramCount++} AND jadwal = $${paramCount}`,
      values
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Pemberian pakan updated successfully' });
  } catch (error) {
    console.error('Error updating pemberian pakan:', error);
    return NextResponse.json(
      { error: 'Failed to update pemberian pakan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idHewan = searchParams.get('idHewan');
    const jadwal = searchParams.get('jadwal');
    
    if (!idHewan || !jadwal) {
      return NextResponse.json(
        { error: 'idHewan and jadwal are required' },
        { status: 400 }
      );
    }
    
    const result = await query(
      'DELETE FROM PAKAN WHERE id_hewan = $1 AND jadwal = $2',
      [idHewan, jadwal]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Pemberian pakan deleted successfully' });
  } catch (error) {
    console.error('Error deleting pemberian pakan:', error);
    return NextResponse.json(
      { error: 'Failed to delete pemberian pakan' },
      { status: 500 }
    );
  }
}
