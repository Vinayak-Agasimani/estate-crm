import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import { initLenis } from "../lib/lenis";
import { getProperties } from "../services/propertyService";

gsap.registerPlugin(ScrollTrigger);

function Properties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("ALL");
  const [propertyType, setPropertyType] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [bedrooms, setBedrooms] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("ALL");

  const pageRef = useRef(null);

  /* =========================================
     LOAD PROPERTIES
  ========================================= */

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await getProperties();

        let propertyList = [];

        if (Array.isArray(response)) {
          propertyList = response;
        } else if (Array.isArray(response?.data)) {
          propertyList = response.data;
        } else if (Array.isArray(response?.properties)) {
          propertyList = response.properties;
        } else if (Array.isArray(response?.data?.properties)) {
          propertyList = response.data.properties;
        }

        const publicProperties = propertyList.filter(
          (property) =>
            property.isPublic === true &&
            property.status === "AVAILABLE"
        );

        setProperties(publicProperties);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  /* =========================================
     LENIS + GSAP
  ========================================= */

  useLayoutEffect(() => {
    const lenis = initLenis();

    const ctx = gsap.context(() => {
      gsap.from(".properties-page-header", {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".filter-panel", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".property-result-card", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".property-results-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      ScrollTrigger.refresh();
    }, pageRef);

    return () => {
      ctx.revert();
      lenis?.destroy();
    };
  }, [loading]);

  /* =========================================
     HELPERS
  ========================================= */

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "Price on request";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return price;
    }

    if (numericPrice >= 10000000) {
      return `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
    }

    if (numericPrice >= 100000) {
      return `₹${(numericPrice / 100000).toFixed(2)} L`;
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  const getImage = (property) => {
    if (
      Array.isArray(property?.images) &&
      property.images.length > 0
    ) {
      return property.images[0];
    }

    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";
  };

  const getLocation = (property) => {
    return [
      property?.locality,
      property?.city,
      property?.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  /* =========================================
     UNIQUE LOCATIONS
  ========================================= */

  const locations = useMemo(() => {
    const values = properties
      .map((property) => property.city)
      .filter(Boolean);

    return [...new Set(values)];
  }, [properties]);

  /* =========================================
     FILTER PROPERTIES
  ========================================= */

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchText = search.toLowerCase().trim();

      const searchableText = [
        property.title,
        property.description,
        property.city,
        property.locality,
        property.state,
        property.propertyType,
        property.transactionType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      const matchesTransaction =
        transactionType === "ALL" ||
        property.transactionType === transactionType;

      const matchesPropertyType =
        propertyType === "ALL" ||
        property.propertyType === propertyType;

      const matchesLocation =
        location === "ALL" ||
        property.city === location;

      const matchesBedrooms =
        bedrooms === "ALL" ||
        Number(property.bedrooms) === Number(bedrooms);

      const matchesPrice =
        maxPrice === "ALL" ||
        Number(property.price) <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesTransaction &&
        matchesPropertyType &&
        matchesLocation &&
        matchesBedrooms &&
        matchesPrice
      );
    });
  }, [
    properties,
    search,
    transactionType,
    propertyType,
    location,
    bedrooms,
    maxPrice,
  ]);

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSearch("");
    setTransactionType("ALL");
    setPropertyType("ALL");
    setLocation("ALL");
    setBedrooms("ALL");
    setMaxPrice("ALL");
  };

  const hasFilters =
    search ||
    transactionType !== "ALL" ||
    propertyType !== "ALL" ||
    location !== "ALL" ||
    bedrooms !== "ALL" ||
    maxPrice !== "ALL";

  /* =========================================
     JSX
  ========================================= */

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-black text-white"
    >
      <Navbar />

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="properties-page-header">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/40">
              Property Collection
            </p>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h1 className="max-w-5xl text-6xl font-medium leading-[0.9] tracking-tight md:text-8xl">
                  Find your
                  <br />
                  next address.
                </h1>

                <p className="mt-8 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                  Explore our collection of available properties
                  and discover a space that fits your lifestyle,
                  goals and budget.
                </p>
              </div>

              <div className="text-sm text-white/40">
                {loading
                  ? "Loading..."
                  : `${filteredProperties.length} properties`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          FILTER PANEL
      ===================================== */}

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="filter-panel rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 md:p-7">
            {/* SEARCH */}

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by property, location or keyword..."
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-white/30"
              />
            </div>

            {/* FILTERS */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* TRANSACTION */}

              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL">Buy / Rent / Lease</option>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
                <option value="LEASE">For Lease</option>
              </select>

              {/* PROPERTY TYPE */}

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL">All Property Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="HOUSE">House</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">
                  Commercial
                </option>
                <option value="OFFICE">Office</option>
                <option value="SHOP">Shop</option>
              </select>

              {/* LOCATION */}

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL">All Locations</option>

                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* BEDROOMS */}

              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>

              {/* PRICE */}

              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL">Any Budget</option>
                <option value="5000000">Under ₹50 L</option>
                <option value="10000000">Under ₹1 Cr</option>
                <option value="20000000">Under ₹2 Cr</option>
                <option value="50000000">Under ₹5 Cr</option>
              </select>
            </div>

            {/* CLEAR */}

            {hasFilters && (
              <div className="mt-5">
                <button
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
                >
                  Clear all filters ×
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================
          RESULTS
      ===================================== */}

      <section className="px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Loading properties...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 text-center">
              <p className="text-xl text-white/70">
                No properties match your search.
              </p>

              <p className="mt-3 text-sm text-white/40">
                Try changing your filters or search terms.
              </p>

              <button
                onClick={clearFilters}
                className="mt-7 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:bg-white hover:text-black"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-white/40">
                  Showing{" "}
                  <span className="text-white/80">
                    {filteredProperties.length}
                  </span>{" "}
                  properties
                </p>
              </div>

              <div className="property-results-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                  <article
                    key={property._id}
                    className="property-result-card group cursor-pointer"
                    onClick={() =>
                      navigate(`/property/${property._id}`)
                    }
                  >
                    {/* IMAGE */}

                    <div className="relative overflow-hidden rounded-3xl bg-white/5">
                      <img
                        src={getImage(property)}
                        alt={property.title || "Property"}
                        className="h-[400px] w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* TYPE */}

                      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                        {property.propertyType}
                      </div>

                      {/* ARROW */}

                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition duration-500 group-hover:bg-white group-hover:text-black">
                        ↗
                      </div>

                      {/* INFO */}

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="mb-2 text-xs text-white/50">
                          {getLocation(property)}
                        </p>

                        <h2 className="text-2xl font-medium leading-tight">
                          {property.title}
                        </h2>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-medium">
                            {formatPrice(property.price)}
                          </span>

                          <span className="text-xs uppercase tracking-[0.15em] text-white/40">
                            {property.transactionType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="flex gap-5 px-2 pt-4 text-xs text-white/40">
                      {property.area && (
                        <span>{property.area} sq.ft</span>
                      )}

                      {property.bedrooms !== undefined &&
                        property.bedrooms !== null && (
                          <span>
                            {property.bedrooms} Bed
                          </span>
                        )}

                      {property.bathrooms !== undefined &&
                        property.bathrooms !== null && (
                          <span>
                            {property.bathrooms} Bath
                          </span>
                        )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="border-t border-white/10 bg-[#0d0d0d] px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Need help?
          </p>

          <h2 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Can't find what
            <br />
            you're looking for?
          </h2>

          <p className="mt-8 max-w-xl text-white/50">
            Tell us what you need and we'll help you find a
            property that matches your requirements.
          </p>

          <a
            href="mailto:hello@estatecrm.com"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-105"
          >
            Contact us →
          </a>
        </div>
      </section>
    </div>
  );
}

export default Properties;