"use client";

import {useState} from "react";
import {deleteHabitat} from "@/services/habitatService";
import {Habitat} from "@/types/Habitat";
import {useRouter} from "next/navigation";

export default function DeleteHabitatButton({habitat}: {habitat: Habitat}) {
	const [modal, setModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	function toggleModal() {
		setModal(!modal);
	}

	async function handleDelete() {
		setIsLoading(true);
		try {
			await deleteHabitat(habitat.nama);
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
			<button className="btn btn-error btn-sm" onClick={toggleModal}>
				Delete
			</button>

			<input type="checkbox" checked={modal} onChange={toggleModal} className="modal-toggle" />

			<div className={`modal ${modal ? "modal-open" : ""}`}>
				<div className="modal-box">
					<h3 className="font-bold text-lg">Are you sure you want to delete {habitat.nama}?</h3>
					<div className="modal-action">
						<button type="button" className="btn" onClick={toggleModal}>
							Close
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							disabled={isLoading}>
							{isLoading ? "Deleting..." : "Delete"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
