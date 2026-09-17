import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    date: "",
    purpose: "",
    notes: "",
    status: "PENDING",
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        followUpsResponse,
        customersResponse,
      ] = await Promise.all([
        api.get("/followups"),
        api.get("/customers"),
      ]);

      const followUpList =
        followUpsResponse?.data?.data ||
        followUpsResponse?.data?.followUps ||
        followUpsResponse?.data ||
        [];

      const customerList =
        customersResponse?.data?.data ||
        customersResponse?.data?.customers ||
        customersResponse?.data ||
        [];

      setFollowUps(
        Array.isArray(followUpList)
          ? followUpList
          : []
      );

      setCustomers(
        Array.isArray(customerList)
          ? customerList
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load follow-ups:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load follow-ups."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredFollowUps = useMemo(() => {
    if (statusFilter === "ALL") {
      return followUps;
    }

    return followUps.filter(
      (followUp) =>
        followUp.status === statusFilter
    );
  }, [followUps, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setFormData({
      customerId: "",
      date: "",
      purpose: "",
      notes: "",
      status: "PENDING",
    });

    setShowForm(false);
    setError("");
    setSuccess("");
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
  | CREATE FOLLOW-UP
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.date) {
      setError("Please select a follow-up date.");
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the follow-up purpose.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/followups",
        {
          customerId: formData.customerId,
          date: formData.date,
          purpose: formData.purpose.trim(),
          notes: formData.notes.trim(),
          status: formData.status,
        }
      );

      const createdFollowUp =
        response?.data?.data ||
        response?.data?.followUp ||
        response?.data;

      setFollowUps((current) => [
        createdFollowUp,
        ...current,
      ]);

      setSuccess(
        "Follow-up created successfully."
      );

      setFormData({
        customerId: "",
        date: "",
        purpose: "",
        notes: "",
        status: "PENDING",
      });

      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 900);
    } catch (error) {
      console.error(
        "Failed to create follow-up:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to create follow-up."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const updateStatus = async (
    followUpId,
    status
  ) => {
    try {
      const response = await api.put(
        `/followups/${followUpId}`,
        {
          status,
        }
      );

      const updatedFollowUp =
        response?.data?.data ||
        response?.data?.followUp ||
        response?.data;

      setFollowUps((current) =>
        current.map((followUp) =>
          followUp._id === followUpId
            ? updatedFollowUp
            : followUp
        )
      );
    } catch (error) {
      console.error(
        "Failed to update follow-up:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update follow-up."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getCustomerName = (followUp) => {
    if (
      followUp.customerId &&
      typeof followUp.customerId === "object"
    ) {
      return (
        followUp.customerId.name ||
        "Unknown customer"
      );
    }

    const customer = customers.find(
      (item) =>
        item._id === followUp.customerId
    );

    return customer?.name || "Unknown customer";
  };

  const getCustomerPhone = (followUp) => {
    if (
      followUp.customerId &&
      typeof followUp.customerId === "object"
    ) {
      return followUp.customerId.phone || "";
    }

    const customer = customers.find(
      (item) =>
        item._id === followUp.customerId
    );

    return customer?.phone || "";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "COMPLETED":
        return "border-green-200 bg-green-50 text-green-700";

      case "MISSED":
        return "border-red-200 bg-red-50 text-red-700";

      case "CANCELLED":
        return "border-gray-200 bg-gray-50 text-gray-500";

      default:
        return "border-blue-200 bg-blue-50 text-blue-700";
    }
  };

  const statusOptions = [
    "PENDING",
    "COMPLETED",
    "MISSED",
    "CANCELLED",
  ];

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const pendingCount = followUps.filter(
    (item) => item.status === "PENDING"
  ).length;

  const completedCount = followUps.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const missedCount = followUps.filter(
    (item) => item.status === "MISSED"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
              Follow-up Management
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadData}
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

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* TITLE */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              CRM
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Follow-ups
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Never lose track of a customer who needs
              a call, visit or follow-up.
            </p>

          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="w-fit rounded-full bg-black px-6 py-3 text-sm text-white transition hover:scale-[1.02]"
          >
            + Add Follow-up
          </button>

        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-black/10 bg-white p-6">

            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Pending
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {pendingCount}
            </p>

          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">

            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Completed
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {completedCount}
            </p>

          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">

            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Missed
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {missedCount}
            </p>

          </div>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        {showForm && (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  New activity
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Schedule follow-up
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
              className="mt-8 space-y-6"
            >

              <div className="grid gap-4 md:grid-cols-2">

                {/* CUSTOMER */}

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                    Customer
                  </label>

                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  >
                    <option value="">
                      Select customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={customer._id}
                          value={customer._id}
                        >
                          {customer.name} —{" "}
                          {customer.phone}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DATE */}

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                    Follow-up date
                  </label>

                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />
                </div>

              </div>

              {/* PURPOSE */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                  Purpose
                </label>

                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Example: Call customer about site visit"
                  required
                  className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any important information..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30 md:w-1/3"
                >
                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ERROR */}

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

              {/* BUTTONS */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Create Follow-up"}
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

        {/* =====================================================
            FILTER
        ===================================================== */}

        <div className="mt-8 flex flex-wrap items-center gap-2">

          {[
            "ALL",
            "PENDING",
            "COMPLETED",
            "MISSED",
            "CANCELLED",
          ].map((status) => (

            <button
              key={status}
              onClick={() =>
                setStatusFilter(status)
              }
              className={`rounded-full px-5 py-2.5 text-xs transition ${
                statusFilter === status
                  ? "bg-black text-white"
                  : "border border-black/10 bg-white text-black/50 hover:bg-black hover:text-white"
              }`}
            >
              {status}
            </button>

          ))}

        </div>

        {/* =====================================================
            LIST
        ===================================================== */}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-14 text-center">
            <p className="text-sm text-black/40">
              Loading follow-ups...
            </p>
          </div>
        ) : filteredFollowUps.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-14 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No follow-ups found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
              Schedule your next customer call or
              activity to keep the sales process moving.
            </p>

          </div>
        ) : (
          <div className="mt-8 space-y-4">

            {filteredFollowUps.map(
              (followUp) => {

                const customerName =
                  getCustomerName(
                    followUp
                  );

                const customerPhone =
                  getCustomerPhone(
                    followUp
                  );

                return (
                  <article
                    key={followUp._id}
                    className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:shadow-lg md:p-7"
                  >

                    <div className="flex flex-col justify-between gap-6 lg:flex-row">

                      {/* LEFT */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-semibold">
                            {customerName}
                          </h2>

                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase ${getStatusClasses(
                              followUp.status
                            )}`}
                          >
                            {followUp.status ||
                              "PENDING"}
                          </span>

                        </div>

                        {customerPhone && (
                          <a
                            href={`tel:${customerPhone}`}
                            className="mt-2 block text-sm text-black/40 hover:text-black"
                          >
                            📞 {customerPhone}
                          </a>
                        )}

                      </div>

                      {/* DATE */}

                      <div className="lg:text-right">

                        <p className="text-xs uppercase tracking-[0.15em] text-black/30">
                          Scheduled
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          {formatDate(
                            followUp.date
                          )}
                        </p>

                      </div>

                    </div>

                    {/* PURPOSE */}

                    <div className="mt-6 rounded-2xl bg-[#f7f7f7] p-5">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Purpose
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {followUp.purpose ||
                          "No purpose specified"}
                      </p>

                    </div>

                    {/* NOTES */}

                    {followUp.notes && (
                      <div className="mt-4 rounded-2xl border border-black/10 p-5">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                          Notes
                        </p>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                          {followUp.notes}
                        </p>

                      </div>
                    )}

                    {/* STATUS ACTION */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-black/30">
                        Update follow-up status
                      </p>

                      <select
                        value={
                          followUp.status ||
                          "PENDING"
                        }
                        onChange={(event) =>
                          updateStatus(
                            followUp._id,
                            event.target.value
                          )
                        }
                        className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs outline-none focus:border-black/30"
                      >
                        {statusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default FollowUps;