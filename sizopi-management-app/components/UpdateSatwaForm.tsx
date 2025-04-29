"use client";

import { useState, SyntheticEvent } from "react";
import { updateSatwa } from "@/services/satwaService";
import { Satwa } from "@/types/Satwa";
import { useRouter } from "next/navigation";

export default function UpdateSatwaForm({ satwa }: { satwa: Satwa }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ...satwa });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div>
      <button className="btn btn-info btn-sm" onClick={toggleModal}>
        Edit
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={toggleModal}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit {satwa.namaIndividu}</h3>
          <form onSubmit={handleUpdate}>
            {Object.keys(form).filter(key => key !== "id").map((key) => (
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
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}