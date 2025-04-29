import { getAllHabitat } from "@/services/habitatService";
import AddHabitatForm from "@/components/AddHabitatForm";
import UpdateHabitatForm from "@/components/UpdateHabitatForm";
import DeleteHabitatButton from "@/components/DeleteHabitatButton";
import HabitatDetailButton from "@/components/HabitatDetailButton";

export default async function HabitatPage() {
  const habitats = await getAllHabitat();

  return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-center w-full">DAFTAR HABITAT</h1>
            <div className="absolute right-4">
            <AddHabitatForm />
            </div>
        </div>
        <div className="overflow-x-auto mt-6">
        <table className="table w-full border border-gray-300">
            <thead className="bg-gray-100">
            <tr>
                <th className="w-[20%] border border-gray-300 px-4 py-2">Nama Habitat</th>
                <th className="w-[20%] border border-gray-300 px-4 py-2">Luas Area</th>
                <th className="w-[20%] border border-gray-300 px-4 py-2">Kapasitas Maksimal</th>
                <th className="w-[20%] border border-gray-300 px-4 py-2">Status Lingkungan</th>
                <th className="w-[20%] border border-gray-300 px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white">
            {habitats.map((habitat) => (
                <tr key={habitat.id}>
                <td className="border border-gray-300 px-4 py-2">{habitat.namaHabitat}</td>
                <td className="border border-gray-300 px-4 py-2">{habitat.luasArea} m²</td>
                <td className="border border-gray-300 px-4 py-2">{habitat.kapasitas}</td>
                <td className="border border-gray-300 px-4 py-2">{habitat.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-3">
                    <HabitatDetailButton id={habitat.id} />
                    <UpdateHabitatForm habitat={habitat} />
                    <DeleteHabitatButton habitat={habitat} />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
}