import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [editingOwner, setEditingOwner] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const loadOwners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/owners");

      const ownerData =
        response?.data?.data ||
        response?.data;

      setOwners(
        Array.isArray(ownerData)
          ? ownerData
          : []
      );
    } catch (error) {
      console.error("Failed to load owners:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load owners."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });

    setEditingOwner(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Owner name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Owner phone number is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      if (editingOwner) {
        response = await api.put(
          `/owners/${editingOwner._id}`,
          form
        );
      } else {
        response = await api.post(
          "/owners",
          form
        );
      }

      const updatedOwner =
        response?.data?.data ||
        response?.data?.owner ||
        response?.data;

      if (editingOwner) {
        setOwners((current) =>
          current.map((owner) =>
            owner._id === editingOwner._id
              ? {
                  ...owner,
                  ...updatedOwner,
                }
              : owner
          )
        );

        setSuccess(
          "Owner updated successfully."
        );
      } else {
        setOwners((current) => [
          updatedOwner,
          ...current,
        ]);

        setSuccess(
          "Owner added successfully."
        );
      }

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save owner:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to save owner."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (owner) => {
    setEditingOwner(owner);

    setForm({
      name: owner.name || "",
      phone: owner.phone || "",
      email: owner.email || "",
      address: owner.address || "",
      notes: owner.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredOwners = owners.filter(
    (owner) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) return true;

      return (
        owner.name
          ?.toLowerCase()
          .includes(query) ||
        owner.phone
          ?.toLowerCase()
          .includes(query) ||
        owner.email
          ?.toLowerCase()
          .includes(query) ||
        owner.address
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <Link
              to="/admin/dashboard"
              className="text-lg font-semibold tracking-[0.15em]"
            >
              ESTATE
              <span className="text-black/40">
                CRM
              </span>
            </Link>

            <p className="mt-1 text-xs text-black/40">
              Owner Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOwners}
              className="rounded-full border border-black/10 px-4 py-2.5 text-xs transition hover:bg-black hover:text-white"
            >
              Refresh
            </button>

            <Link
              to="/admin/dashboard"
              className="rounded-full bg-black px-5 py-2.5 text-xs text-white transition hover:opacity-80"
            >
              Dashboard
            </Link>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">

        {/* PAGE INTRO */}

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/30">
            Property owners
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Owners
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/40">
            Manage property owners and connect them with the properties they have listed through your agency.
          </p>
        </div>

        {/* MESSAGES */}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                {editingOwner
                  ? "Edit owner"
                  : "New owner"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {editingOwner
                  ? "Update owner details"
                  : "Add property owner"}
              </h2>
            </div>

            {editingOwner && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-black/40 transition hover:text-black"
              >
                Cancel editing
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Owner full name"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Whitefield, Bengaluru"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

              {/* NOTES */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows="4"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional information about the owner..."
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingOwner
                  ? "Update Owner"
                  : "Add Owner"}
              </button>

              {editingOwner && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-black/10 px-6 py-3 text-sm transition hover:bg-black hover:text-white"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* SEARCH */}

        <section className="mt-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                Owner directory
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {filteredOwners.length}{" "}
                {filteredOwners.length === 1
                  ? "owner"
                  : "owners"}
              </h2>
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search owner..."
              className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30 sm:max-w-xs"
            />

          </div>

        </section>

        {/* OWNER LIST */}

        <section className="mt-5">

          {loading ? (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />

              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-black/40">
                Loading owners
              </p>
            </div>
          ) : filteredOwners.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white p-12 text-center">

              <p className="text-sm text-black/40">
                {search
                  ? "No owners match your search."
                  : "No owners added yet."}
              </p>

            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {filteredOwners.map((owner) => (
                <article
                  key={owner._id}
                  className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:shadow-md"
                >

                  <div className="flex flex-col justify-between gap-5 sm:flex-row">

                    <div className="min-w-0">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                        {owner.name
                          ?.charAt(0)
                          ?.toUpperCase() || "O"}
                      </div>

                      <h3 className="mt-4 text-xl font-semibold">
                        {owner.name}
                      </h3>

                      <a
                        href={`tel:${owner.phone}`}
                        className="mt-2 block text-sm text-black/50 hover:text-black"
                      >
                        📞 {owner.phone}
                      </a>

                      {owner.email && (
                        <a
                          href={`mailto:${owner.email}`}
                          className="mt-1 block break-all text-sm text-black/40 hover:text-black"
                        >
                          ✉ {owner.email}
                        </a>
                      )}

                      {owner.address && (
                        <p className="mt-3 text-sm leading-6 text-black/40">
                          {owner.address}
                        </p>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(owner)
                      }
                      className="h-fit rounded-full border border-black/10 px-5 py-2.5 text-xs transition hover:bg-black hover:text-white"
                    >
                      Edit
                    </button>

                  </div>

                  {owner.notes && (
                    <div className="mt-5 rounded-2xl bg-[#f7f7f7] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Notes
                      </p>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black/50">
                        {owner.notes}
                      </p>

                    </div>
                  )}

                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Owners;