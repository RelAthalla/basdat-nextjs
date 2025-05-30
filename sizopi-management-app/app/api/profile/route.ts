import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, ...profileData } = body;

    console.log('Profile update request:', { username, profileData });

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Update basic user information in PENGGUNA table
    console.log('Updating PENGGUNA table...');
    await query(`
      UPDATE PENGGUNA SET 
        email = $1,
        nama_depan = $2,
        nama_tengah = $3,
        nama_belakang = $4,
        no_telepon = $5
      WHERE username = $6
    `, [
      profileData.email,
      profileData.namaDepan,
      profileData.namaTengah || null,
      profileData.namaBelakang,
      profileData.no_telepon,
      username
    ]);

    // Update pengunjung-specific data if provided
    if (profileData.alamat !== undefined || profileData.tgl_lahir !== undefined) {
      console.log('Updating PENGUNJUNG table...');
      await query(`
        UPDATE PENGUNJUNG SET 
          alamat = $1,
          tgl_lahir = $2
        WHERE username_p = $3
      `, [
        profileData.alamat || null,
        profileData.tgl_lahir || null,
        username
      ]);
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 }
    );
  }
}
