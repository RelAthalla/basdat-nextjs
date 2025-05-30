import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Get user from database
    const userResult = await query(
      'SELECT username, email, password, nama_depan, nama_tengah, nama_belakang, no_telepon FROM PENGGUNA WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Compare password directly (no encryption)
    if (password !== user.password) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Determine user role
    let role = 'unknown';
    let roleData = null;

    // Check if user is pengunjung
    const pengunjungResult = await query(
      'SELECT alamat, tgl_lahir FROM PENGUNJUNG WHERE username_P = $1',
      [user.username]
    );

    if (pengunjungResult.rows.length > 0) {
      role = 'pengunjung';
      roleData = pengunjungResult.rows[0];
    } else {
      // Check if user is dokter hewan
      const dokterResult = await query(
        `SELECT dh.no_STR, 
                COALESCE(
                  ARRAY_AGG(s.nama_spesialisasi) FILTER (WHERE s.nama_spesialisasi IS NOT NULL),
                  ARRAY[]::TEXT[]
                ) as spesialisasi
         FROM DOKTER_HEWAN dh
         LEFT JOIN SPESIALISASI s ON dh.username_DH = s.username_SH
         WHERE dh.username_DH = $1
         GROUP BY dh.username_DH, dh.no_STR`,
        [user.username]
      );

      if (dokterResult.rows.length > 0) {
        role = 'dokter';
        roleData = dokterResult.rows[0];
      } else {
        // Check staff roles
        const staffQueries = [
          { table: 'PENJAGA_HEWAN', field: 'username_jh', role: 'penjaga' },
          { table: 'STAF_ADMIN', field: 'username_sa', role: 'admin' },
          { table: 'PELATIH_HEWAN', field: 'username_lh', role: 'pelatih' }
        ];

        for (const staffCheck of staffQueries) {
          const staffResult = await query(
            `SELECT id_staf FROM ${staffCheck.table} WHERE ${staffCheck.field} = $1`,
            [user.username]
          );
          
          if (staffResult.rows.length > 0) {
            role = 'staff';
            roleData = { 
              staffType: staffCheck.role, 
              idStaf: staffResult.rows[0].id_staf 
            };
            break;
          }
        }
      }
    }

    // Prepare user response (exclude password)
    const userResponse = {
      username: user.username,
      email: user.email,
      namaDepan: user.nama_depan,
      namaTengah: user.nama_tengah,
      namaBelakang: user.nama_belakang,
      nomorTelepon: user.no_telepon,
      role: role,
      roleData: roleData
    };

    return NextResponse.json({
      message: 'Login berhasil',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
