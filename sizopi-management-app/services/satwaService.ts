import { Satwa } from "@/types/Satwa";

const BASE_URL = "http://localhost:5001/satwa";

export async function addSatwa(data: Omit<Satwa, "id">) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add satwa");
  return res.json();
}

export async function updateSatwa(id: number, data: Omit<Satwa, "id">) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update satwa");
  return res.json();
}

export async function deleteSatwa(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete satwa");
}

export async function getAllSatwa(): Promise<Satwa[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch satwa");
  return res.json();
}