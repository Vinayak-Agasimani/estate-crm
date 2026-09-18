import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../services/api";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    customer: null,
    leads: [],
    followUps: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingLead, setUpdatingLead] =
    useState(null);

  const [leadSuccess, setLeadSuccess] =
    useState("");

  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [creatingActivity, setCreatingActivity] = useState(false);
  const [activitySuccess, setActivitySuccess] = useState("");
  const [activityError, setActivityError] = useState("");

  const [activityForm, setActivityForm] = useState({
    type: "CALL",
    title: "",
    description: "",
    leadId: "",
    propertyId: "",
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD CUSTOMER 360
  |--------------------------------------------------------------------------
  */

  const loadCustomer360 = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/customers/${id}/360`
      );

      const customerData =
        response?.data?.data ||
        response?.data;

      setData({
        customer:
          customerData?.customer || null,

        leads: Array.isArray(
          customerData?.leads
        )
          ? customerData.leads
          : [],

        followUps: Array.isArray(
          customerData?.followUps
        )
          ? customerData.followUps
          : [],
      });
    } catch (error) {
      console.error(
        "Failed to load customer 360:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load customer details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCustomer360();
      loadActivities();
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | LOAD ACTIVITIES
  |--------------------------------------------------------------------------
  */

  const loadActivities = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const response = await api.get(
        `/activities/customer/${id}`
      );

      const activityData =
        response?.data?.data ||
        response?.data;

      setActivities(
        Array.isArray(activityData)
          ? activityData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load activities:",
        error
      );

      setActivityError(
        error?.response?.data?.message ||
          "Failed to load activity timeline."
      );
    } finally {
      setActivityLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE ACTIVITY
  |--------------------------------------------------------------------------
  */

  const createActivity = async (event) => {
    event.preventDefault();

    if (!activityForm.title.trim()) {
      setActivityError(
        "Please enter an activity title."
      );
      return;
    }

    try {
      setCreatingActivity(true);
      setActivityError("");
      setActivitySuccess("");

      const payload = {
        customerId: id,
        type: activityForm.type,
        title: activityForm.title.trim(),
        description:
          activityForm.description.trim(),
      };

      if (activityForm.leadId) {
        payload.leadId = activityForm.leadId;
      }

      if (activityForm.propertyId) {
        payload.propertyId = activityForm.propertyId;
      }

      const response = await api.post(
        "/activities",
        payload
      );

      const newActivity =
        response?.data?.data ||
        response?.data?.activity ||
        response?.data;

      if (newActivity) {
        setActivities((current) => [
          newActivity,
          ...current,
        ]);
      } else {
        await loadActivities();
      }

      setActivityForm({
        type: "CALL",
        title: "",
        description: "",
        leadId: "",
        propertyId: "",
      });

      setActivitySuccess(
        "Activity added successfully."
      );

      setTimeout(() => {
        setActivitySuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to create activity:",
        error
      );

      setActivityError(
        error?.response?.data?.message ||
          "Failed to create activity."
      );
    } finally {
      setCreatingActivity(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "CALL":
        return "📞";
      case "WHATSAPP":
        return "💬";
      case "SITE_VISIT":
        return "🏠";
      case "PROPERTY_SHARED":
        return "📤";
      case "MEETING":
        return "🤝";
      case "NEGOTIATION":
        return "💰";
      case "NOTE":
        return "📝";
      default:
        return "•";
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "SITE_VISIT":
        return "Site Visit";
      case "PROPERTY_SHARED":
        return "Property Shared";
      case "WHATSAPP":
        return "WhatsApp";
      case "NEGOTIATION":
        return "Negotiation";
      case "CALL":
        return "Call";
      case "MEETING":
        return "Meeting";
      case "NOTE":
        return "Note";
      default:
        return type;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE LEAD
  |--------------------------------------------------------------------------
  */

  const updateLead = async (
    leadId,
    updates
  ) => {
    try {
      setUpdatingLead(leadId);
      setLeadSuccess("");
      setError("");

      const response = await api.put(
        `/leads/${leadId}`,
        updates
      );

      const updatedLead =
        response?.data?.data ||
        response?.data?.lead ||
        response?.data;

      setData((current) => ({
        ...current,

        leads: current.leads.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                ...updatedLead,
              }
            : lead
        ),
      }));

      setLeadSuccess(
        "Lead updated successfully."
      );

      setTimeout(() => {
        setLeadSuccess("");
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to update lead:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to update lead."
      );
    } finally {
      setUpdatingLead(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT HELPERS
  |--------------------------------------------------------------------------
  */

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

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "—";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;
  };

  /*
  |--------------------------------------------------------------------------
  | LEAD STATUS COLORS
  |--------------------------------------------------------------------------
  */

  const getLeadStatusClasses = (status) => {
    switch (status) {
      case "NEW":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "CONTACTED":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "PROPERTY_SHARED":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";

      case "SITE_VISIT":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "INTERESTED":
        return "border-green-200 bg-green-50 text-green-700";

      case "NEGOTIATION":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "BOOKED":
        return "border-cyan-200 bg-cyan-50 text-cyan-700";

      case "WON":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "LOST":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-black/10 bg-white text-black/50";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRIORITY COLORS
  |--------------------------------------------------------------------------
  */

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "HIGH":
        return "border-red-200 bg-red-50 text-red-700";

      case "MEDIUM":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "LOW":
        return "border-gray-200 bg-gray-50 text-gray-500";

      default:
        return "border-black/10 bg-white text-black/40";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FOLLOW-UP COLORS
  |--------------------------------------------------------------------------
  */

  const getFollowUpClasses = (status) => {
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

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-black/10 border-t-black" />

          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-black/40">
            Loading customer
          </p>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error && !data.customer) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-6 py-10">

        <div className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Customer not found
          </h1>

          <p className="mt-3 text-sm text-black/40">
            {error ||
              "Unable to load this customer."}
          </p>

          <button
            onClick={() =>
              navigate("/admin/customers")
            }
            className="mt-7 rounded-full bg-black px-6 py-3 text-sm text-white"
          >
            Back to Customers
          </button>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const { customer, leads, followUps } = data;

  const requirement =
    customer.requirement || {};

  const propertyTypes =
    requirement.propertyTypes || [];

  const preferredLocations =
    requirement.preferredLocations || [];

  const amenities =
    requirement.amenities || [];

  const pendingFollowUps =
    followUps.filter(
      (item) =>
        item.status === "PENDING"
    );

  /*
  |--------------------------------------------------------------------------
  | PAGE
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
              Customer 360
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadCustomer360}
              className="rounded-full border border-black/10 px-4 py-2.5 text-xs transition hover:bg-black hover:text-white"
            >
              Refresh
            </button>

            <Link
              to="/admin/customers"
              className="rounded-full bg-black px-5 py-2.5 text-xs text-white transition hover:opacity-80"
            >
              Customers
            </Link>

          </div>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/admin/customers")
          }
          className="text-xs text-black/40 transition hover:text-black"
        >
          ← Back to customers
        </button>

        {/* SUCCESS MESSAGE */}

        {leadSuccess && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {leadSuccess}
          </div>
        )}

        {/* GENERAL ERROR */}

        {error && data.customer && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CUSTOMER HERO */}

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-black text-white">

          <div className="p-7 md:p-10">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Customer 360
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  {customer.name}
                </h1>

                <div className="mt-5 flex flex-col gap-2 text-sm text-white/50 sm:flex-row sm:gap-6">

                  {customer.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="transition hover:text-white"
                    >
                      📞 {customer.phone}
                    </a>
                  )}

                  {customer.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="transition hover:text-white"
                    >
                      ✉ {customer.email}
                    </a>
                  )}

                </div>

              </div>

              <div className="flex flex-wrap gap-3">

                {customer.phone && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
                  >
                    Call Customer
                  </a>
                )}

                {customer.phone && (
                  <a
                    href={`https://wa.me/91${customer.phone.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white hover:text-black"
                  >
                    WhatsApp
                  </a>
                )}

              </div>

            </div>

          </div>

          {/* STATS */}

          <div className="grid border-t border-white/10 sm:grid-cols-3">

            <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                Leads
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {leads.length}
              </p>

            </div>

            <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                Follow-ups
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {followUps.length}
              </p>

            </div>

            <div className="p-6">

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                Pending
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {pendingFollowUps.length}
              </p>

            </div>

          </div>

        </section>

        {/* MAIN GRID */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* REQUIREMENT */}

          <section className="rounded-3xl border border-black/10 bg-white p-6 lg:col-span-2 md:p-8">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-black/30">
                Requirement
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                What this customer wants
              </h2>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Purpose
                </p>

                <p className="mt-2 text-sm font-medium">
                  {requirement.purpose ||
                    "Not specified"}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Bedrooms
                </p>

                <p className="mt-2 text-sm font-medium">
                  {requirement.bedrooms
                    ? `${requirement.bedrooms} BHK`
                    : "Not specified"}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Minimum budget
                </p>

                <p className="mt-2 text-sm font-medium">
                  {formatPrice(
                    requirement.minBudget
                  )}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Maximum budget
                </p>

                <p className="mt-2 text-sm font-medium">
                  {formatPrice(
                    requirement.maxBudget
                  )}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Minimum area
                </p>

                <p className="mt-2 text-sm font-medium">
                  {requirement.minArea
                    ? `${requirement.minArea} sq.ft`
                    : "Not specified"}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Customer status
                </p>

                <p className="mt-2 text-sm font-medium">
                  {customer.status ||
                    "ACTIVE"}
                </p>

              </div>

            </div>

            {/* PROPERTY TYPES */}

            <div className="mt-7">

              <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                Property types
              </p>

              {propertyTypes.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">

                  {propertyTypes.map(
                    (type) => (
                      <span
                        key={type}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs"
                      >
                        {type}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-2 text-sm text-black/40">
                  No property types specified.
                </p>
              )}

            </div>

            {/* LOCATIONS */}

            <div className="mt-7">

              <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                Preferred locations
              </p>

              {preferredLocations.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">

                  {preferredLocations.map(
                    (location) => (
                      <span
                        key={location}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs"
                      >
                        {location}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-2 text-sm text-black/40">
                  No preferred locations specified.
                </p>
              )}

            </div>

            {/* AMENITIES */}

            {amenities.length > 0 && (
              <div className="mt-7">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Desired amenities
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {amenities.map(
                    (amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs"
                      >
                        {amenity}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          </section>

          {/* CUSTOMER INFORMATION */}

          <section className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">

            <p className="text-xs uppercase tracking-[0.25em] text-black/30">
              Contact
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Customer information
            </h2>

            <div className="mt-7 space-y-5">

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium">
                  {customer.name}
                </p>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Phone
                </p>

                <a
                  href={`tel:${customer.phone}`}
                  className="mt-2 block text-sm font-medium hover:underline"
                >
                  {customer.phone ||
                    "Not available"}
                </a>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-medium">
                  {customer.email ||
                    "Not available"}
                </p>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Created
                </p>

                <p className="mt-2 text-sm font-medium">
                  {formatDate(
                    customer.createdAt
                  )}
                </p>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Assigned agent
                </p>

                <p className="mt-2 text-sm font-medium">
                  {customer.assignedAgent
                    ?.name ||
                    "Unassigned"}
                </p>

              </div>

            </div>

            {customer.notes && (
              <div className="mt-7 rounded-2xl bg-[#f7f7f7] p-5">

                <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Notes
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                  {customer.notes}
                </p>

              </div>
            )}

          </section>

        </div>

        {/* LEADS */}

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-black/30">
                Sales history
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Properties & leads
              </h2>

            </div>

            <p className="text-xs text-black/30">
              {leads.length}{" "}
              {leads.length === 1
                ? "lead"
                : "leads"}
            </p>

          </div>

          {leads.length === 0 ? (

            <div className="mt-7 rounded-2xl border border-dashed border-black/10 p-10 text-center">

              <p className="text-sm text-black/40">
                No property enquiries yet.
              </p>

            </div>

          ) : (

            <div className="mt-7 space-y-4">

              {leads.map((lead) => {

                const property =
                  lead.propertyId;

                return (

                  <article
                    key={lead._id}
                    className="rounded-3xl border border-black/10 p-5 transition hover:border-black/20 hover:shadow-md md:p-6"
                  >

                    {/* LEAD HEADER */}

                    <div className="flex flex-col justify-between gap-5 lg:flex-row">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${getLeadStatusClasses(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${getPriorityClasses(
                              lead.priority
                            )}`}
                          >
                            {lead.priority}
                          </span>

                          <span className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] text-black/40">
                            {lead.source}
                          </span>

                        </div>

                        <h3 className="mt-4 text-xl font-semibold">
                          {property?.title ||
                            "Property unavailable"}
                        </h3>

                        {property && (
                          <p className="mt-2 text-sm text-black/40">

                            {property.propertyType ||
                              "Property"}

                            {" • "}

                            {property.transactionType ||
                              ""}

                            {property.city
                              ? ` • ${property.city}`
                              : ""}

                          </p>
                        )}

                      </div>

                      {property?.price !==
                        undefined && (

                        <div className="lg:text-right">

                          <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                            Listed price
                          </p>

                          <p className="mt-2 text-lg font-semibold">
                            {formatPrice(
                              property.price
                            )}
                          </p>

                        </div>

                      )}

                    </div>

                    {/* LEAD DETAILS */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                      <div className="rounded-2xl bg-[#f7f7f7] p-4">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                          Created
                        </p>

                        <p className="mt-2 text-xs font-medium">
                          {formatDate(
                            lead.createdAt
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#f7f7f7] p-4">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                          Next follow-up
                        </p>

                        <p className="mt-2 text-xs font-medium">
                          {formatDateTime(
                            lead.nextFollowUp
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#f7f7f7] p-4">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                          Agent
                        </p>

                        <p className="mt-2 text-xs font-medium">
                          {lead.assignedAgent
                            ?.name ||
                            "Unassigned"}
                        </p>

                      </div>

                    </div>

                    {/* LEAD NOTES */}

                    {lead.notes && (
                      <div className="mt-4 rounded-2xl border border-black/10 p-4">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                          Lead notes
                        </p>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                          {lead.notes}
                        </p>

                      </div>
                    )}

                    {/* LEAD CONTROLS */}

                    <div className="mt-5 border-t border-black/10 pt-5">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div className="grid gap-4 sm:grid-cols-2">

                          {/* STATUS */}

                          <div>

                            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                              Lead status
                            </label>

                            <select
                              value={
                                lead.status ||
                                "NEW"
                              }
                              disabled={
                                updatingLead ===
                                lead._id
                              }
                              onChange={(
                                event
                              ) =>
                                updateLead(
                                  lead._id,
                                  {
                                    status:
                                      event
                                        .target
                                        .value,
                                  }
                                )
                              }
                              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs outline-none transition focus:border-black/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              <option value="NEW">
                                NEW
                              </option>

                              <option value="CONTACTED">
                                CONTACTED
                              </option>

                              <option value="PROPERTY_SHARED">
                                PROPERTY SHARED
                              </option>

                              <option value="SITE_VISIT">
                                SITE VISIT
                              </option>

                              <option value="INTERESTED">
                                INTERESTED
                              </option>

                              <option value="NEGOTIATION">
                                NEGOTIATION
                              </option>

                              <option value="BOOKED">
                                BOOKED
                              </option>

                              <option value="WON">
                                WON
                              </option>

                              <option value="LOST">
                                LOST
                              </option>

                            </select>

                          </div>

                          {/* PRIORITY */}

                          <div>

                            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                              Priority
                            </label>

                            <select
                              value={
                                lead.priority ||
                                "MEDIUM"
                              }
                              disabled={
                                updatingLead ===
                                lead._id
                              }
                              onChange={(
                                event
                              ) =>
                                updateLead(
                                  lead._id,
                                  {
                                    priority:
                                      event
                                        .target
                                        .value,
                                  }
                                )
                              }
                              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs outline-none transition focus:border-black/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              <option value="LOW">
                                LOW
                              </option>

                              <option value="MEDIUM">
                                MEDIUM
                              </option>

                              <option value="HIGH">
                                HIGH
                              </option>

                            </select>

                          </div>

                        </div>

                        {updatingLead ===
                          lead._id && (
                          <p className="text-xs text-black/40">
                            Updating...
                          </p>
                        )}

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

        {/* FOLLOW UPS */}

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-black/30">
                Activity
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Follow-up history
              </h2>

            </div>

            <Link
              to="/admin/followups"
              className="text-xs text-black/40 transition hover:text-black"
            >
              Manage follow-ups →
            </Link>

          </div>

          {followUps.length === 0 ? (

            <div className="mt-7 rounded-2xl border border-dashed border-black/10 p-10 text-center">

              <p className="text-sm text-black/40">
                No follow-up activity yet.
              </p>

            </div>

          ) : (

            <div className="mt-7 space-y-3">

              {followUps.map(
                (followUp) => (

                  <article
                    key={followUp._id}
                    className="flex flex-col justify-between gap-5 rounded-2xl border border-black/10 p-5 md:flex-row md:items-center"
                  >

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${getFollowUpClasses(
                            followUp.status
                          )}`}
                        >
                          {followUp.status}
                        </span>

                        <span className="text-xs text-black/30">
                          {formatDateTime(
                            followUp.date
                          )}
                        </span>

                      </div>

                      <h3 className="mt-3 text-sm font-semibold">
                        {followUp.purpose ||
                          "Follow-up"}
                      </h3>

                      {followUp.notes && (
                        <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-black/50">
                          {followUp.notes}
                        </p>
                      )}

                    </div>

                    <div className="md:text-right">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                        Assigned to
                      </p>

                      <p className="mt-2 text-xs font-medium">
                        {followUp.assignedTo
                          ?.name ||
                          "Unassigned"}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* ACTIVITY TIMELINE */}

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 md:p-8">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-black/30">
                Customer history
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Activity timeline
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/40">
                Record calls, messages, site visits, meetings and important notes so the full customer history stays in one place.
              </p>
            </div>

            <p className="text-xs text-black/30">
              {activities.length}{" "}
              {activities.length === 1
                ? "activity"
                : "activities"}
            </p>
          </div>

          {activitySuccess && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              {activitySuccess}
            </div>
          )}

          {activityError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {activityError}
            </div>
          )}

          {/* ADD ACTIVITY FORM */}

          <form
            onSubmit={createActivity}
            className="mt-7 rounded-3xl bg-[#f7f7f7] p-5 md:p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Activity type
                </label>

                <select
                  value={activityForm.type}
                  onChange={(event) =>
                    setActivityForm((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
                >
                  <option value="CALL">Call</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SITE_VISIT">Site Visit</option>
                  <option value="PROPERTY_SHARED">Property Shared</option>
                  <option value="MEETING">Meeting</option>
                  <option value="NOTE">Note</option>
                  <option value="NEGOTIATION">Negotiation</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Title
                </label>

                <input
                  type="text"
                  value={activityForm.title}
                  onChange={(event) =>
                    setActivityForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Discussed 3 BHK villa"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Related lead
                </label>

                <select
                  value={activityForm.leadId}
                  onChange={(event) => {
                    const selectedLeadId = event.target.value;
                    const selectedLead = leads.find(
                      (lead) => lead._id === selectedLeadId
                    );

                    setActivityForm((current) => ({
                      ...current,
                      leadId: selectedLeadId,
                      propertyId:
                        selectedLead?.propertyId?._id || "",
                    }));
                  }}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
                >
                  <option value="">No specific lead</option>

                  {leads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.propertyId?.title ||
                        "Property"}{" "}
                      — {lead.status || "NEW"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Related property
                </label>

                <select
                  value={activityForm.propertyId}
                  onChange={(event) =>
                    setActivityForm((current) => ({
                      ...current,
                      propertyId: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
                >
                  <option value="">No specific property</option>

                  {leads
                    .filter(
                      (lead) =>
                        lead.propertyId?._id
                    )
                    .map((lead) => (
                      <option
                        key={lead.propertyId._id}
                        value={lead.propertyId._id}
                      >
                        {lead.propertyId.title ||
                          "Property"}
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/30">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={activityForm.description}
                  onChange={(event) =>
                    setActivityForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="What happened during the interaction?"
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                />
              </div>

            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={creatingActivity}
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingActivity
                  ? "Adding..."
                  : "Add Activity"}
              </button>
            </div>
          </form>

          {/* TIMELINE */}

          <div className="mt-8">
            {activityLoading ? (
              <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black" />

                <p className="mt-4 text-sm text-black/40">
                  Loading activity timeline...
                </p>
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center">
                <p className="text-sm text-black/40">
                  No activities recorded yet.
                </p>

                <p className="mt-2 text-xs text-black/30">
                  Add the first call, meeting, site visit or note above.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-black/10" />

                <div className="space-y-7">
                  {activities.map((activity) => (
                    <article
                      key={activity._id}
                      className="relative pl-14"
                    >
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-base shadow-sm">
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="rounded-3xl border border-black/10 p-5 transition hover:border-black/20 hover:shadow-sm md:p-6">

                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-black px-3 py-1.5 text-[10px] font-medium text-white">
                                {getActivityTypeLabel(
                                  activity.type
                                )}
                              </span>

                              <span className="text-xs text-black/30">
                                {formatDateTime(
                                  activity.createdAt
                                )}
                              </span>
                            </div>

                            <h3 className="mt-3 text-base font-semibold">
                              {activity.title}
                            </h3>
                          </div>

                          {activity.createdBy?.name && (
                            <p className="text-xs text-black/30 sm:text-right">
                              By {activity.createdBy.name}
                            </p>
                          )}
                        </div>

                        {activity.description && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-black/50">
                            {activity.description}
                          </p>
                        )}

                        {activity.propertyId?.title && (
                          <div className="mt-4 rounded-2xl bg-[#f7f7f7] p-4">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                              Property
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {activity.propertyId.title}
                            </p>
                          </div>
                        )}

                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

        </section>

        {/* NEXT ACTION */}

        <section className="mt-6 rounded-[2rem] bg-black p-7 text-white md:p-10">

          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            Next action
          </p>

          <div className="mt-4 flex flex-col justify-between gap-7 md:flex-row md:items-end">

            <div>

              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Keep the conversation moving.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">

                {pendingFollowUps.length > 0
                  ? `${pendingFollowUps.length} pending follow-up${
                      pendingFollowUps.length ===
                      1
                        ? ""
                        : "s"
                    } need attention.`
                  : "There are no pending follow-ups for this customer."}

              </p>

            </div>

            <Link
              to="/admin/followups"
              className="w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Manage Follow-ups →
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CustomerDetails;