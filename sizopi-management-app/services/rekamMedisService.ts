interface MedicalRecord {
  idHewan: string;
  usernameDh: string;
  tanggalPemeriksaan: string;
  diagnosis: string;
  pengobatan: string;
  statusKesehatan: string;
  catatanTindakLanjut: string;
}

const BASE_URL = "http://localhost:3000/api/rekam-medis";

export async function getAllRekamMedis(): Promise<MedicalRecord[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch rekam medis");
  return res.json();
}

export async function addRekamMedis(data: MedicalRecord) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add rekam medis");
  return res.json();
}

export async function updateRekamMedis(idHewan: string, tanggalPemeriksaan: string, data: Partial<MedicalRecord>) {
  // Convert date to proper format
  const dateOnly = tanggalPemeriksaan.split('T')[0];
  
  const res = await fetch(`${BASE_URL}?idHewan=${encodeURIComponent(idHewan)}&tanggalPemeriksaan=${encodeURIComponent(dateOnly)}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update rekam medis");
  }
  return res.json();
}

export async function deleteRekamMedis(idHewan: string, tanggalPemeriksaan: string) {
  // Convert date to proper format
  const dateOnly = tanggalPemeriksaan.split('T')[0];
  
  const res = await fetch(`${BASE_URL}?idHewan=${encodeURIComponent(idHewan)}&tanggalPemeriksaan=${encodeURIComponent(dateOnly)}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete rekam medis");
  }
}
