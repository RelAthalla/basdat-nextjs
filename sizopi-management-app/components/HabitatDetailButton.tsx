"use client";

import { useRouter } from "next/navigation";

export default function HabitatDetailButton({nama}: {nama: string}) {
	const router = useRouter();

	function handleDetail() {
		router.push(`/manajemen/data-habitat/${encodeURIComponent(nama)}`);
	}

	return (
		<button type="button" className="btn btn-secondary btn-sm" onClick={handleDetail}>
			Detail
		</button>
	);
}
