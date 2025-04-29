"use client";

import { useState, SyntheticEvent } from "react";
import { addHabitat } from "@/services/habitatService";
import { useRouter } from "next/navigation";

export default function AddHabitatForm() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    namaHabitat: "",
    luasArea: 0,
    kapasitas: 0,
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function toggleModal() {
    setModal(!modal);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addHabitat(form);
      router.refresh();
      toggleModal();
      setForm({ namaHabitat: "", luasArea: 0, kapasitas: 0, status: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button className="btn" onClick={toggleModal}>Add New Habitat</button>

      <input
        type="checkbox"
        checked={modal}
        onChange={toggleModal}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Habitat</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label font-bold">Nama Habitat</label>
              <input
                type="text"
                value={form.namaHabitat}
                onChange={(e) => setForm({ ...form, namaHabitat: e.target.value })}
                className="input w-full input-bordered"
                placeholder="Nama Habitat"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Luas Area</label>
              <input
                type="number"
                value={form.luasArea}
                onChange={(e) => setForm({ ...form, luasArea: parseFloat(e.target.value) })}
                className="input w-full input-bordered"
                placeholder="Luas Area"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Kapasitas</label>
              <input
                type="number"
                value={form.kapasitas}
                onChange={(e) => setForm({ ...form, kapasitas: parseInt(e.target.value) })}
                className="input w-full input-bordered"
                placeholder="Kapasitas"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input w-full input-bordered"
                placeholder="Status"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={toggleModal}>Close</button>
              <button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}