import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Scenarios from "./pages/Scenarios";
import NlpConsole from "./pages/NlpConsole";
import Account from "./pages/Account";
import Status from "./pages/Status";
import Academy from "./pages/Academy";
import RoiCalculator from "./pages/RoiCalculator";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/verify" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/billing/success" element={<Billing />} />
      <Route path="/scenarios" element={<ProtectedRoute><Scenarios /></ProtectedRoute>} />
      <Route path="/nlp" element={<ProtectedRoute><NlpConsole /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
      <Route path="/academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
      <Route path="/roi" element={<RoiCalculator />} />
    </Routes>
  );
}
