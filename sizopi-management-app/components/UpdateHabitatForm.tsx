"use client";

import {useState, SyntheticEvent} from "react";
import {updateHabitat} from "@/services/habitatService";
import {Habitat} from "@/types/Habitat";
import {useRouter} from "next/navigation";

export default function UpdateHabitatForm({habitat}: {habitat: Habitat}) {
	const [modal, setModal] = useState(false);
	const [form, setForm] = useState({...habitat});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	function toggleModal() {
		setModal(!modal);
	}

	async function handleUpdate(e: SyntheticEvent) {
		e.preventDefault();
		setIsLoading(true);
		try {
			await updateHabitat(habitat.nama, form);
			router.refresh();
			toggleModal();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<button className="btn btn-info btn-sm" onClick={toggleModal}>
				Edit
			</button>

			<input type="checkbox" checked={modal} onChange={toggleModal} className="modal-toggle" />

			<div className={`modal ${modal ? "modal-open" : ""}`}>
				<div className="modal-box">
					<h3 className="font-bold text-lg">Edit {habitat.nama}</h3>
					<form onSubmit={handleUpdate}>
						<div className="form-control">
							<label className="label font-bold">Nama Habitat</label>
							<input
								type="text"
								value={form.nama}
								onChange={(e) => setForm({...form, nama: e.target.value})}
								className="input w-full input-bordered"
								placeholder="Nama Habitat"
								disabled
							/>
						</div>
						<div className="form-control">
							<label className="label font-bold">Luas Area</label>
							<input
								type="number"
								value={form.luasArea}
								onChange={(e) => setForm({...form, luasArea: parseFloat(e.target.value)})}
								className="input w-full input-bordered"
								placeholder="Luas Area"
								min={0}
								step="any"
							/>
						</div>
						<div className="form-control">
							<label className="label font-bold">Kapasitas</label>
							<input
								type="number"
								value={form.kapasitas}
								onChange={(e) => setForm({...form, kapasitas: parseInt(e.target.value)})}
								className="input w-full input-bordered"
								placeholder="Kapasitas"
								min={0}
							/>
						</div>
						<div className="form-control">
							<label className="label font-bold">Status</label>
							<input
								type="text"
								value={form.status}
								onChange={(e) => setForm({...form, status: e.target.value})}
								className="input w-full input-bordered"
								placeholder="Status"
							/>
						</div>
						<div className="modal-action">
							<button type="button" className="btn" onClick={toggleModal}>
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
