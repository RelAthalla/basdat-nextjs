import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, username, password, email, namaDepan, namaTengah, namaBelakang, nomorTelepon } = body;

    // Store password directly without hashing
    const plainPassword = password;

    // Start transaction
    await query('BEGIN');

    try {
      // Insert into PENGGUNA table
      await query(
        `INSERT INTO PENGGUNA (username, email, password, nama_depan, nama_tengah, nama_belakang, no_telepon)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [username, email, plainPassword, namaDepan, namaTengah || null, namaBelakang, nomorTelepon]
      );

      // Role-specific insertions
      if (role === 'pengunjung') {
        const { alamatLengkap, tanggalLahir } = body;
        await query(
          `INSERT INTO PENGUNJUNG (username_P, alamat, tgl_lahir) VALUES ($1, $2, $3)`,
          [username, alamatLengkap, tanggalLahir]
        );

      } else if (role === 'dokter') {
        const { nomorSertifikasiProfesional, spesialisasi = [] } = body;
        
        // Insert into DOKTER_HEWAN
        await query(
          `INSERT INTO DOKTER_HEWAN (username_DH, no_STR) VALUES ($1, $2)`,
          [username, nomorSertifikasiProfesional]
        );

        // Insert specializations
        for (const spec of spesialisasi) {
          await query(
            `INSERT INTO SPESIALISASI (username_SH, nama_spesialisasi) VALUES ($1, $2)`,
            [username, spec]
          );
        }

      } else if (role === 'staff') {
        const { peran } = body;
        const staffId = uuidv4();

        if (peran === 'PJHXXX') {
          await query(
            `INSERT INTO PENJAGA_HEWAN (username_jh, id_staf) VALUES ($1, $2)`,
            [username, staffId]
          );
        } else if (peran === 'ADMXXX') {
          await query(
            `INSERT INTO STAF_ADMIN (username_sa, id_staf) VALUES ($1, $2)`,
            [username, staffId]
          );
        } else if (peran === 'PLPXXX') {
          await query(
            `INSERT INTO PELATIH_HEWAN (username_lh, id_staf) VALUES ($1, $2)`,
            [username, staffId]
          );
        }
      }

      // Commit transaction
      await query('COMMIT');

      return NextResponse.json({ 
        message: 'Registrasi berhasil',
        username: username,
        role: role
      }, { status: 201 });

    } catch (error) {
      // Rollback on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique violation
      if (error.detail?.includes('username')) {
        return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
      }
      if (error.detail?.includes('email')) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' 
    }, { status: 500 });
  }
}
