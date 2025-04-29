"use client";

import { useState, SyntheticEvent } from "react";
import { addSatwa } from "@/services/satwaService";
import { useRouter } from "next/navigation";

export default function AddSatwaForm() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    namaIndividu: "",
    spesies: "",
    asalHewan: "",
    tanggalLahir: "",
    statusKesehatan: "",
    habitat: "",
    fotoUrl: "",
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
      await addSatwa(form);
      router.refresh();
      toggleModal();
      setForm({
        namaIndividu: "",
        spesies: "",
        asalHewan: "",
        tanggalLahir: "",
        statusKesehatan: "",
        habitat: "",
        fotoUrl: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button className="btn" onClick={toggleModal}>
        Add New Satwa
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={toggleModal}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Satwa</h3>
          <form onSubmit={handleSubmit}>
            {Object.keys(form).map((key) => (
              <div key={key} className="form-control">
                <label className="label font-bold">{key}</label>
                <input
                  type={key === "tanggalLahir" ? "date" : "text"}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input w-full input-bordered"
                  placeholder={key}
                />
              </div>
            ))}
            <div className="modal-action">
              <button type="button" className="btn" onClick={toggleModal}>
                Close
              </button>
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