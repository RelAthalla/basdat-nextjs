import { getHabitat } from "@/services/habitatService";
import { Habitat } from "@/types/Habitat";
import { notFound } from "next/navigation";

export default async function HabitatDetailPage({ params }: { params: { id: number } }) {
  let habitat: Habitat | null = null;

  try {
    habitat = await getHabitat(Number(params.id));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Detail Habitat</h1>
      <div className="card bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div className="space-y-4 text-gray-800">
          <p><strong>ID:</strong> {habitat.id}</p>
          <p><strong>Nama Habitat:</strong> {habitat.namaHabitat}</p>
          <p><strong>Luas Area:</strong> {habitat.luasArea} m²</p>
          <p><strong>Kapasitas:</strong> {habitat.kapasitas}</p>
          <p><strong>Status:</strong> {habitat.status}</p>
        </div>
      </div>
    </div>
  );
}