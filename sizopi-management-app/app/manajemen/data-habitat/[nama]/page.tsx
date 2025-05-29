import {getHabitat} from "@/services/habitatService";
import {Habitat} from "@/types/Habitat";
import {notFound} from "next/navigation";

type Props = {
	params: {nama: string};
};

export default async function HabitatDetailPage({params}: Props) {
	const nama = params.nama;
	let habitat: Habitat | null = null;

	try {
		habitat = await getHabitat(nama);
	} catch (error) {
		console.log(error);
		return notFound();
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">Detail Habitat</h1>
			<div className="card bg-white shadow-md rounded-xl p-6 border border-gray-200">
				<div className="space-y-4 text-gray-800">
					<p>
						<strong>Nama Habitat:</strong> {habitat.nama}
					</p>
					<p>
						<strong>Luas Area:</strong> {habitat.luasArea} m²
					</p>
					<p>
						<strong>Kapasitas:</strong> {habitat.kapasitas}
					</p>
					<p>
						<strong>Status:</strong> {habitat.status}
					</p>
				</div>
			</div>
		</div>
	);
}
