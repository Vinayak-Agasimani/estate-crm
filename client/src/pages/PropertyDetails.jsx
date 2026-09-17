import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";

import Navbar from "../components/Navbar";
import { getPropertyById } from "../services/propertyService";
import { initLenis } from "../lib/lenis";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageRef = useRef(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await getPropertyById(id);

        if (response.success) {
          setProperty(response.data);
        } else {
          setError("Property not found.");
        }
      } catch (err) {
        console.error("Failed to load property:", err);
        setError("Unable to load property.");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  useLayoutEffect(() => {
    if (!property) return;

    const lenis = initLenis();

    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 1.15,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(".property-content", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, [property]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-4xl font-medium">
          Property not found
        </h1>

        <p className="mt-4 text-white/50">
          The property you're looking for may no longer be available.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
        >
          Back to Home
        </button>
      </main>
    );
  }

  const image =
    property.images?.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90";

  return (
    <main className="overflow-x-hidden bg-black text-white">

      <Navbar />

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">

        <img
          ref={imageRef}
          src={image}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        <div className="property-content absolute bottom-0 left-0 right-0 z-10 mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-20">

          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/60">
            {property.propertyType}
          </p>

          <h1 className="max-w-5xl text-5xl font-medium leading-[0.9] tracking-tight sm:text-6xl md:text-8xl">
            {property.title}
          </h1>

          <p className="mt-6 text-base text-white/60 md:text-lg">
            {[property.locality, property.city, property.state]
              .filter(Boolean)
              .join(" · ")}
          </p>

        </div>
      </section>

      {/* DETAILS */}
      <section className="bg-white px-6 py-24 text-black md:px-10 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-3">

            {/* Price */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Price
              </p>

              <p className="mt-4 text-4xl font-medium">
                ₹{property.price?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Type */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Transaction
              </p>

              <p className="mt-4 text-2xl font-medium">
                {property.transactionType}
              </p>
            </div>

            {/* Area */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Area
              </p>

              <p className="mt-4 text-2xl font-medium">
                {property.area
                  ? `${property.area.toLocaleString("en-IN")} sq.ft`
                  : "Not specified"}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-24 max-w-4xl">

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              About this property
            </p>

            <p className="mt-8 text-2xl leading-relaxed text-black/70 md:text-4xl">
              {property.description ||
                "Detailed information about this property will be available soon."}
            </p>

          </div>

          {/* Property specifications */}
          <div className="mt-24 grid gap-8 border-t border-black/10 pt-10 sm:grid-cols-2 md:grid-cols-4">

            <div>
              <p className="text-xs uppercase tracking-wider text-black/40">
                Bedrooms
              </p>

              <p className="mt-2 text-xl">
                {property.bedrooms || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-black/40">
                Bathrooms
              </p>

              <p className="mt-2 text-xl">
                {property.bathrooms || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-black/40">
                Parking
              </p>

              <p className="mt-2 text-xl">
                {property.parking ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-black/40">
                Facing
              </p>

              <p className="mt-2 text-xl">
                {property.facing || "—"}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-center">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Interested in this property?
          </p>

          <h2 className="mt-6 text-5xl font-medium md:text-8xl">
            Let's talk.
          </h2>

          <button
            onClick={() => navigate("/")}
            className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition duration-300 hover:scale-105"
          >
            Explore more properties
          </button>

        </div>

      </section>

    </main>
  );
}

export default PropertyDetails;