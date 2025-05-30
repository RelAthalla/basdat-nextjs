import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { username, oldPassword, newPassword } = await request.json();

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Get current password from PENGGUNA table
    const userResult = await query('SELECT password FROM PENGGUNA WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentPassword = userResult.rows[0].password;

    // Verify old password (plain text comparison)
    if (oldPassword !== currentPassword) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 400 });
    }

    // Update password in PENGGUNA table (plain text)
    await query('UPDATE PENGGUNA SET password = $1 WHERE username = $2', [newPassword, username]);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
