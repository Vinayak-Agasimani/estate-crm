import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageProperties from "./pages/admin/ManageProperties";
import Customers from "./pages/admin/Customers";
import Leads from "./pages/admin/Leads";
import FollowUps from "./pages/admin/FollowUps";
import CustomerDetails from "./pages/admin/CustomerDetails";
import Owners from "./pages/admin/Owners";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />

        {/* =========================
            ADMIN LOGIN
        ========================== */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* =========================
            PROTECTED ADMIN AREA
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/admin/properties"
            element={<ManageProperties />}
          />

          <Route
            path="/admin/customers"
            element={<Customers />}
          />

          <Route
            path="/admin/customers/:id"
            element={<CustomerDetails />}
          />

          <Route
            path="/admin/leads"
            element={<Leads />}
          />

          <Route
            path="/admin/followups"
            element={<FollowUps />}
          />

          <Route
            path="/admin/owners"
            element={<Owners />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;