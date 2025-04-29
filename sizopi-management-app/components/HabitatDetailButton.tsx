"use client";

import { useRouter } from "next/navigation";

export default function HabitatDetailButton({ id }: { id: number }) {
  const router = useRouter();

  function handleDetail() {
    router.push(`/habitat/${id}`);
  }

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={handleDetail}
    >
      Detail
    </button>
  );
}
