import { Habitat } from "@/types/Habitat";

const BASE_URL = "http://localhost:5001/habitat";

export async function addHabitat(data: Omit<Habitat, "id">) {
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

export async function updateHabitat(id: number, data: Omit<Habitat, "id">) {
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
export async function deleteHabitat(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete satwa");
}
export async function getAllHabitat(): Promise<Habitat[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch satwa");
    return res.json();
}

export async function getHabitat(id: number): Promise<Habitat> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch habitat");
  return res.json();
}