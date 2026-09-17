import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import Counter from "../components/Counter";
import { initLenis } from "../lib/lenis";
import { getProperties } from "../services/propertyService";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  /* =========================================
     LOAD PUBLIC PROPERTIES
  ========================================= */

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();

        console.log("Properties API response:", data);

        let propertyList = [];

        if (Array.isArray(data)) {
        propertyList = data;
        } else if (Array.isArray(data?.properties)) {
        propertyList = data.properties;
        } else if (Array.isArray(data?.data)) {
        propertyList = data.data;
        } else if (Array.isArray(data?.data?.properties)) {
        propertyList = data.data.properties;
        }

        console.log("Property list:", propertyList);

        const publicProperties = propertyList.filter(
        (property) =>
            property.isPublic === true &&
            property.status === "AVAILABLE"
        );

        console.log("Public available properties:", publicProperties);

        setProperties(publicProperties);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, []);

  /* =========================================
     LENIS + GSAP SCROLL ANIMATIONS
  ========================================= */

  useLayoutEffect(() => {
    const lenis = initLenis();

    const ctx = gsap.context(() => {
      /* -------------------------------------
         HERO IMAGE PARALLAX
      ------------------------------------- */

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 1.18,
            yPercent: 12,
          },
          {
            scale: 1,
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      /* -------------------------------------
         HERO CONTENT PARALLAX
      ------------------------------------- */

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: -140,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "70% top",
              scrub: true,
            },
          }
        );
      }

      /* -------------------------------------
         PROPERTY CARD REVEAL
      ------------------------------------- */

      gsap.from(".property-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".properties-grid",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      /* -------------------------------------
         PROPERTY IMAGE REVEAL
      ------------------------------------- */

      gsap.utils.toArray(".property-image").forEach((image) => {
        gsap.fromTo(
          image,
          {
            scale: 1.2,
          },
          {
            scale: 1,
            ease: "power2.out",
            duration: 1.4,

            scrollTrigger: {
              trigger: image,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /* -------------------------------------
         EXPERIENCE SECTION
      ------------------------------------- */

      gsap.from(".experience-content", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* -------------------------------------
         STATISTICS CARDS
      ------------------------------------- */

      gsap.from(".stats-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* -------------------------------------
         SERVICES
      ------------------------------------- */

      gsap.from(".service-card", {
        y: 80,
        opacity: 0,
        stagger: 0.18,
        duration: 1.1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* -------------------------------------
         SECTION HEADINGS
      ------------------------------------- */

      gsap.utils.toArray(".section-heading").forEach((heading) => {
        gsap.from(heading, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* -------------------------------------
         CTA
      ------------------------------------- */

      gsap.from(".cta-content", {
        y: 70,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      ScrollTrigger.refresh();
    }, heroRef);

    return () => {
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

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

  const getPropertyImage = (property) => {
    if (
      Array.isArray(property?.images) &&
      property.images.length > 0
    ) {
      return property.images[0];
    }

    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";
  };

  const getPropertyLocation = (property) => {
    const locationParts = [
      property?.locality,
      property?.city,
      property?.state,
    ].filter(Boolean);

    if (locationParts.length > 0) {
      return locationParts.join(", ");
    }

    return property?.address || "Prime Location";
  };

  /* =========================================
     JSX
  ========================================= */

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* =====================================
          HERO
      ===================================== */}

      <section
        ref={heroRef}
        className="relative flex min-h-screen items-end overflow-hidden"
      >
        {/* Background Image */}

        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90"
            alt="Luxury modern house"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}

        <div
          ref={contentRef}
          className="relative z-10 w-full px-6 pb-16 md:px-10 md:pb-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-5xl">
              <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/60">
                Premium Real Estate
              </p>

              <h1 className="text-6xl font-medium leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-[9rem]">
                Find a place
                <br />
                worth calling home.
              </h1>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                <button
                  onClick={() => {
                    document
                      .getElementById("properties")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                  className="w-fit rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-105"
                >
                  Explore Properties
                </button>

                <p className="max-w-sm text-sm leading-6 text-white/60">
                  Carefully selected properties for living,
                  investing and building your next chapter.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}

        <div className="absolute bottom-8 right-6 z-10 hidden md:block">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span>Scroll</span>

            <span className="block h-px w-12 bg-white/30" />
          </div>
        </div>
      </section>

      {/* =====================================
          INTRO
      ===================================== */}

      <section
        id="about"
        className="bg-black px-6 py-28 md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                About Us
              </p>
            </div>

            <div className="section-heading md:col-span-8">
              <h2 className="max-w-5xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Every property has a story.
                <br />
                We help you find yours.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
                From finding the right neighborhood to closing
                the right deal, we bring properties and people
                together with a simple, transparent approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          PROPERTIES
      ===================================== */}

      <section
        id="properties"
        className="bg-[#0b0b0b] px-6 py-28 md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="section-heading">
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/40">
                Featured Properties
              </p>

              <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Spaces worth
                <br />
                coming home to.
              </h2>
            </div>

            <button
              onClick={() => navigate("/properties")}
              className="w-fit rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition duration-300 hover:border-white/50 hover:bg-white hover:text-black"
            >
              View all properties →
            </button>
          </div>

          {loadingProperties ? (
            <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10">
              <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                Loading properties...
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10">
              <div className="text-center">
                <p className="text-lg text-white/70">
                  No properties available right now.
                </p>

                <p className="mt-2 text-sm text-white/40">
                  Check back soon for new listings.
                </p>
              </div>
            </div>
          ) : (
            <div className="properties-grid grid gap-8 md:grid-cols-2">
              {properties.slice(0, 6).map((property, index) => {
                const image = getPropertyImage(property);
                const location = getPropertyLocation(property);

                return (
                  <article
                    key={property._id}
                    className={`property-card group cursor-pointer ${
                      index % 3 === 0 ? "md:col-span-2" : ""
                    }`}
                    onClick={() =>
                      navigate(`/property/${property._id}`)
                    }
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white/5">
                      <img
                        src={image}
                        alt={property.title || "Property"}
                        className="property-image h-[420px] w-full object-cover md:h-[520px]"
                      />

                      {/* Overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* Property Type */}

                      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                        {property.propertyType || "Property"}
                      </div>

                      {/* Property Info */}

                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                          <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                              {location}
                            </p>

                            <h3 className="max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">
                              {property.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
                              {property.area && (
                                <span>
                                  {property.area} sq.ft
                                </span>
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
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xl font-medium md:text-2xl">
                              {formatPrice(property.price)}
                            </span>

                            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur-md transition duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                              ↗
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          PREMIUM STATISTICS
      ===================================== */}

      <section className="bg-black px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-16 text-center text-xs uppercase tracking-[0.35em] text-white/40">
            Trusted by property buyers
          </p>

          <div className="stats-grid grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* STAT 1 */}

            <div className="stats-card border-t border-white/10 pt-6">
              <Counter value={150} suffix="+" />

              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/40">
                Properties Sold
              </p>
            </div>

            {/* STAT 2 */}

            <div className="stats-card border-t border-white/10 pt-6">
              <Counter value={98} suffix="%" />

              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/40">
                Client Satisfaction
              </p>
            </div>

            {/* STAT 3 */}

            <div className="stats-card border-t border-white/10 pt-6">
              <Counter value={24} suffix="/7" />

              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/40">
                Customer Support
              </p>
            </div>

            {/* STAT 4 */}

            <div className="stats-card border-t border-white/10 pt-6">
              <Counter value={12} suffix="+" />

              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/40">
                Cities Covered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          SERVICES
      ===================================== */}

      <section className="bg-[#0d0d0d] px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="section-heading">
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/40">
              What We Do
            </p>

            <h2 className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Every step of your
              <br />
              property journey.
            </h2>
          </div>

          <div className="services-grid mt-20 grid gap-6 md:grid-cols-3">
            {/* BUY */}

            <div className="service-card group rounded-3xl border border-white/10 p-8 transition duration-500 hover:border-white/30 hover:bg-white/5 md:p-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-2xl transition duration-500 group-hover:scale-110">
                🏠
              </div>

              <h3 className="text-2xl font-medium">
                Buy Property
              </h3>

              <p className="mt-4 leading-7 text-white/50">
                Discover verified homes, apartments, plots
                and villas that match your budget and
                lifestyle.
              </p>

              <div className="mt-10 text-sm text-white/30 transition duration-300 group-hover:translate-x-2 group-hover:text-white">
                Explore properties →
              </div>
            </div>

            {/* SELL */}

            <div className="service-card group rounded-3xl border border-white/10 p-8 transition duration-500 hover:border-white/30 hover:bg-white/5 md:p-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-2xl transition duration-500 group-hover:scale-110">
                📈
              </div>

              <h3 className="text-2xl font-medium">
                Sell Faster
              </h3>

              <p className="mt-4 leading-7 text-white/50">
                Showcase your property with professional
                listings, videos, location maps and lead
                tracking.
              </p>

              <div className="mt-10 text-sm text-white/30 transition duration-300 group-hover:translate-x-2 group-hover:text-white">
                Sell your property →
              </div>
            </div>

            {/* INVEST */}

            <div className="service-card group rounded-3xl border border-white/10 p-8 transition duration-500 hover:border-white/30 hover:bg-white/5 md:p-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-2xl transition duration-500 group-hover:scale-110">
                💎
              </div>

              <h3 className="text-2xl font-medium">
                Invest Smart
              </h3>

              <p className="mt-4 leading-7 text-white/50">
                Compare locations, pricing and opportunities
                before making your next investment.
              </p>

              <div className="mt-10 text-sm text-white/30 transition duration-300 group-hover:translate-x-2 group-hover:text-white">
                Discover opportunities →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          EXPERIENCE
      ===================================== */}

      <section className="experience-section relative overflow-hidden bg-black px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="experience-content md:col-span-7">
              <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/40">
                The Experience
              </p>

              <h2 className="text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                More than
                <br />
                just a property.
              </h2>

              <p className="mt-8 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                Buying or selling property is a major
                decision. Our goal is to make every step
                clearer, easier and more personal.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="mt-10 rounded-full border border-white/20 px-7 py-3.5 text-sm text-white transition duration-300 hover:bg-white hover:text-black"
              >
                Talk to us
              </button>
            </div>

            <div className="relative md:col-span-5">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern luxury interior"
                  className="h-[500px] w-full object-cover md:h-[650px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section
        id="contact"
        className="cta-section bg-white px-6 py-28 text-black md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="cta-content">
            <p className="text-xs uppercase tracking-[0.35em] text-black/40">
              Let's Find It
            </p>

            <h2 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.9] tracking-tight md:text-8xl">
              Your next
              <br />
              chapter starts here.
            </h2>

            <div className="mt-12">
              <a
                href="mailto:hello@estatecrm.com"
                className="inline-flex rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition duration-300 hover:scale-105"
              >
                Get in touch →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="bg-black px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium tracking-[0.18em]">
            ESTATE<span className="text-white/40">CRM</span>
          </p>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} EstateCRM. All
            rights reserved.
          </p>

          <p className="text-xs text-white/30">
            Premium Real Estate Experience
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;