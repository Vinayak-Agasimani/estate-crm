import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leads");

      const leadList =
        response?.data?.data ||
        response?.data?.leads ||
        response?.data ||
        [];

      setLeads(Array.isArray(leadList) ? leadList : []);
    } catch (error) {
      console.error("Failed to load leads:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load leads."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const updateLeadStatus = async (leadId, status) => {
    try {
      setUpdatingId(leadId);

      const response = await api.put(`/leads/${leadId}`, {
        status,
      });

      const updatedLead =
        response?.data?.data ||
        response?.data;

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === leadId
            ? updatedLead
            : lead
        )
      );
    } catch (error) {
      console.error(
        "Failed to update lead:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update lead."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const updateLeadPriority = async (
    leadId,
    priority
  ) => {
    try {
      setUpdatingId(leadId);

      const response = await api.put(
        `/leads/${leadId}`,
        {
          priority,
        }
      );

      const updatedLead =
        response?.data?.data ||
        response?.data;

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === leadId
            ? updatedLead
            : lead
        )
      );
    } catch (error) {
      console.error(
        "Failed to update priority:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update priority."
      );
    } finally {
      setUpdatingId(null);
    }
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

  const getCustomerName = (lead) => {
    if (
      lead.customerId &&
      typeof lead.customerId === "object"
    ) {
      return lead.customerId.name || "Unknown";
    }

    return "Unknown";
  };

  const getCustomerPhone = (lead) => {
    if (
      lead.customerId &&
      typeof lead.customerId === "object"
    ) {
      return lead.customerId.phone || "—";
    }

    return "—";
  };

  const getPropertyTitle = (lead) => {
    if (
      lead.propertyId &&
      typeof lead.propertyId === "object"
    ) {
      return (
        lead.propertyId.title ||
        "Unknown property"
      );
    }

    return "Unknown property";
  };

  const getSourceLabel = (source) => {
    if (!source) return "UNKNOWN";

    return source.replaceAll("_", " ");
  };

  const getStatusLabel = (status) => {
    if (!status) return "UNKNOWN";

    return status.replaceAll("_", " ");
  };

  const statusOptions = [
    "NEW",
    "CONTACTED",
    "PROPERTY_SHARED",
    "SITE_VISIT",
    "INTERESTED",
    "NEGOTIATION",
    "BOOKED",
    "WON",
    "LOST",
  ];

  const priorityOptions = [
    "LOW",
    "MEDIUM",
    "HIGH",
  ];

  const websiteLeads = leads.filter(
    (lead) => lead.source === "WEBSITE"
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <Link
              to="/"
              className="text-lg font-semibold tracking-[0.15em]"
            >
              ESTATE<span className="text-black/40">
                CRM
              </span>
            </Link>

            <p className="mt-1 text-xs text-black/40">
              Lead Management
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadLeads}
              className="rounded-full border border-black/10 px-4 py-2 text-xs transition hover:bg-black hover:text-white"
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

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              CRM
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Leads
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Manage customer enquiries, property
              interest and follow-ups from one place.
            </p>
          </div>

          {/* SUMMARY */}

          <div className="flex gap-3">

            <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
              <p className="text-xs text-black/40">
                Total Leads
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {leads.length}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
              <p className="text-xs text-black/40">
                Website
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {websiteLeads.length}
              </p>
            </div>

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-12 text-center">
            <p className="text-sm text-black/40">
              Loading leads...
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl text-white">
              +
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              No leads yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
              Website enquiries and manually created
              leads will appear here.
            </p>

          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white">

            {/* TABLE HEADER */}

            <div className="hidden grid-cols-[1.2fr_1.3fr_1fr_0.8fr_1fr_1fr] gap-4 border-b border-black/10 bg-[#fafafa] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 lg:grid">

              <span>Customer</span>
              <span>Property</span>
              <span>Source</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Created</span>

            </div>

            {/* LEADS */}

            <div>
              {leads.map((lead) => (

                <div
                  key={lead._id}
                  className="grid gap-5 border-b border-black/10 px-6 py-6 last:border-b-0 lg:grid-cols-[1.2fr_1.3fr_1fr_0.8fr_1fr_1fr] lg:items-center lg:gap-4"
                >

                  {/* CUSTOMER */}

                  <div>
                    <p className="text-sm font-semibold">
                      {getCustomerName(lead)}
                    </p>

                    <a
                      href={`tel:${getCustomerPhone(
                        lead
                      )}`}
                      className="mt-1 block text-xs text-black/40 hover:text-black"
                    >
                      {getCustomerPhone(lead)}
                    </a>
                  </div>

                  {/* PROPERTY */}

                  <div>
                    <p className="text-sm font-medium">
                      {getPropertyTitle(lead)}
                    </p>

                    {lead.propertyId &&
                      typeof lead.propertyId ===
                        "object" && (
                        <p className="mt-1 text-xs text-black/40">
                          {[
                            lead.propertyId.locality,
                            lead.propertyId.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                  </div>

                  {/* SOURCE */}

                  <div>
                    <span className="inline-flex rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-medium">
                      {getSourceLabel(
                        lead.source
                      )}
                    </span>
                  </div>

                  {/* PRIORITY */}

                  <div>
                    <select
                      value={
                        lead.priority || "MEDIUM"
                      }
                      disabled={
                        updatingId === lead._id
                      }
                      onChange={(event) =>
                        updateLeadPriority(
                          lead._id,
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-black/30"
                    >
                      {priorityOptions.map(
                        (priority) => (
                          <option
                            key={priority}
                            value={priority}
                          >
                            {priority}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* STATUS */}

                  <div>
                    <select
                      value={
                        lead.status || "NEW"
                      }
                      disabled={
                        updatingId === lead._id
                      }
                      onChange={(event) =>
                        updateLeadStatus(
                          lead._id,
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-black/30"
                    >
                      {statusOptions.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {getStatusLabel(status)}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* DATE */}

                  <div>
                    <p className="text-xs text-black/40">
                      {formatDate(
                        lead.createdAt
                      )}
                    </p>
                  </div>

                  {/* MOBILE DETAILS */}

                  <div className="border-t border-black/10 pt-4 lg:hidden">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/30">
                      Notes
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/60">
                      {lead.notes ||
                        "No notes added."}
                    </p>

                    {lead.nextFollowUp && (
                      <p className="mt-3 text-xs text-black/40">
                        Next follow-up:{" "}
                        {formatDate(
                          lead.nextFollowUp
                        )}
                      </p>
                    )}

                  </div>

                </div>

              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Leads;