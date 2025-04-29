import { getAllSatwa } from "@/services/satwaService";
import AddSatwaForm from "@/components/AddSatwaForm";
import UpdateSatwaForm from "@/components/UpdateSatwaForm";
import DeleteSatwaButton from "@/components/DeleteSatwaButton";

export default async function ProductsPage() {
  const satwas = await getAllSatwa();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center w-full">DAFTAR SATWA</h1>
          <div className="absolute right-4">
            <AddSatwaForm />
          </div>
        </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-[15%] py-2 px-4 text-left">Nama</th>
              <th className="w-[15%] py-2 px-4 text-left">Spesies</th>
              <th className="w-[15%] py-2 px-4 text-left">Asal</th>
              <th className="w-[15%] py-2 px-4 text-left">Tanggal Lahir</th>
              <th className="w-[15%] py-2 px-4 text-left">Status</th>
              <th className="w-[15%] py-2 px-4 text-left">Habitat</th>
              <th className="w-[10%] py-2 px-4 text-left">Foto</th>
              <th className="w-[10%] py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {satwas.map((satwa) => (
              <tr key={satwa.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{satwa.namaIndividu}</td>
                <td className="py-2 px-4">{satwa.spesies}</td>
                <td className="py-2 px-4">{satwa.asalHewan}</td>
                <td className="py-2 px-4">{satwa.tanggalLahir}</td>
                <td className="py-2 px-4">{satwa.statusKesehatan}</td>
                <td className="py-2 px-4">{satwa.habitat}</td>
                <td className="py-2 px-4">
                  <img src={satwa.fotoUrl} alt={satwa.namaIndividu} width={50} height={50} />
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <UpdateSatwaForm satwa={satwa} />
                  <DeleteSatwaButton satwa={satwa} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
