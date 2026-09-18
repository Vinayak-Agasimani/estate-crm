import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    customers: 0,
    leads: 0,
    followUps: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        propertiesResponse,
        customersResponse,
        leadsResponse,
        followUpsResponse,
      ] = await Promise.all([
        api.get("/properties"),
        api.get("/customers"),
        api.get("/leads"),
        api.get("/followups"),
      ]);

      const properties =
        propertiesResponse?.data?.data ||
        propertiesResponse?.data ||
        [];

      const customers =
        customersResponse?.data?.data ||
        customersResponse?.data ||
        [];

      const leads =
        leadsResponse?.data?.data ||
        leadsResponse?.data ||
        [];

      const followUps =
        followUpsResponse?.data?.data ||
        followUpsResponse?.data ||
        [];

      setStats({
        properties: Array.isArray(properties)
          ? properties.length
          : 0,

        customers: Array.isArray(customers)
          ? customers.length
          : 0,

        leads: Array.isArray(leads)
          ? leads.length
          : 0,

        followUps: Array.isArray(followUps)
          ? followUps.length
          : 0,
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const cards = [
    {
      title: "Properties",
      value: stats.properties,
      description: "Manage property listings",
      link: "/admin/properties",
      symbol: "⌂",
    },
    {
      title: "Customers",
      value: stats.customers,
      description: "View customer database",
      link: "/admin/customers",
      symbol: "○",
    },
    {
      title: "Leads",
      value: stats.leads,
      description: "Manage enquiries & leads",
      link: "/admin/leads",
      symbol: "↗",
    },
    {
      title: "Follow-ups",
      value: stats.followUps,
      description: "Track pending follow-ups",
      link: "/admin/followups",
      symbol: "✓",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* LOGO */}

          <Link
            to="/admin/dashboard"
            className="text-lg font-semibold tracking-[0.15em]"
          >
            ESTATE
            <span className="text-black/40">
              CRM
            </span>
          </Link>

          {/* USER */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-black/40">
                {user?.role || "ADMIN"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 px-5 py-2.5 text-xs transition hover:bg-black hover:text-white"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">

        {/* WELCOME */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Admin Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Welcome back
              {user?.name
                ? `, ${user.name.split(" ")[0]}`
                : ""}
              .
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
              Manage your properties, customers,
              leads and follow-ups from one place.
            </p>

          </div>

          <button
            onClick={loadDashboardData}
            className="w-fit rounded-full border border-black/10 bg-white px-5 py-3 text-xs transition hover:bg-black hover:text-white"
          >
            Refresh data
          </button>

        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {cards.map((card) => (

            <Link
              key={card.title}
              to={card.link}
              className="group rounded-3xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-lg text-white">
                  {card.symbol}
                </div>

                <span className="text-black/20 transition group-hover:text-black">
                  ↗
                </span>

              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.15em] text-black/40">
                {card.title}
              </p>

              <p className="mt-2 text-4xl font-semibold">
                {loading ? "—" : card.value}
              </p>

              <p className="mt-2 text-xs text-black/40">
                {card.description}
              </p>

            </Link>

          ))}

        </section>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-10">

          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            Quick actions
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {/* ADD PROPERTY */}

            <Link
              to="/admin/properties"
              className="group rounded-3xl bg-black p-7 text-white transition duration-300 hover:-translate-y-1"
            >

              <div className="flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                  +
                </span>

                <span className="text-white/30 transition group-hover:text-white">
                  ↗
                </span>

              </div>

              <h2 className="mt-10 text-xl font-medium">
                Manage Properties
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Add, edit and publish property
                listings.
              </p>

            </Link>

            {/* CUSTOMERS */}

            <Link
              to="/admin/customers"
              className="group rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10">
                  ○
                </span>

                <span className="text-black/20 transition group-hover:text-black">
                  ↗
                </span>

              </div>

              <h2 className="mt-10 text-xl font-medium">
                Customers
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/40">
                Search customers and view their
                requirements and history.
              </p>

            </Link>

            {/* LEADS */}

            <Link
              to="/admin/leads"
              className="group rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10">
                  ↗
                </span>

                <span className="text-black/20 transition group-hover:text-black">
                  ↗
                </span>

              </div>

              <h2 className="mt-10 text-xl font-medium">
                Leads
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/40">
                View website enquiries and update
                lead status.
              </p>

            </Link>

          </div>
        </section>

        {/* =====================================================
            CRM WORKFLOW
        ===================================================== */}

        <section className="mt-16 rounded-3xl border border-black/10 bg-white p-7 md:p-10">

          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            CRM workflow
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            From enquiry to deal.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/40">
            Keep every customer interaction connected
            to the property and lead.
          </p>

          <div className="mt-10 grid gap-3 md:grid-cols-5">

            {[
              "Enquiry",
              "Contact",
              "Property Shared",
              "Site Visit",
              "Deal",
            ].map((step, index) => (

              <div
                key={step}
                className="relative rounded-2xl border border-black/10 p-5"
              >

                <p className="text-xs text-black/30">
                  0{index + 1}
                </p>

                <p className="mt-5 text-sm font-medium">
                  {step}
                </p>

              </div>

            ))}

          </div>
        </section>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <Link
            to="/admin/leads"
            className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm transition hover:bg-black hover:text-white"
          >
            View Leads →
          </Link>

          <Link
            to="/admin/customers"
            className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm transition hover:bg-black hover:text-white"
          >
            View Customers →
          </Link>

          <Link
            to="/admin/followups"
            className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm transition hover:bg-black hover:text-white"
          >
            View Follow-ups →
          </Link>

          <Link
            to="/admin/properties"
            className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm transition hover:bg-black hover:text-white"
          >
            Manage Properties →
          </Link>

          <Link
            to="/admin/owners"
            className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm transition hover:bg-black hover:text-white"
          >
            Manage Owners →
          </Link>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;