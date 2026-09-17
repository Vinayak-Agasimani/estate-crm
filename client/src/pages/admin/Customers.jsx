import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    purpose: "BUY",
    preferredLocations: "",
    minBudget: "",
    maxBudget: "",
    bedrooms: "",
    minArea: "",
    amenities: "",
    notes: "",
    status: "ACTIVE",
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD CUSTOMERS
  |--------------------------------------------------------------------------
  */

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/customers");

      const customerList =
        response?.data?.data ||
        response?.data?.customers ||
        response?.data ||
        [];

      setCustomers(
        Array.isArray(customerList)
          ? customerList
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredCustomers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const name =
        customer.name?.toLowerCase() || "";

      const phone =
        customer.phone?.toLowerCase() || "";

      const email =
        customer.email?.toLowerCase() || "";

      return (
        name.includes(query) ||
        phone.includes(query) ||
        email.includes(query)
      );
    });
  }, [customers, search]);

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      purpose: "BUY",
      preferredLocations: "",
      minBudget: "",
      maxBudget: "",
      bedrooms: "",
      minArea: "",
      amenities: "",
      notes: "",
      status: "ACTIVE",
    });

    setEditingCustomer(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const openAddForm = () => {
    setEditingCustomer(null);

    setFormData({
      name: "",
      phone: "",
      email: "",
      purpose: "BUY",
      preferredLocations: "",
      minBudget: "",
      maxBudget: "",
      bedrooms: "",
      minArea: "",
      amenities: "",
      notes: "",
      status: "ACTIVE",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    const requirement =
      customer.requirement || {};

    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",

      purpose:
        requirement.purpose || "BUY",

      preferredLocations:
        Array.isArray(
          requirement.preferredLocations
        )
          ? requirement.preferredLocations.join(
              ", "
            )
          : "",

      minBudget:
        requirement.minBudget ?? "",

      maxBudget:
        requirement.maxBudget ?? "",

      bedrooms:
        requirement.bedrooms ?? "",

      minArea:
        requirement.minArea ?? "",

      amenities:
        Array.isArray(requirement.amenities)
          ? requirement.amenities.join(", ")
          : "",

      notes: customer.notes || "",

      status:
        customer.status || "ACTIVE",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE CUSTOMER
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        "Customer phone number is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const customerData = {
        name: formData.name.trim(),

        phone: formData.phone.trim(),

        email:
          formData.email.trim() ||
          undefined,

        requirement: {
          purpose: formData.purpose,

          preferredLocations:
            formData.preferredLocations
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),

          minBudget:
            formData.minBudget !== ""
              ? Number(formData.minBudget)
              : undefined,

          maxBudget:
            formData.maxBudget !== ""
              ? Number(formData.maxBudget)
              : undefined,

          bedrooms:
            formData.bedrooms !== ""
              ? Number(formData.bedrooms)
              : undefined,

          minArea:
            formData.minArea !== ""
              ? Number(formData.minArea)
              : undefined,

          amenities:
            formData.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
        },

        notes:
          formData.notes.trim() ||
          undefined,

        status: formData.status,
      };

      let response;

      if (editingCustomer) {
        response = await api.put(
          `/customers/${editingCustomer._id}`,
          customerData
        );
      } else {
        response = await api.post(
          "/customers",
          customerData
        );
      }

      const savedCustomer =
        response?.data?.data ||
        response?.data?.customer ||
        response?.data;

      if (editingCustomer) {
        setCustomers((current) =>
          current.map((customer) =>
            customer._id ===
            editingCustomer._id
              ? savedCustomer
              : customer
          )
        );

        setSuccess(
          "Customer updated successfully."
        );
      } else {
        setCustomers((current) => [
          savedCustomer,
          ...current,
        ]);

        setSuccess(
          "Customer added successfully."
        );
      }

      setTimeout(() => {
        resetForm();
      }, 800);
    } catch (error) {
      console.error(
        "Failed to save customer:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to save customer."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT HELPERS
  |--------------------------------------------------------------------------
  */

  const formatBudget = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return null;
    }

    if (number >= 10000000) {
      return `₹${(
        number / 10000000
      ).toFixed(2)} Cr`;
    }

    if (number >= 100000) {
      return `₹${(
        number / 100000
      ).toFixed(2)} L`;
    }

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;
  };

  const getLocations = (customer) => {
    const locations =
      customer.requirement
        ?.preferredLocations;

    if (!Array.isArray(locations)) {
      return "Location not specified";
    }

    return locations.length > 0
      ? locations.join(", ")
      : "Location not specified";
  };

  const getPurpose = (customer) => {
    return (
      customer.requirement?.purpose ||
      "BUY"
    );
  };

  const getBudget = (customer) => {
    const min =
      customer.requirement?.minBudget;

    const max =
      customer.requirement?.maxBudget;

    if (min && max) {
      return `${formatBudget(
        min
      )} – ${formatBudget(max)}`;
    }

    if (max) {
      return `Up to ${formatBudget(max)}`;
    }

    if (min) {
      return `From ${formatBudget(min)}`;
    }

    return "Budget not specified";
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "CONVERTED":
        return "border-green-200 bg-green-50 text-green-700";

      case "INACTIVE":
        return "border-gray-200 bg-gray-50 text-gray-500";

      default:
        return "border-blue-200 bg-blue-50 text-blue-700";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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
              Customer Management
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadCustomers}
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

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* TITLE */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              CRM
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Customers
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Keep every customer's requirements,
              budget and contact information in one
              place.
            </p>

          </div>

          <button
            onClick={openAddForm}
            className="w-fit rounded-full bg-black px-6 py-3 text-sm text-white transition hover:scale-[1.02]"
          >
            + Add Customer
          </button>

        </div>

        {/* SEARCH */}

        <div className="mt-8 rounded-3xl border border-black/10 bg-white p-5">

          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
            Search customers
          </label>

          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, phone or email..."
              className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-5 py-4 text-sm outline-none transition focus:border-black/30"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-black/40 hover:text-black"
              >
                Clear
              </button>
            )}

          </div>

          <div className="mt-4 flex gap-5 text-xs text-black/40">

            <span>
              Total:{" "}
              <strong className="text-black">
                {customers.length}
              </strong>
            </span>

            <span>
              Showing:{" "}
              <strong className="text-black">
                {filteredCustomers.length}
              </strong>
            </span>

          </div>

        </div>

        {/* ERROR */}

        {error && !showForm && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CUSTOMER FORM */}

        {showForm && (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  {editingCustomer
                    ? "Edit customer"
                    : "New customer"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {editingCustomer
                    ? "Update customer"
                    : "Add customer"}
                </h2>

              </div>

              <button
                onClick={resetForm}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:bg-black hover:text-white"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-8"
            >

              {/* CONTACT */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/30">
                  Contact information
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-3">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Customer name"
                    required
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                </div>

              </div>

              {/* REQUIREMENT */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/30">
                  Property requirement
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-3">

                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  >
                    <option value="BUY">
                      Buy
                    </option>

                    <option value="RENT">
                      Rent
                    </option>

                    <option value="LEASE">
                      Lease
                    </option>
                  </select>

                  <input
                    type="text"
                    name="preferredLocations"
                    value={
                      formData.preferredLocations
                    }
                    onChange={handleChange}
                    placeholder="Preferred locations (comma separated)"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="Bedrooms"
                    min="0"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="Minimum budget (₹)"
                    min="0"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="Maximum budget (₹)"
                    min="0"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    type="number"
                    name="minArea"
                    value={formData.minArea}
                    onChange={handleChange}
                    placeholder="Minimum area (sq.ft)"
                    min="0"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                </div>

                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Required amenities (comma separated)"
                  className="mt-4 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                />

              </div>

              {/* NOTES + STATUS */}

              <div className="grid gap-4 md:grid-cols-3">

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Customer notes..."
                  rows={5}
                  className="resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30 md:col-span-2"
                />

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                    Customer status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="CONVERTED">
                      Converted
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              {/* FORM ERROR */}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : "Add Customer"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-black/10 px-7 py-3.5 text-sm transition hover:bg-black hover:text-white"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* CUSTOMER LIST */}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-14 text-center">
            <p className="text-sm text-black/40">
              Loading customers...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-14 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              ○
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              {search
                ? "No customers found"
                : "No customers yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
              {search
                ? "Try searching with a different name, phone number or email."
                : "Add your first customer to start building the CRM database."}
            </p>

            {!search && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
              >
                + Add Customer
              </button>
            )}

          </div>
        ) : (
          <div className="mt-8 space-y-4">

            {filteredCustomers.map(
              (customer) => (
                <article
                  key={customer._id}
                  className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:shadow-lg md:p-7"
                >

                  {/* CUSTOMER HEADER */}

                  <div className="flex flex-col justify-between gap-6 lg:flex-row">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-semibold">
                          {customer.name}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase ${getStatusClasses(
                            customer.status
                          )}`}
                        >
                          {customer.status ||
                            "ACTIVE"}
                        </span>

                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/50">

                        <a
                          href={`tel:${customer.phone}`}
                          className="transition hover:text-black"
                        >
                          📞 {customer.phone}
                        </a>

                        {customer.email && (
                          <span>
                            ✉ {customer.email}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2">

                      {/* CUSTOMER 360 */}

                      <Link
                        to={`/admin/customers/${customer._id}`}
                        className="rounded-full bg-black px-5 py-2.5 text-xs text-white transition hover:opacity-80"
                      >
                        View 360°
                      </Link>

                      {/* CALL */}

                      <a
                        href={`tel:${customer.phone}`}
                        className="rounded-full border border-black/10 px-4 py-2.5 text-xs transition hover:bg-black hover:text-white"
                      >
                        Call
                      </a>

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          openEditForm(
                            customer
                          )
                        }
                        className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs transition hover:bg-black hover:text-white"
                      >
                        Edit
                      </button>

                    </div>

                  </div>

                  {/* REQUIREMENT */}

                  <div className="mt-7 grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-[#f7f7f7] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Purpose
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {getPurpose(
                          customer
                        )}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-[#f7f7f7] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Budget
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {getBudget(
                          customer
                        )}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-[#f7f7f7] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Bedrooms
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {customer
                          .requirement
                          ?.bedrooms ??
                          "Any"}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-[#f7f7f7] p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Minimum Area
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {customer
                          .requirement
                          ?.minArea
                          ? `${customer.requirement.minArea} sq.ft`
                          : "Any"}
                      </p>

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="mt-4 rounded-2xl border border-black/10 p-4">

                    <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                      Preferred locations
                    </p>

                    <p className="mt-2 text-sm text-black/60">
                      {getLocations(
                        customer
                      )}
                    </p>

                  </div>

                  {/* NOTES */}

                  {customer.notes && (
                    <div className="mt-4 rounded-2xl border border-black/10 p-4">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Notes
                      </p>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                        {customer.notes}
                      </p>

                    </div>
                  )}

                </article>
              )
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default Customers;