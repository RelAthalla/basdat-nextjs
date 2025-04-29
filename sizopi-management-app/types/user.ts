export type Role =
  | 'dokter_hewan'
  | 'penjaga_hewan'
  | 'staff_administrasi'
  | 'pelatih_pertunjukan'
  | 'pengunjung'
  | 'adopter';

interface BaseUser {
  username: string;
  email: string;
  noTelp: string;
  namaDepan: string;
  namaTengah?: string;
  namaBelakang: string;
  role: Role;
}

export interface StaffAdministrasi extends BaseUser {
  role: 'staff_administrasi';
  id_staf: string;
}

export interface PenjagaHewan extends BaseUser {
  role: 'penjaga_hewan';
  id_staf: string;
}

export interface PelatihPertunjukan extends BaseUser {
  role: 'pelatih_pertunjukan';
  id_staf: string;
}

export interface Pengunjung extends BaseUser {
  role: 'pengunjung';
  alamat: string;
  tanggalLahir: string; 
}

export interface DokterHewan extends BaseUser {
  role: 'dokter_hewan';
  noSertif: string;
  sertifikasi: string[]; 
}

export type User = 
  | StaffAdministrasi 
  | PenjagaHewan 
  | PelatihPertunjukan 
  | Pengunjung 
  | DokterHewan;
