import {Habitat} from "@/types/Habitat";

const BASE_URL = "http://localhost:3000/api/habitat"; 

export async function addHabitat(data: Habitat) {
	const res = await fetch(BASE_URL, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Failed to add habitat: ${errorText || res.statusText}`);
	}

	return;
}

export async function updateHabitat(nama: string, data: Omit<Habitat, "nama">): Promise<void> {
	const url = `${BASE_URL}?nama=${encodeURIComponent(nama)}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Failed to update habitat: ${errorText || res.statusText}`);
	}
}
  
export async function deleteHabitat(nama: string): Promise<void> {
	const url = `${BASE_URL}?nama=${encodeURIComponent(nama)}`;
	const res = await fetch(url, {
		method: "DELETE",
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Failed to delete habitat: ${errorText || res.statusText}`);
	}
}
  

export async function getAllHabitat(): Promise<Habitat[]> {
	const res = await fetch(BASE_URL);
	if (!res.ok) throw new Error("Failed to fetch habitat");
	return res.json();
}

export async function getHabitat(nama: string): Promise<Habitat> {
	const decodedNama = decodeURIComponent(nama);
	const url = `${BASE_URL}?nama=${encodeURIComponent(decodedNama)}`;
	console.log("Fetching URL:", url);

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch habitat");
	const data = await res.json();
	console.log("API response data:", data);
	if (!Array.isArray(data) || data.length === 0) throw new Error("Habitat not found");
	return data[0];
}
  
  
