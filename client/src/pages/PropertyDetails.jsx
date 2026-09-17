import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import { initLenis } from "../lib/lenis";

import {
  getProperties,
  getPropertyById,
} from "../services/propertyService";

import { submitPropertyEnquiry } from "../services/enquiryService";

gsap.registerPlugin(ScrollTrigger);

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Enquiry State
  |--------------------------------------------------------------------------
  */

  const [enquiry, setEnquiry] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submittingEnquiry, setSubmittingEnquiry] =
    useState(false);

  const [enquirySuccess, setEnquirySuccess] =
    useState(false);

  const [enquiryError, setEnquiryError] =
    useState("");

  const pageRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Load Property
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await getPropertyById(id);

        const propertyData =
          response?.data || response;

        setProperty(propertyData);

        /*
        |--------------------------------------------------------------------------
        | Load Similar Properties
        |--------------------------------------------------------------------------
        */

        try {
          const propertiesResponse =
            await getProperties();

          let propertyList = [];

          if (Array.isArray(propertiesResponse)) {
            propertyList = propertiesResponse;
          } else if (
            Array.isArray(propertiesResponse?.data)
          ) {
            propertyList = propertiesResponse.data;
          } else if (
            Array.isArray(
              propertiesResponse?.properties
            )
          ) {
            propertyList =
              propertiesResponse.properties;
          }

          const similar = propertyList
            .filter(
              (item) =>
                item._id !== id &&
                item.isPublic === true &&
                item.status === "AVAILABLE" &&
                item.propertyType ===
                  propertyData?.propertyType
            )
            .slice(0, 3);

          setSimilarProperties(similar);
        } catch (error) {
          console.error(
            "Failed to load similar properties:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Failed to load property details:",
          error
        );

        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | GSAP + Lenis
  |--------------------------------------------------------------------------
  */

  useLayoutEffect(() => {
    if (loading || !property) return;

    const lenis = initLenis();

    const ctx = gsap.context(() => {
      gsap.from(".details-hero", {
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".details-content", {
        y: 70,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".spec-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".amenity-item", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".amenities-section",
          start: "top 80%",
        },
      });

      gsap.from(".similar-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".similar-section",
          start: "top 80%",
        },
      });
    }, pageRef);

    return () => {
      ctx.revert();
      lenis?.destroy();
    };
  }, [loading, property]);

  /*
  |--------------------------------------------------------------------------
  | Enquiry Form
  |--------------------------------------------------------------------------
  */

  const handleEnquiryChange = (event) => {
    const { name, value } = event.target;

    setEnquiry((current) => ({
      ...current,
      [name]: value,
    }));

    setEnquiryError("");
    setEnquirySuccess(false);
  };

  const handleEnquirySubmit = async (event) => {
    event.preventDefault();

    if (!enquiry.name.trim()) {
      setEnquiryError("Please enter your name.");
      return;
    }

    if (!enquiry.phone.trim()) {
      setEnquiryError(
        "Please enter your phone number."
      );
      return;
    }

    setSubmittingEnquiry(true);
    setEnquirySuccess(false);
    setEnquiryError("");

    try {
      await submitPropertyEnquiry({
        propertyId: property._id,
        name: enquiry.name.trim(),
        phone: enquiry.phone.trim(),
        email: enquiry.email.trim(),
        message: enquiry.message.trim(),
      });

      setEnquirySuccess(true);

      setEnquiry({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Enquiry submission failed:",
        error
      );

      setEnquiryError(
        error?.response?.data?.message ||
          "Unable to submit enquiry. Please try again."
      );
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "Price on request";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return price;
    }

    if (numericPrice >= 10000000) {
      return `₹${(
        numericPrice / 10000000
      ).toFixed(2)} Cr`;
    }

    if (numericPrice >= 100000) {
      return `₹${(
        numericPrice / 100000
      ).toFixed(2)} L`;
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  const getImages = () => {
    if (
      Array.isArray(property?.images) &&
      property.images.length > 0
    ) {
      return property.images;
    }

    return [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
    ];
  };

  const getLocation = () => {
    return [
      property?.locality,
      property?.city,
      property?.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const images = getImages();

  /*
  |--------------------------------------------------------------------------
  | Image Navigation
  |--------------------------------------------------------------------------
  */

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  /*
  |--------------------------------------------------------------------------
  | WhatsApp
  |--------------------------------------------------------------------------
  */

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the property "${property?.title}". Please share more details.`
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          Loading property...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          Property
        </p>

        <h1 className="mt-5 text-4xl font-medium">
          Property not found
        </h1>

        <button
          onClick={() => navigate("/properties")}
          className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
        >
          Browse properties
        </button>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-black text-white"
    >
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="details-hero relative h-[75vh] min-h-[600px] overflow-hidden">
        <img
          src={images[activeImage]}
          alt={property.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* BACK */}

        <button
          onClick={() => navigate("/properties")}
          className="absolute left-6 top-28 z-10 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-sm backdrop-blur-md transition hover:bg-white hover:text-black md:left-10"
        >
          ← Properties
        </button>

        {/* IMAGE COUNTER */}

        <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3 md:right-10">
          <button
            onClick={previousImage}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            ←
          </button>

          <span className="min-w-[70px] text-center text-sm text-white/80">
            {activeImage + 1} / {images.length}
          </span>

          <button
            onClick={nextImage}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            →
          </button>
        </div>

        {/* GALLERY */}

        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-8 left-6 z-10 rounded-full border border-white/20 bg-black/30 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white hover:text-black md:left-10"
        >
          View gallery
        </button>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="details-content px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12">

            {/* LEFT */}

            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                {property.propertyType}
              </p>

              <h1 className="mt-5 max-w-5xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                {property.title}
              </h1>

              <p className="mt-6 text-base text-white/50">
                📍{" "}
                {getLocation() || "Prime Location"}
              </p>

              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-y border-white/10 py-7">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Price
                  </p>

                  <p className="mt-2 text-3xl font-medium md:text-4xl">
                    {formatPrice(property.price)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Transaction
                  </p>

                  <p className="mt-2 text-sm">
                    {property.transactionType}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  About this property
                </p>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
                  {property.description ||
                    "A thoughtfully designed property offering comfort, convenience and an excellent location."}
                </p>
              </div>
            </div>

            {/* =================================================
                RIGHT CTA + ENQUIRY
            ================================================= */}

            <div className="lg:col-span-4">
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#0d0d0d] p-7 md:p-8">

                <p className="text-lg font-medium">
                  Interested in this property?
                </p>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  Speak with our property advisor to
                  schedule a visit or get more
                  information.
                </p>

                {/* CALL + WHATSAPP */}

                <div className="mt-8 space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="block rounded-full bg-white px-6 py-4 text-center text-sm font-medium text-black transition hover:scale-[1.02]"
                  >
                    Call Property Advisor
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-full border border-white/20 px-6 py-4 text-center text-sm transition hover:bg-white hover:text-black"
                  >
                    WhatsApp Enquiry
                  </a>
                </div>

                {/* =================================================
                    ENQUIRY FORM
                ================================================= */}

                <div className="mt-8 border-t border-white/10 pt-8">
                  <p className="text-sm font-medium">
                    Send an enquiry
                  </p>

                  <form
                    onSubmit={handleEnquirySubmit}
                    className="mt-5 space-y-4"
                  >
                    <input
                      type="text"
                      name="name"
                      value={enquiry.name}
                      onChange={handleEnquiryChange}
                      placeholder="Your name"
                      required
                      maxLength={100}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={enquiry.phone}
                      onChange={handleEnquiryChange}
                      placeholder="Phone number"
                      required
                      maxLength={20}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                    />

                    <input
                      type="email"
                      name="email"
                      value={enquiry.email}
                      onChange={handleEnquiryChange}
                      placeholder="Email address (optional)"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                    />

                    <textarea
                      name="message"
                      value={enquiry.message}
                      onChange={handleEnquiryChange}
                      placeholder="I'm interested in this property..."
                      rows={4}
                      maxLength={1000}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                    />

                    {enquiryError && (
                      <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                        {enquiryError}
                      </p>
                    )}

                    {enquirySuccess && (
                      <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-xs text-green-300">
                        Enquiry submitted successfully.
                        Our property advisor will contact
                        you soon.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingEnquiry}
                      className="w-full rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submittingEnquiry
                        ? "Submitting..."
                        : "Submit Enquiry"}
                    </button>
                  </form>
                </div>

                <p className="mt-6 text-center text-[11px] text-white/25">
                  Property ID: {property._id}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SPECIFICATIONS
          ================================================= */}

          <div className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {property.area && (
              <div className="spec-card rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40">
                  Area
                </p>

                <p className="mt-3 text-lg font-medium">
                  {property.area}
                </p>

                <p className="text-xs text-white/30">
                  sq.ft
                </p>
              </div>
            )}

            {property.bedrooms !== undefined &&
              property.bedrooms !== null && (
                <div className="spec-card rounded-2xl border border-white/10 p-5">
                  <p className="text-xs text-white/40">
                    Bedrooms
                  </p>

                  <p className="mt-3 text-lg font-medium">
                    {property.bedrooms}
                  </p>

                  <p className="text-xs text-white/30">
                    Rooms
                  </p>
                </div>
              )}

            {property.bathrooms !== undefined &&
              property.bathrooms !== null && (
                <div className="spec-card rounded-2xl border border-white/10 p-5">
                  <p className="text-xs text-white/40">
                    Bathrooms
                  </p>

                  <p className="mt-3 text-lg font-medium">
                    {property.bathrooms}
                  </p>

                  <p className="text-xs text-white/30">
                    Rooms
                  </p>
                </div>
              )}

            {property.parking !== undefined &&
              property.parking !== null && (
                <div className="spec-card rounded-2xl border border-white/10 p-5">
                  <p className="text-xs text-white/40">
                    Parking
                  </p>

                  <p className="mt-3 text-lg font-medium">
                    {property.parking}
                  </p>

                  <p className="text-xs text-white/30">
                    Spaces
                  </p>
                </div>
              )}

            {property.facing && (
              <div className="spec-card rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40">
                  Facing
                </p>

                <p className="mt-3 text-lg font-medium">
                  {property.facing}
                </p>
              </div>
            )}

            {property.furnishing && (
              <div className="spec-card rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40">
                  Furnishing
                </p>

                <p className="mt-3 text-sm font-medium">
                  {property.furnishing.replace(
                    "_",
                    " "
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
      ===================================================== */}

      {images.length > 1 && (
        <section className="bg-[#0d0d0d] px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">

            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Property Gallery
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => {
                    setActiveImage(index);
                    setLightboxOpen(true);
                  }}
                  className="group relative overflow-hidden rounded-3xl text-left"
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="h-[350px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[450px]"
                  />

                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                  <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs backdrop-blur-md">
                    Image {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          AMENITIES
      ===================================================== */}

      {Array.isArray(property.amenities) &&
        property.amenities.length > 0 && (
          <section className="amenities-section bg-black px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-7xl">

              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Amenities
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {property.amenities.map(
                  (amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="amenity-item rounded-2xl border border-white/10 px-5 py-5 text-sm text-white/70 transition hover:border-white/30 hover:bg-white/5"
                    >
                      <span className="mr-3 text-white/30">
                        +
                      </span>

                      {amenity}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <section className="bg-[#0d0d0d] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Location
          </p>

          <h2 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
            {getLocation() || "Prime Location"}
          </h2>

          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black">
            {property.mapUrl ? (
              <iframe
                src={property.mapUrl}
                title="Property location"
                className="h-[450px] w-full border-0 grayscale"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[350px] items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl">
                    📍
                  </p>

                  <p className="mt-4 text-white/60">
                    {property.address ||
                      getLocation() ||
                      "Location details available on request"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          SIMILAR PROPERTIES
      ===================================================== */}

      {similarProperties.length > 0 && (
        <section className="similar-section bg-black px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">

            <div className="flex items-end justify-between gap-6">
              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  You may also like
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
                  Similar properties.
                </h2>
              </div>

              <button
                onClick={() => navigate("/properties")}
                className="hidden rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:bg-white hover:text-black md:block"
              >
                View all
              </button>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {similarProperties.map((item) => (
                <article
                  key={item._id}
                  className="similar-card group cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/property/${item._id}`
                    )
                  }
                >
                  <div className="relative overflow-hidden rounded-3xl">

                    <img
                      src={
                        Array.isArray(item.images) &&
                        item.images.length > 0
                          ? item.images[0]
                          : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
                      }
                      alt={item.title}
                      className="h-[380px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5">

                      <p className="text-xs text-white/50">
                        {[
                          item.locality,
                          item.city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <h3 className="mt-2 text-xl font-medium">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="border-t border-white/10 bg-white px-6 py-24 text-black md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            Interested?
          </p>

          <h2 className="mt-5 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Let's make this
            <br />
            your next address.
          </h2>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">

            <a
              href="tel:+919876543210"
              className="rounded-full bg-black px-7 py-4 text-center text-sm font-medium text-white transition hover:scale-105"
            >
              Call us
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/20 px-7 py-4 text-center text-sm transition hover:bg-black hover:text-white"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5">

          {/* CLOSE */}

          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white transition hover:bg-white hover:text-black"
            aria-label="Close gallery"
          >
            ×
          </button>

          {/* PREVIOUS */}

          {images.length > 1 && (
            <button
              onClick={previousImage}
              className="absolute left-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white transition hover:bg-white hover:text-black"
              aria-label="Previous image"
            >
              ←
            </button>
          )}

          {/* IMAGE */}

          <div className="flex h-full w-full items-center justify-center">
            <img
              src={images[activeImage]}
              alt={property.title}
              className="max-h-[90vh] max-w-[92vw] object-contain"
            />
          </div>

          {/* NEXT */}

          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white transition hover:bg-white hover:text-black"
              aria-label="Next image"
            >
              →
            </button>
          )}

          {/* COUNTER */}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs text-white/70 backdrop-blur-md">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;