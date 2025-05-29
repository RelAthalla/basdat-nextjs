import {Satwa} from "@/types/Satwa";

const BASE_URL = "http://localhost:3000/api/hewan";

export async function addSatwa(data: Omit<Satwa, "id">) {
	const res = await fetch(BASE_URL, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text(); // baca body sebagai teks
		throw new Error(`Failed to add satwa: ${res.status} - ${errorText}`);
	}

	return res.json();
}

export async function updateSatwa(id: string, data: Omit<Satwa, "id">) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update satwa");
	return res.json();
}

export async function deleteSatwa(id: string) {
	const res = await fetch(`${BASE_URL}?id=${id}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Failed to delete satwa");
}

export async function getAllSatwa(): Promise<Satwa[]> {
	const res = await fetch(BASE_URL);
	if (!res.ok) throw new Error("Failed to fetch satwa");
	return res.json();
}
