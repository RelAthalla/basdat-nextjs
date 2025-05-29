"use client";

import {useState, useEffect, SyntheticEvent} from "react";
import {updateSatwa} from "@/services/satwaService";
import {Satwa} from "@/types/Satwa";
import {useRouter} from "next/navigation";

export default function UpdateSatwaForm({satwa}: {satwa: Satwa}) {
	const [modal, setModal] = useState(false);
	const [form, setForm] = useState({...satwa});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [habitats, setHabitats] = useState<{nama: string}[]>([]);

	useEffect(() => {
		fetch("/api/habitat")
			.then((res) => res.json())
			.then((data) => setHabitats(data))
			.catch(console.error);
	}, []);

	function toggleModal() {
		setModal(!modal);
	}

	async function handleUpdate(e: SyntheticEvent) {
		e.preventDefault();
		setIsLoading(true);
		try {
			await updateSatwa(satwa.id, form);
			router.refresh();
			toggleModal();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	const labelMapping: Record<string, string> = {
		namaIndividu: "Nama Individu",
		spesies: "Spesies",
		asalHewan: "Asal Hewan",
		tanggalLahir: "Tanggal Lahir",
		statusKesehatan: "Status Kesehatan",
		habitat: "Habitat",
		fotoUrl: "URL Foto",
	};

	return (
		<div>
			<button className="btn btn-info btn-sm" onClick={toggleModal}>
				Edit
			</button>

			<input type="checkbox" checked={modal} onChange={toggleModal} className="modal-toggle" />

			<div className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Edit {satwa.namaIndividu}</h3>
					<form onSubmit={handleUpdate} className="space-y-4">
						{Object.keys(form)
							.filter((key) => key !== "id")
							.map((key) => {
								if (key === "habitat") {
									return (
										<div key={key} className="form-control">
											<label className="label font-bold">{labelMapping[key]}</label>
											<select
												value={(form as any)[key]}
												onChange={(e) => setForm({...form, [key]: e.target.value})}
												className="select select-bordered w-full">
												<option value="">-- Pilih Habitat --</option>
												{habitats.map((hab) => (
													<option key={hab.nama} value={hab.nama}>
														{hab.nama}
													</option>
												))}
											</select>
										</div>
									);
								}
								return (
									<div key={key} className="form-control">
										<label className="label font-bold">{labelMapping[key]}</label>
										<input
											type={key === "tanggalLahir" ? "date" : "text"}
											value={(form as any)[key]}
											onChange={(e) => setForm({...form, [key]: e.target.value})}
											className="input w-full input-bordered"
											placeholder={`Masukkan ${labelMapping[key]}`}
										/>
									</div>
								);
							})}
						<div className="modal-action">
							<button type="button" className="btn btn-outline" onClick={toggleModal}>
								Close
							</button>
							<button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
								{isLoading ? "Updating..." : "Update"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
