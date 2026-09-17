import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  propertyType: "APARTMENT",
  transactionType: "SALE",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  parking: "0",
  furnishing: "UNFURNISHED",
  facing: "",
  amenities: "",
  address: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  mapUrl: "",
  images: "",
  status: "AVAILABLE",
  isPublic: false,
  ownerId: "",
};

const propertyTypes = [
  "APARTMENT",
  "VILLA",
  "HOUSE",
  "PLOT",
  "COMMERCIAL",
  "OFFICE",
  "SHOP",
  "OTHER",
];

const transactionTypes = [
  "SALE",
  "RENT",
  "LEASE",
];

const furnishingTypes = [
  "FURNISHED",
  "SEMI_FURNISHED",
  "UNFURNISHED",
];

const statusOptions = [
  "AVAILABLE",
  "UNDER_DISCUSSION",
  "BOOKED",
  "SOLD",
  "RENTED",
  "ARCHIVED",
];

function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [formData, setFormData] =
    useState(initialForm);

  const [showOwnerForm, setShowOwnerForm] =
    useState(false);

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // -----------------------------------------
  // LOAD DATA
  // -----------------------------------------

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        propertiesResponse,
        ownersResponse,
      ] = await Promise.all([
        api.get("/properties"),
        api.get("/owners"),
      ]);

      const propertyList =
        propertiesResponse?.data?.data ||
        propertiesResponse?.data?.properties ||
        propertiesResponse?.data ||
        [];

      const ownerList =
        ownersResponse?.data?.data ||
        ownersResponse?.data?.owners ||
        ownersResponse?.data ||
        [];

      setProperties(
        Array.isArray(propertyList)
          ? propertyList
          : []
      );

      setOwners(
        Array.isArray(ownerList)
          ? ownerList
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load property data:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------------------
  // FORM
  // -----------------------------------------

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (property) => {
    setEditingId(property._id);

    setFormData({
      title: property.title || "",
      description: property.description || "",
      propertyType:
        property.propertyType || "APARTMENT",
      transactionType:
        property.transactionType || "SALE",
      price:
        property.price !== undefined
          ? String(property.price)
          : "",
      area:
        property.area !== undefined
          ? String(property.area)
          : "",
      bedrooms:
        property.bedrooms !== undefined
          ? String(property.bedrooms)
          : "",
      bathrooms:
        property.bathrooms !== undefined
          ? String(property.bathrooms)
          : "",
      parking:
        property.parking !== undefined
          ? String(property.parking)
          : "0",
      furnishing:
        property.furnishing ||
        "UNFURNISHED",
      facing: property.facing || "",
      amenities: Array.isArray(
        property.amenities
      )
        ? property.amenities.join(", ")
        : "",
      address: property.address || "",
      locality: property.locality || "",
      city: property.city || "",
      state: property.state || "",
      pincode: property.pincode || "",
      latitude:
        property.location?.coordinates?.[1] !==
        undefined
          ? String(
              property.location.coordinates[1]
            )
          : "",
      longitude:
        property.location?.coordinates?.[0] !==
        undefined
          ? String(
              property.location.coordinates[0]
            )
          : "",
      mapUrl: property.mapUrl || "",
      images: Array.isArray(property.images)
        ? property.images.join("\n")
        : "",
      status:
        property.status || "AVAILABLE",
      isPublic:
        property.isPublic === true,
      ownerId:
        typeof property.ownerId === "object"
          ? property.ownerId?._id || ""
          : property.ownerId || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // -----------------------------------------
  // CREATE / UPDATE PROPERTY
  // -----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Property title is required.");
      return;
    }

    if (!formData.price) {
      setError("Property price is required.");
      return;
    }

    if (!formData.ownerId) {
      setError("Please select a property owner.");
      return;
    }

    try {
      setSaving(true);

      const amenities = formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const images = formData.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const latitude =
        formData.latitude.trim() !== ""
          ? Number(formData.latitude)
          : null;

      const longitude =
        formData.longitude.trim() !== ""
          ? Number(formData.longitude)
          : null;

      const payload = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        propertyType:
          formData.propertyType,

        transactionType:
          formData.transactionType,

        price: Number(formData.price),

        area: formData.area
          ? Number(formData.area)
          : undefined,

        bedrooms: formData.bedrooms
          ? Number(formData.bedrooms)
          : undefined,

        bathrooms: formData.bathrooms
          ? Number(formData.bathrooms)
          : undefined,

        parking: formData.parking
          ? Number(formData.parking)
          : 0,

        furnishing:
          formData.furnishing,

        facing:
          formData.facing.trim(),

        amenities,

        address:
          formData.address.trim(),

        locality:
          formData.locality.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        pincode:
          formData.pincode.trim(),

        mapUrl:
          formData.mapUrl.trim(),

        images,

        status: formData.status,

        /*
         * A SOLD property must never remain
         * publicly visible.
         */
        isPublic:
          formData.status === "SOLD"
            ? false
            : formData.isPublic,

        ownerId:
          formData.ownerId,
      };

      if (
        latitude !== null &&
        longitude !== null &&
        !Number.isNaN(latitude) &&
        !Number.isNaN(longitude)
      ) {
        payload.location = {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        };
      }

      let response;

      if (editingId) {
        response = await api.put(
          `/properties/${editingId}`,
          payload
        );
      } else {
        response = await api.post(
          "/properties",
          payload
        );
      }

      const savedProperty =
        response?.data?.data ||
        response?.data?.property ||
        response?.data;

      if (editingId) {
        setProperties((current) =>
          current.map((property) =>
            property._id === editingId
              ? savedProperty
              : property
          )
        );

        setSuccess(
          "Property updated successfully."
        );
      } else {
        setProperties((current) => [
          savedProperty,
          ...current,
        ]);

        setSuccess(
          "Property created successfully."
        );
      }

      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialForm);
        setSuccess("");
      }, 900);
    } catch (error) {
      console.error(
        "Failed to save property:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to save property."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // CREATE OWNER
  // -----------------------------------------

  const handleOwnerChange = (event) => {
    const { name, value } = event.target;

    setOwnerForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createOwner = async (event) => {
    event.preventDefault();

    if (!ownerForm.name.trim()) {
      setError("Owner name is required.");
      return;
    }

    if (!ownerForm.phone.trim()) {
      setError(
        "Owner phone number is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await api.post(
        "/owners",
        {
          name: ownerForm.name.trim(),
          phone: ownerForm.phone.trim(),
          email:
            ownerForm.email.trim(),
          address:
            ownerForm.address.trim(),
          notes:
            ownerForm.notes.trim(),
        }
      );

      const newOwner =
        response?.data?.data ||
        response?.data?.owner ||
        response?.data;

      setOwners((current) => [
        newOwner,
        ...current,
      ]);

      setFormData((current) => ({
        ...current,
        ownerId: newOwner._id,
      }));

      setOwnerForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });

      setShowOwnerForm(false);

      setSuccess(
        "Owner created successfully."
      );
    } catch (error) {
      console.error(
        "Failed to create owner:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to create owner."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // FILTERING
  // -----------------------------------------

  const filteredProperties = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !query ||
        property.title
          ?.toLowerCase()
          .includes(query) ||
        property.city
          ?.toLowerCase()
          .includes(query) ||
        property.locality
          ?.toLowerCase()
          .includes(query) ||
        property.propertyType
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        property.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    properties,
    search,
    statusFilter,
  ]);

  // -----------------------------------------
  // HELPERS
  // -----------------------------------------

  const getOwnerName = (property) => {
    if (
      property.ownerId &&
      typeof property.ownerId ===
        "object"
    ) {
      return (
        property.ownerId.name ||
        "Unknown owner"
      );
    }

    const owner = owners.find(
      (item) =>
        item._id === property.ownerId
    );

    return owner?.name || "Unknown owner";
  };

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "Price not set";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "border-green-200 bg-green-50 text-green-700";

      case "UNDER_DISCUSSION":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "BOOKED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "SOLD":
        return "border-red-200 bg-red-50 text-red-700";

      case "RENTED":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "ARCHIVED":
        return "border-gray-200 bg-gray-50 text-gray-500";

      default:
        return "border-black/10 bg-white text-black/50";
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

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
              Property Management
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

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        {/* TITLE */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Inventory
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Properties
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Add, edit, publish and manage every
              property in the dealer's inventory.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="w-fit rounded-full bg-black px-6 py-3 text-sm text-white transition hover:scale-[1.02]"
          >
            + Add Property
          </button>
        </div>

        {/* STATS */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Total
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {properties.length}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Available
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {
                properties.filter(
                  (item) =>
                    item.status ===
                    "AVAILABLE"
                ).length
              }
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Published
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {
                properties.filter(
                  (item) =>
                    item.isPublic === true
                ).length
              }
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Sold
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {
                properties.filter(
                  (item) =>
                    item.status === "SOLD"
                ).length
              }
            </p>
          </div>
        </section>

        {/* SEARCH */}

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search title, city, locality or property type..."
              className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-5 py-4 text-sm outline-none transition focus:border-black/30"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-2xl border border-black/10 bg-[#fafafa] px-5 py-4 text-sm outline-none focus:border-black/30 lg:w-64"
            >
              <option value="ALL">
                All statuses
              </option>

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
        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* PROPERTY FORM */}

        {showForm && (
          <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  {editingId
                    ? "Edit listing"
                    : "New listing"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {editingId
                    ? "Update property"
                    : "Add property"}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:bg-black hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-8"
            >
              {/* BASIC */}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                  Basic information
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-black/40">
                      Property title
                    </label>

                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Luxury 3BHK Apartment in Belagavi"
                      required
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Property type
                    </label>

                    <select
                      name="propertyType"
                      value={
                        formData.propertyType
                      }
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    >
                      {propertyTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Transaction
                    </label>

                    <select
                      name="transactionType"
                      value={
                        formData.transactionType
                      }
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    >
                      {transactionTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-black/40">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the property..."
                      className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>
                </div>
              </div>

              {/* DETAILS */}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                  Property details
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Price ₹
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="6500000"
                      min="0"
                      required
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Area
                    </label>

                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="1450"
                      min="0"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Bedrooms
                    </label>

                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="3"
                      min="0"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Bathrooms
                    </label>

                    <input
                      type="number"
                      name="bathrooms"
                      value={
                        formData.bathrooms
                      }
                      onChange={handleChange}
                      placeholder="2"
                      min="0"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Parking
                    </label>

                    <input
                      type="number"
                      name="parking"
                      value={formData.parking}
                      onChange={handleChange}
                      min="0"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Furnishing
                    </label>

                    <select
                      name="furnishing"
                      value={
                        formData.furnishing
                      }
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    >
                      {furnishingTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Facing
                    </label>

                    <input
                      name="facing"
                      value={formData.facing}
                      onChange={handleChange}
                      placeholder="East"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/40">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
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
                </div>
              </div>

              {/* OWNER */}

              <div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                      Owner
                    </p>

                    <p className="mt-1 text-sm text-black/40">
                      The actual property owner
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowOwnerForm(
                        !showOwnerForm
                      )
                    }
                    className="w-fit rounded-full border border-black/10 px-5 py-2.5 text-xs transition hover:bg-black hover:text-white"
                  >
                    + New Owner
                  </button>
                </div>

                <div className="mt-4">
                  <select
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  >
                    <option value="">
                      Select property owner
                    </option>

                    {owners.map((owner) => (
                      <option
                        key={owner._id}
                        value={owner._id}
                      >
                        {owner.name} —{" "}
                        {owner.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {showOwnerForm && (
                  <div className="mt-5 rounded-3xl border border-black/10 bg-[#fafafa] p-5">
                    <h3 className="text-lg font-semibold">
                      Add owner
                    </h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <input
                        name="name"
                        value={ownerForm.name}
                        onChange={
                          handleOwnerChange
                        }
                        placeholder="Owner name"
                        required
                        className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black/30"
                      />

                      <input
                        name="phone"
                        value={ownerForm.phone}
                        onChange={
                          handleOwnerChange
                        }
                        placeholder="Phone number"
                        required
                        className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black/30"
                      />

                      <input
                        type="email"
                        name="email"
                        value={ownerForm.email}
                        onChange={
                          handleOwnerChange
                        }
                        placeholder="Email"
                        className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black/30"
                      />

                      <input
                        name="address"
                        value={
                          ownerForm.address
                        }
                        onChange={
                          handleOwnerChange
                        }
                        placeholder="Owner address"
                        className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black/30"
                      />

                      <textarea
                        name="notes"
                        value={ownerForm.notes}
                        onChange={
                          handleOwnerChange
                        }
                        placeholder="Owner notes"
                        rows={3}
                        className="resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black/30 md:col-span-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={createOwner}
                      disabled={saving}
                      className="mt-4 rounded-full bg-black px-6 py-3 text-sm text-white disabled:opacity-50"
                    >
                      {saving
                        ? "Creating..."
                        : "Create Owner"}
                    </button>
                  </div>
                )}
              </div>

              {/* LOCATION */}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                  Location
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30 md:col-span-2"
                  />

                  <input
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    placeholder="Locality / Area"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <input
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    placeholder="Google Maps URL"
                    className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30 md:col-span-2"
                  />
                </div>
              </div>

              {/* MEDIA */}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                  Media
                </p>

                <div className="mt-4">
                  <label className="mb-2 block text-xs text-black/40">
                    Image URLs
                  </label>

                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    rows={5}
                    placeholder={`Paste one image URL per line\nhttps://example.com/property-1.jpg\nhttps://example.com/property-2.jpg`}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <p className="mt-2 text-xs text-black/30">
                    For now, use image URLs. Cloud
                    image uploads will be added later.
                  </p>
                </div>
              </div>

              {/* AMENITIES */}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                  Features
                </p>

                <div className="mt-4">
                  <label className="mb-2 block text-xs text-black/40">
                    Amenities
                  </label>

                  <input
                    name="amenities"
                    value={
                      formData.amenities
                    }
                    onChange={handleChange}
                    placeholder="Swimming Pool, Gym, Garden, Security"
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm outline-none focus:border-black/30"
                  />

                  <p className="mt-2 text-xs text-black/30">
                    Separate amenities using commas.
                  </p>
                </div>
              </div>

              {/* PUBLISH */}

              <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-5">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    disabled={
                      formData.status === "SOLD"
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Publish on public website
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/40">
                      When enabled, this property can
                      appear on the public property
                      listing.
                    </p>

                    {formData.status ===
                      "SOLD" && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        Sold properties are always
                        hidden from the public website.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* FORM MESSAGES */}

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

              <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Property"
                    : "Create Property"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-full border border-black/10 px-8 py-3.5 text-sm transition hover:bg-black hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PROPERTY LIST */}

        <section className="mt-8">
          {loading ? (
            <div className="rounded-3xl border border-black/10 bg-white p-14 text-center">
              <p className="text-sm text-black/40">
                Loading properties...
              </p>
            </div>
          ) : filteredProperties.length ===
            0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
                ⌂
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No properties found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
                Add your first property to start
                building the dealer's inventory.
              </p>

              <button
                onClick={openCreateForm}
                className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
              >
                + Add Property
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredProperties.map(
                (property) => {
                  const image =
                    property.images?.[0];

                  return (
                    <article
                      key={property._id}
                      className="overflow-hidden rounded-3xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-[16/9] overflow-hidden bg-black">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              property.title
                            }
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-white/30">
                            No image
                          </div>
                        )}

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase backdrop-blur ${getStatusClasses(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>

                          {property.isPublic &&
                            property.status !==
                              "SOLD" && (
                              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-black">
                                PUBLIC
                              </span>
                            )}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-black/30">
                              {
                                property.propertyType
                              }{" "}
                              •{" "}
                              {
                                property.transactionType
                              }
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                              {
                                property.title
                              }
                            </h2>
                          </div>

                          <p className="whitespace-nowrap text-sm font-semibold">
                            {formatPrice(
                              property.price
                            )}
                          </p>
                        </div>

                        <p className="mt-3 text-sm text-black/40">
                          {property.locality
                            ? `${property.locality}, `
                            : ""}
                          {property.city ||
                            "Location not set"}
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <div className="rounded-2xl bg-[#f7f7f7] p-3">
                            <p className="text-[10px] uppercase text-black/30">
                              Area
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {property.area
                                ? `${property.area}`
                                : "—"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[#f7f7f7] p-3">
                            <p className="text-[10px] uppercase text-black/30">
                              Beds
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {
                                property.bedrooms ??
                                  "—"
                              }
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[#f7f7f7] p-3">
                            <p className="text-[10px] uppercase text-black/30">
                              Baths
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {
                                property.bathrooms ??
                                  "—"
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-5">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">
                              Owner
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {getOwnerName(
                                property
                              )}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              openEditForm(
                                property
                              )
                            }
                            className="rounded-full border border-black/10 px-5 py-2.5 text-xs transition hover:bg-black hover:text-white"
                          >
                            Edit Property
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageProperties;